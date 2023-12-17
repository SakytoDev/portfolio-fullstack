const database = require('./../modules/database.js');
const config = require('../modules/config.js');
const bcrypt = require('bcrypt');

const { DateTime } = require('luxon');
const { ObjectId } = require('mongodb');

module.exports = class Account {
    static async getAccount(id, requester) 
    {
        if (id == null || id == 0) { return { code: 'failure' } }

        const db = database.getDatabase()
        const account = await db.collection('accounts').findOne({ _id: new ObjectId(id) }, { projection: { email: 0, password: 0 }})

        if (id != requester) {
            account.friends = account.friends.filter(x => !x.isPending)
        }

        return account
    }

    static async getAccounts(id, requester) 
    {
        const db = database.getDatabase()
        const accounts = await db.collection('accounts').find({ _id: { $ne: new ObjectId(id) } }, { projection: { _id: 1, avatar: 1, nickname: 1 }}).toArray()

        accounts.forEach((item, index) => {
            if (id != requester) accounts[index].friends = accounts[index].friends.filter(x => !x.isPending)
        })

        return accounts
    }

    static async getAvatar(id) 
    {
        const db = database.getDatabase()
        const result = await db.collection('accounts').findOne({ _id: new ObjectId(id) }, { projection: { _id: 0, avatar: 1 } })

        return result?.avatar
    }

    static async getAccountInfo(id)
    {
        const db = database.getDatabase()
        const info = await db.collection('accounts').findOne({ _id: new ObjectId(id) }, { projection: { nickname: 1 } })

        return Object.values(info)
    }

    static async getFriends(id) 
    {
        const db = database.getDatabase()

        const friends = await db.collection('accounts').aggregate([
            { $match: { _id: new ObjectId(id) } },
            { $lookup: { 
                'from': 'accounts', 
                'foreignField': '_id', 
                'localField': 'friends._id', 
                'as': 'friends' 
            }},
            { $project: { 
                _id: 0, 
                friends: { _id: 1, avatar: 1, nickname: 1 } 
            }}
        ])

        return friends
    }

    static async login(nickname, password, sessionID)
    {
        const db = database.getDatabase()
        const accData = await db.collection('accounts').findOne({ nickname: nickname })

        if (accData) {
            const status = await this.checkPasswordHash(password, accData.password)

            if (status) {
                const logoutToken = await Account.getLogoutToken(accData._id.toString(), sessionID)

                return { code: 'success', account: { id: accData._id, nickname: nickname, logoutToken: logoutToken } }
            } else {
                return { code: 'failure', reason: 'Incorrect details' }
            }
        } else {
            return { code: 'failure', reason: 'Account does not exist' }
        }
    }

    static async register(email, nickname, password) 
    {
        const currentDate = DateTime.local().toISO()
        const passwordHash = await this.getPasswordHash(password)
        const accountObj = { 
            email: email,
            avatar: null,
            nickname: nickname,
            password: passwordHash,
            friends: [],
            lastLogin: currentDate,
            dateCreated: currentDate 
        }

        const db = database.getDatabase()
        const accExists = await db.collection('accounts').findOne({ $or: [ { email: email }, { nickname: nickname } ] })

        if (!accExists) {
            await db.collection('accounts').insertOne(accountObj)
            
            return { code: 'success' }
        }
        else {
            return { code: 'failure', reason: 'Email or nickname already exists' }
        }
    }

    static getLogoutToken(id, sessionID) 
    {
        return new Promise((resolve, reject) => {            
            const tokenArray = [id, config.sessionSecret, sessionID]
            
            bcrypt.genSalt(10, function(err, salt) {
                if (err) reject(err)
                
                bcrypt.hash(tokenArray.join(), salt, function(err, hash) {
                    if (err) reject(err)

                    resolve(hash)
                })
            })
        })
    }

    static getPasswordHash(password)
    {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function(err, salt) {
                if (err) reject(err)

                const tokenArray = [password, config.passwordSalt]
                
                bcrypt.hash(tokenArray.join(), salt, function(err, hash) {
                    if (err) reject(err)
                    resolve(hash)
                })
            })
        })
    }

    static checkPasswordHash(password, hash) 
    {
        return new Promise((resolve, reject) => {
            const tokenArray = [password, config.passwordSalt]

            bcrypt.compare(tokenArray.join(), hash, function(err, status) {
                if (err) reject(err)
                resolve(status)
            })
        })
    }

    static updateLastLogin(id)
    {
        if (id == null || id == 0) return

        const currentDate = DateTime.local().toISO()

        const db = database.getDatabase()
        db.collection('accounts').updateOne(
            { _id: new ObjectId(id) }, 
            { $set: { lastLogin: currentDate } }
        )
    }

    static async updateAvatar(id, image) 
    {
        const db = database.getDatabase()
        await db.collection('accounts').updateOne(
            { _id: new ObjectId(id) }, 
            { $set: { avatar: image } }
        )

        return image
    }

    static async addFriend(id, userID) 
    {
        const db = database.getDatabase()
        
        const account = await this.getAccount(id)

        await db.collection('accounts').updateOne(
            { _id: new ObjectId(id), "friends._id": new ObjectId(userID) }, 
            { $set: { "friends.$.pending": false } }
        )
        await db.collection('accounts').updateOne(
            { _id: new ObjectId(userID) }, 
            { $push: { friends: { _id: new ObjectId(id), pending: account.friends.findIndex(x => x._id.toString() === userID) == -1 } } }
        )

        const userAccount = await this.getAccount(userID)

        return userAccount.friends
    }

    static async removeFriend(id, userID) 
    {
        const db = database.getDatabase()
        await db.collection('accounts').updateOne(
            { _id: new ObjectId(id) }, 
            { $pull: { friends: { _id: new ObjectId(userID) } } }
        )
        await db.collection('accounts').updateOne(
            { _id: new ObjectId(userID) }, 
            { $pull: { friends: { _id: new ObjectId(id) } } }
        )

        const account = await this.getAccount(userID)

        return account.friends
    }
}
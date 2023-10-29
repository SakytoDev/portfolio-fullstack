const database = require('./../modules/database.js');
const config = require('../modules/config.js');
const bcrypt = require('bcrypt');

const { DateTime } = require('luxon');
const { ObjectId } = require('mongodb');

module.exports = class Account {
    static async getAccount(id) 
    {
        if (id == null || id == 0) { return { code: 'failure' } }

        const db = database.getDatabase()
        const account = await db.collection('accounts').findOne({ _id: new ObjectId(id) }, { projection: { email: 0, password: 0 }})

        return account
    }

    static async getAccounts() 
    {
        const db = database.getDatabase()
        const accounts = await db.collection('accounts').find({}, { projection: { _id: 1, nickname: 1 }}).toArray()

        return accounts
    }

    static async getAccountInfo(id)
    {
        const db = database.getDatabase()
        const info = await db.collection('accounts').findOne({ _id: new ObjectId(id) }, { projection: { nickname: 1 }})

        return Object.values(info)
    }

    static async getFriends(id) 
    {
        if (id == null || id == 0) { return { code: 'failure' } }

        const db = database.getDatabase()
        const friends = await db.collection('accounts').findOne({ _id: new ObjectId(id) }, { projection: { _id: 0, friends: 1 }})

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

                return { id: accData._id, nickname: nickname, logoutToken: logoutToken }
            }
        }
    }

    static async register(email, nickname, password) 
    {
        const currentDate = DateTime.local().toISO()
        const passwordHash = await this.getPasswordHash(password)
        const accountObj = { 
            email: email, 
            nickname: nickname,
            password: passwordHash,
            friends: [],
            lastLogin: currentDate,
            dateCreated: currentDate 
        }

        const db = database.getDatabase()
        const accExists = await db.collection('accounts').findOne({ $or: [ { email: email }, { nickname: nickname } ] })

        if (accExists == null) {
            await db.collection('accounts').insertOne(accountObj)
            
            return { code: 'success' }
        }
        else {
            return { code: 'failure', reason: 'Почта или никнейм заняты' }
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
            { _id : new ObjectId(id) }, 
            { $set : { lastLogin : currentDate } }
        )
    }
}
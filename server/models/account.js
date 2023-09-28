import database from '../modules/database.js'
import config from '../modules/config.js'
import bcrypt from 'bcrypt'

import { DateTime } from 'luxon'
import { ObjectId } from 'mongodb'

export default class Account 
{
    static async getNicknameByID(id)
    {
        var db = database.getDatabase()
        const acc = await db.collection('accounts').findOne({ _id: new ObjectId(id) })

        return acc.nickname
    }

    static async login(nickname, password, sessionID)
    {
        const db = database.getDatabase()

        const acc = await db.collection('accounts').findOne({ 'nickname': nickname })

        if (acc) {
            const status = await this.checkPasswordHash(password, acc.password)

            if (status) {
                Account.updateLastLogin(acc._id)

                const logoutToken = await Account.getLogoutToken(acc._id.toString(), sessionID)

                return { "id": acc._id.toString(), "logoutToken": logoutToken }
            }
        }
    }

    static async register(email, nickname, password) 
    {
        var db = database.getDatabase()
        
        const currentDate = DateTime.local().toISO()
        const passwordHash = await this.getPasswordHash(password)
        const accountObj = { 
            "email": email, 
            "nickname": nickname, 
            "password": passwordHash, 
            "lastLogin": currentDate,
            "dateCreated": currentDate 
        }

        const accExists = await db.collection('accounts').findOne({ $or: [ { "email": email }, {"nickname": nickname} ] })

        if (accExists == null) {
            await db.collection("accounts").insertOne(accountObj)
            
            return { "code": "success" }
        }
        else {
            return { "code": "failure", "reason": "Почта или никнейм заняты" }
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
        const currentDate = DateTime.local().toISO()

        var db = database.getDatabase()

        db.collection("accounts").updateOne(
            { "_id" : id }, 
            { "$set" : { "lastLogin" : currentDate } }
        )
    }
}
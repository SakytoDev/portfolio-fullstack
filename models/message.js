import database from './../modules/database.js'

import Account from './account.js'

import { DateTime } from 'luxon'

export default class Message 
{
    static async SaveChatMessage(id, message)
    {
        const nickname = await Account.getNicknameByID(id)
        const sendDate = DateTime.local().toISO();
        const formattedDate = DateTime.fromISO(sendDate).toFormat('MMM dd, HH:mm')
        
        const messageObj = { "senderID": id, "message": message, "sendDate": sendDate }

        var db = database.getDatabase()
        await db.collection('messages').insertOne(messageObj)

        return { "id": id, "nickname": nickname, "message": message, "sendDate": formattedDate }
    }
}
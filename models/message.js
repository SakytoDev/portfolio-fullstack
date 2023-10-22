const database = require('./../modules/database.js');

const Account = require('./account.js');

const { DateTime } = require('luxon');

module.exports = class Message 
{
    static async SaveChatMessage(id, message)
    {
        const nickname = await Account.getNicknameByID(id)
        const sendDate = DateTime.local().toISO();
        
        const messageObj = { "senderID": id, "message": message, "sendDate": sendDate }

        var db = database.getDatabase()
        await db.collection('messages').insertOne(messageObj)

        return { "id": id, "nickname": nickname, "message": message, "sendDate": sendDate }
    }
}
const database = require('./../modules/database.js');

const Account = require('./account.js')

const { DateTime } = require('luxon');

module.exports = class Message 
{
    static async GetConversationMessages(sender, recipient) 
    {
        const db = database.getDatabase()
        const messages = await db.collection('messages').find({ sender: { $in: [sender, recipient]}, recipient: { $in: [sender, recipient]} }).toArray()

        for (let i = 0; i < messages.length; i++) {
            messages[i].sender = await Account.getAccountInfo(messages[i].sender)
            messages[i].recipient = await Account.getAccountInfo(messages[i].recipient)
        }

        return messages
    }

    static async SaveChatMessage(message)
    {
        message.sendDate = DateTime.local().toISO()

        const db = database.getDatabase()
        await db.collection('messages').insertOne(message)

        message.sender = await Account.getAccountInfo(message.sender)
        message.recipient = await Account.getAccountInfo(message.recipient)

        return message
    }
}
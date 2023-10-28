const database = require('./../modules/database.js');

const { DateTime } = require('luxon');
const { ObjectId } = require('mongodb');

module.exports = class Conversation 
{
    static async GetConversation(id, requester) 
    {
        const db = database.getDatabase()
        const findResult = await db.collection('conversations').findOne({ _id: new ObjectId(id), participants: { $in: [requester] } })

        if (!findResult) {
            const currentDate = DateTime.local().toISO()
            const conversationObj = { _id: new ObjectId(id), participants: [id, requester], messages: [], dateCreated: currentDate }

            await db.collection('conversations').insertOne(conversationObj)

            return conversationObj
        }

        return findResult
    }

    static async AddMessage(data)
    {
        const message = { sender: data.sender, message: data.message, sendDate: DateTime.local().toISO() }

        const db = database.getDatabase()
        await db.collection('conversations').updateOne({ _id: new ObjectId(data.conversation) }, { $push: { messages: message } })

        return message
    }
}
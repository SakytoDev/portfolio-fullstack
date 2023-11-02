const database = require('./../modules/database.js');

const { DateTime } = require('luxon');
const { ObjectId } = require('mongodb');

module.exports = class Conversation 
{
    static async GetConversation(id, requester) 
    {
        let conversation

        const db = database.getDatabase()
        let isUser = await db.collection('accounts').findOne({ _id: new ObjectId(id) })

        if (isUser) {
            const privateConversation = await db.collection('conversations').findOne({ participants: { $all: [id, requester], $size: 2 } })

            if (!privateConversation) {
                const currentDate = DateTime.local().toISO()
                const conversationObj = { participants: [id, requester], messages: [], dateCreated: currentDate }

                await db.collection('conversations').insertOne(conversationObj)

                conversation = conversationObj
            } else {
                conversation = privateConversation
            }
        } 
        else {
            conversation = await db.collection('conversations').findOne({ _id: new ObjectId(id), participants: { $in: [requester] } })

            if (!conversation) {
                return null
            }
        }

        const participants = await this.GetParticipantData(conversation.participants)
        conversation.participants = participants

        return conversation
    }

    static async GetConversations(id) 
    {
        const db = database.getDatabase()
        const conversations = await db.collection('conversations').find({ participants: { $in: [id] } }).toArray()

        for (let i = 0; i < conversations.length; i++) {
            const participants = await this.GetParticipantData(conversations[i].participants)
            conversations[i].participants = participants
        }

        return conversations
    }

    static async GetParticipantData(ids)
    {
        const db = database.getDatabase()
        const userData = await db.collection('accounts').find({ _id: { $in: ids.map((id) => new ObjectId(id)) } }, { projection: { _id: 1, avatar: 1, nickname: 1 }}).toArray()

        return userData
    }

    static async AddMessage(data)
    {
        const message = { sender: data.sender, message: data.message, sendDate: DateTime.local().toISO() }

        const db = database.getDatabase()
        const conversation = await db.collection('conversations').findOne({ _id: new ObjectId(data.conversation), participants: { $in: [data.sender] } })

        if (conversation) {
            await db.collection('conversations').updateOne({ _id: new ObjectId(data.conversation) }, { $push: { messages: message } })
            return { id: conversation._id, participants: conversation.participants, message: message }
        } 
        else return null
    }
}
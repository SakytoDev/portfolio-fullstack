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
        const message = { _id: new ObjectId(), sender: data.sender, message: data.message, edited: [false, null], sendDate: DateTime.local().toISO() }

        const db = database.getDatabase()
        const conversation = await db.collection('conversations').findOne({ _id: new ObjectId(data.conversationID), participants: { $in: [message.sender] } })

        if (conversation) {
            await db.collection('conversations').updateOne({ _id: new ObjectId(data.conversationID) }, { $push: { messages: message } })
            return { conversationID: conversation._id, participants: conversation.participants, message: message }
        } 
        else return null
    }

    static async EditMessage(data) 
    {
        const db = database.getDatabase()
        await db.collection('conversations').updateOne({ _id: new ObjectId(data.conversationID), 'messages._id': new ObjectId(data.messageID) }, { $set: { 'messages.$.message': data.edit, 'messages.$.edited': [true, DateTime.local().toISO()] } })

        const updatedMsg = await db.collection('conversations')
        .aggregate([ 
            { $match: { _id: new ObjectId(data.conversationID), 'messages._id': new ObjectId(data.messageID) } },
            { $project: {
                participants: 1,
                result: { $filter: { input: '$messages', as: 'msg', cond: { $eq: [ '$$msg._id', new ObjectId(data.messageID) ] } } }
            }},
            { $project: { participants: 1, result: { $first: '$result' } } },
            { $project: {
                _id: 0,
                conversationID: '$_id',
                participants: 1,
                message: { _id: '$result._id', message: '$result.message', edited: '$result.edited' }
            }}
        ])
        .toArray()

        return updatedMsg[0]
    }

    static async DeleteMessage(data) 
    {
        const db = database.getDatabase()
        const conversation = await db.collection('conversations').findOne({ _id: new ObjectId(data.conversationID) })

        if (conversation) {
            await db.collection('conversations').updateOne({ _id: new ObjectId(data.conversationID) }, { $pull: { messages: { _id: new ObjectId(data.messageID) } } })
            return { conversationID: conversation._id, participants: conversation.participants }
        } else {
            return null
        }
    }
}
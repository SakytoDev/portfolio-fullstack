const database = require('./../modules/database.js');

const { DateTime } = require('luxon');
const { ObjectId } = require('mongodb');

module.exports = class Conversation 
{
    static async GetConversation(id, requester) 
    {
        let conversationId = new ObjectId(id)

        const db = database.getDatabase()
        const isUser = await db.collection('accounts').findOne({ _id: new ObjectId(id) })

        if (isUser) {
            await db.collection('conversations').findOne({ 
                participants: { $all: [new ObjectId(id), new ObjectId(requester)], $size: 2 } 
            })
            .then(async (result) => {
                if (!result) {
                    await db.collection('conversations').insertOne({ participants: [new ObjectId(id), new ObjectId(requester)], messages: [], dateCreated: DateTime.local().toISO() })
                    .then(result => { conversationId = result.insertedId })
                } else {
                    conversationId = result._id
                }
            })
        }

        const conversation = await db.collection('conversations').aggregate([
            { $match: { _id: conversationId, participants: { $in: [new ObjectId(requester)] } } },
            { $lookup: { from: 'accounts', foreignField: '_id', localField: 'participants', as: 'participants' } },
            { $project: { 
                _id: 1, 
                participants: { _id: 1, avatar: 1, nickname: 1 }, 
                messages: { _id: 1, sender: 1, message: 1, edited: 1, sendDate: 1 },
                index: { $indexOfArray: [ { $map: { input: '$participants', in: { $ne: [ '$$this._id', new ObjectId(requester) ] } } }, true ] }
            }}
        ])
        .toArray()

        conversation[0].messages.forEach((item) => {
            item.owner = item.sender == requester
        })

        return conversation[0]
    }

    static async GetConversations(id) 
    {
        const db = database.getDatabase()

        const conversations = await db.collection('conversations').aggregate([
            { $match: { 'participants': new ObjectId(id) } },
            { $lookup: { 
                from: 'accounts', 
                foreignField: '_id', 
                localField: 'participants', 
                as: 'participants' 
            }},
            { $project: { 
                _id: 1, 
                participants: { avatar: 1, nickname: 1 },
                index: { $indexOfArray: [ { $map: { input: '$participants', in: { $ne: [ '$$this._id', new ObjectId(id) ] } } }, true ] }
            }}
        ])
        .toArray()

        return conversations
    }

    static async AddMessage(data)
    {
        const message = { 
            _id: new ObjectId(), 
            sender: new ObjectId(data.sender), 
            message: data.message, 
            edited: [false, null], 
            sendDate: DateTime.local().toISO() 
        }

        const db = database.getDatabase()
        const conversation = await db.collection('conversations').findOne({ 
            _id: new ObjectId(data.conversationID), 
            participants: { $in: [new ObjectId(message.sender)] } 
        })
        .then(async (result) => {
            if (result) {
                await db.collection('conversations').updateOne({ _id: new ObjectId(data.conversationID) }, { $push: { messages: message } })
                return { conversationID: result._id, participants: result.participants, message: message }
            } else {
                return null
            }
        })

        return conversation
    }

    static async EditMessage(data) 
    {
        const db = database.getDatabase()
        await db.collection('conversations').updateOne({ 
            _id: new ObjectId(data.conversationID), 
            'messages._id': new ObjectId(data.messageID), 
            'messages.sender': new ObjectId(data.requester) }, 
            { $set: { 
                'messages.$.message': data.edit, 
                'messages.$.edited': [true, DateTime.local().toISO()] 
            } 
        })

        const updatedMsg = await db.collection('conversations')
        .aggregate([ 
            { $match: { _id: new ObjectId(data.conversationID), 'messages._id': new ObjectId(data.messageID) } },
            { $project: {
                participants: 1,
                result: { $filter: { input: '$messages', as: 'msg', cond: { $eq: [ '$$msg._id', new ObjectId(data.messageID) ] } } }
            }},
            { $project: { 
                participants: 1, 
                result: { $first: '$result' } 
            }},
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

        const conversation = await db.collection('conversations').findOne({ 
            _id: new ObjectId(data.conversationID), 
            'messages._id': new ObjectId(data.messageID), 
            'messages.sender': new ObjectId(data.requester)
        })
        .then(async (result) => {
            if (result) {
                await db.collection('conversations').updateOne({ _id: new ObjectId(data.conversationID) }, { $pull: { messages: { _id: new ObjectId(data.messageID) } } })
                return { conversationID: result._id, participants: result.participants }
            } else {
                return null
            }
        })

        return conversation
    }
}
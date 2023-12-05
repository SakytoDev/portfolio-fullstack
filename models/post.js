const database = require('../modules/database.js');

const { DateTime } = require('luxon');
const { ObjectId } = require('mongodb');

module.exports = class Post
{
    static async GetPosts(requester) 
    {
        const db = database.getDatabase()
        const posts = await db.collection('posts')
        .aggregate([ 
            { $lookup: { 'from': 'accounts', 'localField': 'poster', 'foreignField': '_id', 'as': 'nickname' } }, 
            { $project: { 
                poster: ['$poster', { $first: '$nickname.nickname' }], 
                post: 1,
                edited: 1,
                reactions: { 
                    likes: [{ $size: '$reactions.likes' }, { $in: [requester, '$reactions.likes'] }], 
                    dislikes: [{ $size: '$reactions.dislikes' }, { $in: [requester, '$reactions.dislikes'] }] 
                }, 
                dateCreated: 1 
            }} 
        ])
        .toArray()

        return posts
    }

    static async CreatePost(post) 
    {
        const db = database.getDatabase()

        const currentDate = DateTime.local().toISO()

        const postObj = {
            _id: new ObjectId(),
            poster: new ObjectId(post.requester),
            post: post.post,
            edited: [false, null],
            reactions: { likes: [], dislikes: [] },
            dateCreated: currentDate
        }

        await db.collection('posts').insertOne(postObj)

        const createdPost = await db.collection('posts')
        .aggregate([ 
            { $match: { '_id': postObj._id } }, 
            { $lookup: { 'from': 'accounts', 'localField': 'poster', 'foreignField': '_id', 'as': 'nickname' } }, 
            { $project: { 
                poster: ['$poster', { $first: '$nickname.nickname' }], 
                post: 1,
                edited: 1,
                reactions: { 
                    likes: [{ $size: '$reactions.likes' }, false],
                    dislikes: [{ $size: '$reactions.dislikes' }, false] 
                }, 
                dateCreated: 1 
            }} 
        ])
        .toArray()

        return createdPost[0]
    }

    static async EditPost(data) 
    {
        const db = database.getDatabase()
        await db.collection('posts').updateOne({ _id: new ObjectId(data.postId), poster: new ObjectId(data.requester) }, { $set: { post: data.edit, edited: [true, DateTime.local().toISO()] } })

        const updatedPost = await db.collection('posts').findOne({ _id: new ObjectId(data.postId) }, { post: 1, edited: 1 })
        return updatedPost
    }

    static async DeletePost(data) 
    {
        const db = database.getDatabase()
        await db.collection('posts').deleteOne({ _id: new ObjectId(data.postId), poster: new ObjectId(data.requester) })
    }

    static async ReactToPost(data) 
    {
        const db = database.getDatabase()

        switch (data.react) {
            case 'like':
                await db.collection('posts').findOne({ _id: new ObjectId(data.postId), 'reactions.likes': data.requester })
                .then(async (result) => {
                    if (result) {
                        await db.collection('posts').updateOne({ _id: new ObjectId(data.postId) }, { $pull: { 'reactions.likes': data.requester } })
                    } else {
                        await db.collection('posts').updateOne({ _id: new ObjectId(data.postId) }, { $push: { 'reactions.likes': data.requester } })
                    }
                })
                await db.collection('posts').updateOne({ _id: new ObjectId(data.postId) }, { $pull: { 'reactions.dislikes': data.requester } })
                break;
            case 'dislike':
                await db.collection('posts').findOne({ _id: new ObjectId(data.postId), 'reactions.dislikes': data.requester })
                .then(async (result) => {
                    if (result) {
                        await db.collection('posts').updateOne({ _id: new ObjectId(data.postId) }, { $pull: { 'reactions.dislikes': data.requester } })
                    } else {
                        await db.collection('posts').updateOne({ _id: new ObjectId(data.postId) }, { $push: { 'reactions.dislikes': data.requester } })
                    }
                })
                await db.collection('posts').updateOne({ _id: new ObjectId(data.postId) }, { $pull: { 'reactions.likes': data.requester } })
                break;
        }

        const updatedReactions = await db.collection('posts')
        .aggregate([ 
            { $match: { _id: new ObjectId(data.postId) } },
            { $project: {
                reactions: { 
                    likes: [{ $size: '$reactions.likes' }, { $in: [data.requester, '$reactions.likes'] }],
                    dislikes: [{ $size: '$reactions.dislikes' }, { $in: [data.requester, '$reactions.dislikes'] }] 
                },
            }} 
        ])
        .toArray()

        return updatedReactions[0]
    }
}
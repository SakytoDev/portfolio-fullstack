const database = require('../modules/database.js');

const { DateTime } = require('luxon');
const { ObjectId } = require('mongodb');

module.exports = class Music 
{
    static async GetAllMusic() 
    {
        const db = database.getDatabase()

        const music = await db.collection('music').aggregate([
            { $match: { verified: true } },
            { $project: { 
                _id: 1, 
                name: 1, 
                artists: 1, 
                image: 1
            }}
        ]).toArray()

        return music
    }

    static async GetMusic(id) 
    {
        const db = database.getDatabase()

        const music = await db.collection('music').aggregate([
            { $match: { _id: new ObjectId(id) } },
            { $project: { music: 1 } }
        ]).toArray()

        return music[0].music
    }

    static async GetMusicCover(id)
    {
        const db = database.getDatabase()

        const music = await db.collection('music').aggregate([
            { $match: { _id: new ObjectId(id) } },
            { $project: { cover: 1 } }
        ]).toArray()

        return music[0].cover
    }

    /* static async CreateRequest(id, form, filename) 
    {
        const db = database.getDatabase()

        const musicObj = {
            _id: new ObjectId(filename),
            requester: new ObjectId(id),
            name: form.musicName,
            artists: form.artists,
            verified: false,
            dateCreated: DateTime.local().toISO()
        }

        await db.collection('music').insertOne(musicObj)
    } */

    static async CreateRequest(id, form, music, cover) 
    {
        const db = database.getDatabase()

        const musicObj = {
            _id: new ObjectId(),
            requester: new ObjectId(id),
            name: form.musicName,
            artists: form.artists,
            music: music,
            cover: cover,
            verified: false,
            dateCreated: DateTime.local().toISO()
        }

        await db.collection('music').insertOne(musicObj)
    }
}
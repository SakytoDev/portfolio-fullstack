const { MongoClient } = require('mongodb');
const config = require('./config.js');

let URI = process.env.MONGODB_URI;

if (config.isDev) {
    URI = process.env.MONGODB_URI_DEV
}

const client = new MongoClient(URI);

let database;

module.exports = 
{
    Setup : async function() {
        await client.connect()
        .then(() => {
            database = client.db()
            console.log("MongoDB подключен")
        })
        .catch()
    },
    getClient : () => client,
    getDatabase : () => database
}
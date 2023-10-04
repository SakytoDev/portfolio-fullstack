const { MongoClient } = require('mongodb');
require('dotenv/config');

const URI = process.env.MONGODB_URI;
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
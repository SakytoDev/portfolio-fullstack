const { MongoClient } = require('mongodb');
const config = require('./config.js');

const client = new MongoClient(config.isDev ? process.env.MONGODB_URI_DEV : process.env.MONGODB_URI);

let database;

module.exports = 
{
    Setup : async function() {
        await client.connect()
        .then(() => {
            database = client.db()
            console.log("MongoDB подключен")
        })
        .catch(err => console.log(err))
    },
    getClient : () => client,
    getDatabase : () => database
}
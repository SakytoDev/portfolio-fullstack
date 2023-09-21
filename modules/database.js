import { MongoClient } from 'mongodb'

const URI = "mongodb://Sakyto:22dns228KLOWNS@localhost:27017/chat"
const client = new MongoClient(URI)

let database

async function Setup() {
    await client.connect()
    .then(() => {
        database = client.db()
        console.log("MongoDB подключен")
    })
    .catch()
}

export default { Setup, client, database }
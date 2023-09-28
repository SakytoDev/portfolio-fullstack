import { MongoClient } from 'mongodb'
import 'dotenv/config'

const URI = process.env.MONGODB_URI
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

const getClient = () => client
const getDatabase = () => database

export default { Setup, getClient, getDatabase }
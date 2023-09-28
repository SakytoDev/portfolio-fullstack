import server from './server.js'

import Message from '../models/message.js'
import Account from '../models/account.js'

function Setup()
{
    server.io.on('connection', (socket) => 
    {
        socket.on('authUpdate', async (reqData) => {
            socket.account = reqData

            let nicknames = []
            const allClients = await server.io.fetchSockets()

            for (const client of allClients) {
                if (!client.account) continue

                const nickname = await Account.getNicknameByID(client.account.id)
                nicknames.push(nickname)
            }

            server.io.emit('onlineList', nicknames)
        })

        socket.on('chatMessage', async (reqData) => {
            if (!reqData.id) return

            const messageObj = await Message.SaveChatMessage(reqData.id, reqData.message)

            server.io.emit('chatMessage', messageObj)
        })

        socket.on('disconnect', async () => {
            let nicknames = []
            const allClients = await server.io.fetchSockets()

            for (const client of allClients) {
                if (!client.account) continue

                const nickname = await Account.getNicknameByID(client.account.id)
                nicknames.push(nickname)
            }

            server.io.emit('onlineList', nicknames)
        })
    })
}

export default { Setup }
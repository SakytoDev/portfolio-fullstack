const server = require('./server.js');

const Account = require('../models/account.js');
const Conversation = require('../models/conversation.js');

module.exports = 
{
    Setup: function () 
    {
        server.io.on('connection', (socket) => 
        {
            socket.accData = { id: '' }

            socket.on('authUpdate', (data) => {
                socket.accData = { id: data }
            })

            socket.on('isOnline', async (data) => {
                const allClients = await server.io.fetchSockets()
                let isOnline = false

                for (const client of allClients) {
                    if (client.accData.id != data) continue

                    isOnline = true
                    break
                }

                socket.emit('isOnline', { id: data, isOnline: isOnline })
            })

            socket.on('chatMessage', async (data) => {
                const message = await Conversation.AddMessage(data)
                if (!message) return 

                const allClients = await server.io.fetchSockets()

                for (const client of allClients) {
                    if (data.conversation == message.id && message.participants.includes(client.accData.id)) {
                        client.emit('chatMessage', message.message)
                    }
                }
            })

            socket.on('disconnect', () => {
                Account.updateLastLogin(socket.accData.id)
            })
        })
    }
}
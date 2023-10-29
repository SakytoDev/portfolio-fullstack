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
                socket.accData = data
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

                const allClients = await server.io.fetchSockets()

                for (const client of allClients) {
                    if (data.sender != client.accData.id && data.conversation != client.accData.id) continue

                    client.emit('chatMessage', message)
                }
            })

            socket.on('disconnect', () => {
                Account.updateLastLogin(socket.accData.id)
            })
        })
    }
}
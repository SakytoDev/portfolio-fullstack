const server = require('./server.js');

const Account = require('../models/account.js');
const Message = require('./../models/message.js');

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
                    if (client.accData.id != data.id) continue

                    isOnline = true
                    break
                }

                socket.emit('isOnline', isOnline)
            })

            socket.on('chatMessage', async (data) => {
                const message = await Message.SaveChatMessage(data)

                const allClients = await server.io.fetchSockets()

                for (const client of allClients) {
                    if (data.sender != client.accData.id && data.recipient != client.accData.id) continue

                    client.emit('chatMessage', message)
                }
            })

            socket.on('disconnect', () => {
                Account.updateLastLogin(socket.accData.id)
            })
        })
    }
}
const server = require('./server.js');

const Message = require('./../models/message.js');
const Account = require('../models/account.js');

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

            socket.on('disconnect', () => {
                Account.updateLastLogin(socket.accData.id)

                console.log('Клиент отключился')
            })
        })
    }
}
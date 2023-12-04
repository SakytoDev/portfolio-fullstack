const server = require('./server.js');

const Account = require('../models/account.js');
const Conversation = require('../models/conversation.js');
const Post = require('../models/post.js');

module.exports = 
{
    Setup: function () 
    {
        server.io.on('connection', (socket) => 
        {
            socket.accData = { id: '' }

            socket.on('authUpdate', (data) => {
                socket.accData = { id: data }
                server.io.emit('isOnline', { id: socket.accData.id, isOnline: true })
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
                    if (data.conversationID == message.conversationID && message.participants.includes(client.accData.id)) {
                        client.emit('chatMessage', message.message)
                    }
                }
            })

            socket.on('editMessage', async (data) => {
                const result = await Conversation.EditMessage(data)

                if (result) {
                    const allClients = await server.io.fetchSockets()
                    
                    for (const client of allClients) {
                        if (data.conversationID == result.conversationID && result.participants.includes(client.accData.id)) {
                            client.emit('editMessage', result.message)
                        }
                    }
                }
            })

            socket.on('deleteMessage', async (data) => {
                const result = await Conversation.DeleteMessage(data)

                if (result) {
                    const allClients = await server.io.fetchSockets()
                    
                    for (const client of allClients) {
                        if (data.conversationID == result.conversationID && result.participants.includes(client.accData.id)) {
                            client.emit('deleteMessage', data.messageID)
                        }
                    }
                }
            })

            socket.on('createPost', async (data) => {
                const post = await Post.CreatePost(data)
                
                server.io.emit('createPost', post)
            })

            socket.on('editPost', async (data) => {
                const post = await Post.EditPost(data)

                server.io.emit('editPost', post)
            })

            socket.on('deletePost', async (data) => {
                await Post.DeletePost(data)

                server.io.emit('deletePost', { _id: data.postId })
            })

            socket.on('reactPost', async (data) => {
                const reactions = await Post.ReactToPost(data)

                server.io.emit('reactPost', reactions)
            })

            socket.on('disconnect', () => {
                server.io.emit('isOnline', { id: socket.accData.id, isOnline: false })
                Account.updateLastLogin(socket.accData.id)
            })
        })
    }
}
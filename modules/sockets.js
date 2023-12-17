const server = require('./server.js');

const Account = require('../models/account.js');
const Conversation = require('../models/conversation.js');
const Post = require('../models/post.js');

const { ObjectId } = require('mongodb');

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
                data.sender = socket.accData.id
                const result = await Conversation.AddMessage(data)

                if (!result) return 

                const allClients = await server.io.fetchSockets()

                for (const client of allClients) {
                    if (result.participants.findIndex(x => x.toString() == client.accData.id) != -1) {
                        result.message.owner = socket.accData.id == client.accData.id
                        client.emit('chatMessage', result.message)
                    }
                }
            })

            socket.on('editMessage', async (data) => {
                data.requester = socket.accData.id
                const result = await Conversation.EditMessage(data)

                if (result) {
                    const allClients = await server.io.fetchSockets()
                    
                    for (const client of allClients) {
                        if (result.participants.findIndex(x => x.toString() == client.accData.id) != -1) {
                            client.emit('editMessage', result.message)
                        }
                    }
                }
            })

            socket.on('deleteMessage', async (data) => {
                data.requester = socket.accData.id
                const result = await Conversation.DeleteMessage(data)

                if (result) {
                    const allClients = await server.io.fetchSockets()
                    
                    for (const client of allClients) {
                        if (result.participants.findIndex(x => x.toString() == client.accData.id) != -1) {
                            client.emit('deleteMessage', data.messageID)
                        }
                    }
                }
            })

            socket.on('createPost', async (data) => {
                data.requester = socket.accData.id
                const post = await Post.CreatePost(data)
                
                const allClients = await server.io.fetchSockets()
                    
                for (const client of allClients) {
                    post.owner = post.poster[0] == client.accData.id
                    client.emit('createPost', post)
                }
            })

            socket.on('editPost', async (data) => {
                data.requester = socket.accData.id
                const post = await Post.EditPost(data)

                const allClients = await server.io.fetchSockets()
                    
                for (const client of allClients) {
                    post.owner = post.poster == client.accData.id
                    client.emit('editPost', post)
                }
            })

            socket.on('deletePost', async (data) => {
                data.requester = socket.accData.id
                await Post.DeletePost(data)

                const allClients = await server.io.fetchSockets()
                    
                for (const client of allClients) {
                    client.emit('deletePost', { _id: data.postId, owner: socket.accData.id == client.accData.id })
                }
            })

            socket.on('reactPost', async (data) => {
                data.requester = socket.accData.id
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
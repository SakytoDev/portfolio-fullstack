const fs = require('fs');
const path = require('path');

const Account = require('../models/account.js');
const Conversation = require('../models/conversation.js');
const Post = require('../models/post.js');
const server = require('./server.js');

module.exports = 
{
    Setup: function() {
        server.app.get('*/api', async (req, res) => 
        {
            const requestType = req.query.type
            
            if (requestType == 'getAcc') {
                if (req.session.account) {
                    res.send( { code: 'success', account: req.session.account } )
                } else {
                    res.send( { code: 'failure', reason: 'Аккаунт не авторизован' } )
                }
            }

            if (requestType == 'getAccInfo') {
                const account = await Account.getAccount(req.query.id, req.session.account.id)

                if (account) {
                    res.send( { code: 'success', account: account } )
                } else {
                    res.send( { code: 'failure' } )
                }
            }

            if (requestType == 'getAvatar') {
                const avatar = await Account.getAvatar(req.query.id)

                res.send( { code: 'success', image: avatar } )
            }

            if (requestType == 'getContacts') {
                const accounts = await Account.getAccounts(req.query.id, req.session.account.id)
                const friends = await Account.getFriends(req.session.account.id)

                res.send( { code: 'success', people: [accounts, friends] } )
            }

            if (requestType == 'getConversation') {
                const conversation = await Conversation.GetConversation(req.query.id, req.session.account.id)

                if (conversation) {
                    res.send( { code: 'success', conversation: conversation } )
                } else {
                    res.send( { code: 'failure' } )
                }
            }

            if (requestType == 'getConversations') {
                const conversations = await Conversation.GetConversations(req.session.account.id)

                if (conversations) {
                    res.send( { code: 'success', conversations: conversations } )
                } else {
                    res.send( { code: 'failure' } )
                }
            }
    
            if (requestType == 'accLogin') {
                const getForm = req.query.form
                const account = await Account.login(getForm.nickname, getForm.password, req.session.id)
    
                if (account) {
                    req.session.account = account
                    res.send( { code: 'success', account: account } )
                } else {
                    res.send( { code: 'failure' } )
                }
            }
    
            if (requestType == 'accReg') {
                const form = req.query.form
                const regResult = await Account.register(form.email, form.nickname, form.password)
    
                if (regResult.code == 'success') {
                    const loginResult = await Account.login(form.nickname, form.password, req.session.id)
    
                    req.session.account = loginResult
                    res.send( { code: 'success', account: loginResult } )
                } else if (regResult.code == 'failure') {
                    res.send( { code: 'failure', reason: regResult.reason } )
                }
            }
            
            if (requestType == 'accLogout') {
                if (req.query.token === req.session.account.logoutToken) {
                    req.session = null
        
                    res.send( { code: 'success' } )
                } else {
                    res.send( { code: 'failure', reason: 'Неверный токен' } )
                }
            }

            if (requestType == 'updateAvatar') {
                const avatar = await Account.updateAvatar(req.session.account.id, req.query.image)

                server.io.emit('avatarUpdate', { id: req.session.account.id, image: avatar })
                res.send({ code: 'success' })
            }

            if (requestType == 'addFriend') {
                const friends = await Account.addFriend(req.session.account.id, req.query.id)

                res.send({ code: 'success', friends: friends })
            }

            if (requestType == 'removeFriend') {
                const friends = await Account.removeFriend(req.session.account.id, req.query.id)

                res.send({ code: 'success', friends: friends })
            }

            if (requestType == 'getPosts') {
                const posts = await Post.GetPosts(req.session.account.id)

                res.send({ code: 'success', posts: posts })
            }
        })

        server.app.get('/version/windows', (req, res) => {
            const version = fs.readFileSync('./packages/windows/version.json')
            res.send(version)
        })
    
        server.app.get('/download/windows', (req, res) => {
            const file = './packages/windows/ChatSetup.msi'
            res.download(file)
        })
    
        server.app.get('/download/windows/updater', (req, res) => {
            const file = './packages/windows/build.zip'
            res.download(file)
        })

        server.app.get('/version/android', (req, res) => {
            const version = fs.readFileSync('./packages/android/version.json')
            res.send(version)
        })
    
        server.app.get('/download/android', (req, res) => {
            const file = './packages/android/multichat.apk'
            res.download(file)
        })

        server.app.get('/*', (req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'))
        })
    }
}
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const server = require('./server.js');

const Account = require('../models/account.js');
const Conversation = require('../models/conversation.js');
const Post = require('../models/post.js');
const Music = require('../models/music.js');

const { ObjectId } = require('mongodb');

const jsmediatags = require('jsmediatags');

// IMPORTANT: Due to the fact that free plans of Render Hosting do not include disk storage, 
// unfortunately you have to store files in databases as Base64

/* const musicStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads', 'music'))
    },
    filename: function (req, file, cb) {
        cb(null, `${new ObjectId()}`)
    }
})

const musicUpload = multer({ storage: musicStorage }) */

const musicUpload = multer()

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
                const result = await Account.login(getForm.nickname, getForm.password, req.session.id)
    
                if (result.code == 'success') {
                    req.session.account = result.account
                    res.send( { code: 'success', account: result.account } )
                } else {
                    res.send( { code: 'failure', reason: result.reason } )
                }
            }
    
            if (requestType == 'accReg') {
                const form = req.query.form
                const regResult = await Account.register(form.email, form.nickname, form.password)
    
                if (regResult.code == 'success') {
                    const loginResult = await Account.login(form.nickname, form.password, req.session.id)
    
                    req.session.account = loginResult.account
                    res.send( { code: 'success', account: loginResult.account } )
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

            if (requestType == 'getAllMusic') {
                const music = await Music.GetAllMusic()

                res.send({ code: 'success', music: music })
            }

            if (requestType == 'getMusic') {
                /* const file = fs.readFileSync(path.join(__dirname, '..', 'uploads', 'music', req.query.id))

                res.send(`data:audio/mp3;base64,${file.toString('base64')}`) */

                const cover = await Music.GetMusic(req.query.id)

                res.send(cover)
            }

            if (requestType == 'getMusicCover') {
                /* const file = fs.readFileSync(path.join(__dirname, '..', 'uploads', 'music', req.query.id))

                jsmediatags.read(file, {
                    onSuccess: function(tag) {
                        const { tags } = tag

                        if (tags.picture) {
                            const string64 = tags.picture.data.reduce((acc, byte) => acc + String.fromCharCode(byte), '')

                            res.send(`data:${tags.picture.format};base64,${btoa(string64)}`)
                        } else {
                            res.send(null)
                        }
                    },
                    onError: function(err) {
                        console.log(err)

                        res.send(null)
                    }
                }) */

                const cover = await Music.GetMusicCover(req.query.id)

                res.send(cover)
            }
        })

        server.app.post('*/api/requestMusic', musicUpload.single('music'), async (req, res) => {
            // IMPORTANT: Due to the fact that free plans of Render Hosting do not include disk storage, 
            // unfortunately you have to store files in databases as Base64

            // await Music.CreateRequest(req.session.account.id, req.body, req.file.filename)
            
            const music = `data:${req.file.mimetype};base64,${Buffer.from(req.file.buffer).toString('base64')}`

            const cover = await new Promise((resolve, reject) => {
                jsmediatags.read(req.file.buffer, {
                    onSuccess: function(tag) {
                        const { tags } = tag
    
                        if (tags.picture) {
                            const string64 = tags.picture.data.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
    
                            resolve(`data:${tags.picture.format};base64,${btoa(string64)}`)
                        } else {
                            reject(null)
                        }
                    },
                    onError: function(err) {
                        console.log(err)
                        reject(null)
                    }
                })
            })

            await Music.CreateRequest(req.session.account.id, req.body, music, cover)

            res.send({ code: 'success' })
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

        server.app.get('/version/android', async (req, res) => {
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
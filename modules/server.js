import fs from 'fs'
import https from 'https'
import express from 'express'
import viteExpress from 'vite-express'

const app = express()

const certOptions = { key: fs.readFileSync('key.pem'), cert: fs.readFileSync('cert.pem') }
const server = https.createServer(certOptions, app)

import { Server } from 'socket.io'
const io = new Server(server)

import session from 'express-session'
import cookieParser from 'cookie-parser'

import config from './config.js'

async function Setup() {
    app.set('view engine', 'html');
    app.use('/media', express.static('media'))

    app.use(cookieParser())
    app.use(session({
        secret: config.sessionSecret,
        saveUninitialized: true,
        resave: true,
        cookie: { httpOnly: false, sameSite: 'none', secure: true }
    }))
        
    /* app.get('/', (req, res) => {
        res.render('main', { title: config.title })
    }) */

    server.listen(config.port, config.hostname, () => {
        io.on('connection', (socket) => {
            console.log('Подключён пользователь')
            
            socket.on('disconnect', () => {
                console.log('Пользователь отключён')
            })
        })

        console.log(`Сервер запущен: https://${config.hostname}:${config.port}`)
    })
    viteExpress.bind(app, server)
}

export default { Setup, app, io}
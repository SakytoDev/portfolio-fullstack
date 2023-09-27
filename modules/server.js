import https from 'https'
import express from 'express'
import viteExpress from 'vite-express'

const app = express()
const server = https.createServer(app)

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

    server.listen(() => {
        console.log('Сервер запущен')
    })
    viteExpress.bind(app, server)
}

export default { Setup, app, io}
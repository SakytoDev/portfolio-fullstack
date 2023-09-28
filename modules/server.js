import http from 'http'
import express from 'express'
import viteExpress from 'vite-express'

const app = express()
const server = http.createServer(app)

import { Server } from 'socket.io'
const io = new Server(server)

import session from 'cookie-session'
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

    if (config.isDev) {
        server.listen(config.port, config.hostname, () => { console.log(`Сервер запущен http://${config.hostname}:${config.port}`) })
    } else {
        server.listen(10000, "0.0.0.0", () => { console.log('Сервер запущен') })
    }

    viteExpress.bind(app, server)
}

export default { Setup, app, io }
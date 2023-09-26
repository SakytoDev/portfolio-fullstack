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

import config from './config'

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

    server.listen(config.port, config.hostname, () => {
        console.log(`Сервер запущен: https://${config.hostname}:${config.port}`)
    })
    viteExpress.bind(app, server)
}

export default { Setup, app, io}
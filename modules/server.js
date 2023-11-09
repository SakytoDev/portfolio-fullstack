const path = require('path');
const http = require('http');
const express = require('express');

const app = express();
const cors = require('cors');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

const session = require('cookie-session');
const cookieParser = require('cookie-parser');

const config = require('./config.js');

module.exports = 
{
    Setup : async function() {
        app.set('view engine', 'html')

        app.use(cors({ origin: 'https://sakytodev.vercel.app' }))
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
            server.listen(10000, '0.0.0.0', () => { console.log('Сервер запущен') })
        }
    },
    app,
    io
}
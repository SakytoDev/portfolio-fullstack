const config = require('./config.js');

const http = require('http');

const express = require('express');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

const session = require('cookie-session');
const cookieParser = require('cookie-parser');

module.exports = 
{
    Setup : async function() {
        app.set('view engine', 'html')

        app.use(cors())
        app.use(cookieParser())
        app.use(session({
            secret: config.sessionSecret,
            saveUninitialized: true,
            resave: true,
            cookie: { sameSite: 'none', secure: true, httpOnly: false }
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
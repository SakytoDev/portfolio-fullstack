require('dotenv').config();

const database = require('./modules/database.js');
const server = require('./modules/server.js');
const ajax = require('./modules/ajax.js');
const sockets = require('./modules/sockets.js');

// Подключение к базе данных
database.Setup()

// Запуск сервера
server.Setup()

// Настройка AJAX
ajax.Setup()

 // Настройка веб-сокетов
sockets.Setup()
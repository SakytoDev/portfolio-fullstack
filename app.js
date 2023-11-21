require('dotenv').config();

const database = require('./modules/database.js');
const server = require('./modules/server.js');
const ajax = require('./modules/ajax.js');
const sockets = require('./modules/sockets.js');

async function StartServer() {
    await database.Setup() // Подключение к базе данных
    await server.Setup() // Запуск сервера
    ajax.Setup() // Настройка AJAX
    sockets.Setup() // Настройка веб-сокетов
}

StartServer()
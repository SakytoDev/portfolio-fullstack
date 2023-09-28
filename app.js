import database from './modules/database.js'
import server from './modules/server.js'
import ajax from './modules/ajax.js'
import sockets from './modules/sockets.js'

async function InitServer() {
    // Запуск базы данных
    await database.Setup()

    // Запуск сервера
    await server.Setup()

    // Запуск AJAX
    ajax.Setup()

    // Запуск запросов по сокету
    sockets.Setup()
}

await InitServer()
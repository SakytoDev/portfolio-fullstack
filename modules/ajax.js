import fs from 'fs'

import Account from '../models/account.js'
import server from './server.js'

function Setup() {
    server.app.get('/request', async (req, res) => 
    {
        const requestType = req.query.type
        
        if (requestType == 'getAcc') {
            if (req.session.account) {
                res.send( { "code": "success", "account": req.session.account } )
            }
            else {
                res.send( { "code": "failure", "reason": "Аккаунт не авторизован" } )
            }
        }

        if (requestType == 'getNickname') {
            if (req.session.account) {
                const nickname = await Account.getNicknameByID(req.session.account.id)

                res.send( { "code": "success", "nickname": nickname } )
            }
            else {
                res.send( { "code": "failure", "reason": "Аккаунт не авторизован" } )
            }
        }

        if (requestType == 'accLogin') {
            const getForm = req.query.form
            const account = await Account.login(getForm.nickname, getForm.password, req.session.id)

            if (account) {
                req.session.account = account
                res.send( { "code": "success" } )
            }
            else {
                res.send( { "code": "failure" } )
            }
        }

        if (requestType == 'accReg') {
            const form = req.query.form
            const regResult = await Account.register(form.email, form.nickname, form.password)

            if (regResult.code == "success") {
                const loginResult = await Account.login(form[1].value, form[2].value, req.session.id)

                req.session.account = loginResult
                res.send( { "code": "success" } )
            }
            else if (regResult.code == "failure") {
                res.send( { "code": "failure", "reason": regResult.reason } )
            }
        }
        
        if (requestType == 'accLogout') {
            if (req.query.token === req.session.account.logoutToken) {
                req.session.destroy()
    
                res.send( { "code": "success" } )
            }
            else {
                res.send( { "code": "failure", "reason": "Неверный токен" } )
            }
        }
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
}

export default { Setup }
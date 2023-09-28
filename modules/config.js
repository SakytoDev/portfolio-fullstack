import 'dotenv/config'

const sessionSecret = process.env.SESSION_SECRET
const passwordSalt = process.env.PASSWORD_SALT

const isDev = false
const hostname = "192.168.10.8"
const port = 3000

const title = "Portfolio"

export default {
    sessionSecret,
    passwordSalt,
    isDev,
    hostname,
    port,
    title
}
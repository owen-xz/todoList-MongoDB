const http = require('http')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const headers = require('./headers')
const handleErr = require('./handleErr')
const Todolist = require('./models/todolist')

dotenv.config({path: './config.env'})

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB)
.then(() => {
    console.log('資料庫連線成功');
})
.catch(err => {
    console.log(err);
})

const requestLister = async (req, res) => {
    let body = ''
    req.on('data', chunk => {
        body += chunk
    })
    if(req.url === '/todos' && req.method === 'GET') {
        const todos = await Todolist.find()
        res.writeHead(200, headers)
        res.write(JSON.stringify({
            status: 'success',
            todos
        }))
        res.end()
    } else if (req.url === '/todos' && req.method === 'POST') {
        req.on('end', async () => {
            try {
                const data = JSON.parse(body)
                await Todolist.create(
                    {
                        title: data.title
                    }
                )
                const todos = await Todolist.find()
                res.writeHead(200, headers)
                res.write(JSON.stringify({
                    status: 'success',
                    todos
                }))
                res.end()
            } catch (err) {
                handleErr(res)
            }
        })
    } else if(req.url === '/todos' && req.method === 'DELETE') {
        await Todolist.deleteMany({})
        res.writeHead(200, headers)
        res.write(JSON.stringify({
            status: 'success',
            todos: []
        }))
        res.end()
    } else if (req.url.startsWith('/todos') && req.method === 'DELETE') {
        req.on('end', async () => {
            try {
                const id = req.url.split('/').pop()
                await Todolist.findByIdAndDelete(id)
                const todos = await Todolist.find()
                res.writeHead(200, headers)
                res.write(JSON.stringify({
                    status: 'success',
                    todos
                }))
                res.end()
            } catch (err) {
                handleErr(res)
            }
        })
    } else if (req.url.startsWith('/todos') && req.method === 'PATCH') {
        req.on('end', async () => {
            try {
                const data = JSON.parse(body)
                const id = req.url.split('/').pop()
                await Todolist.findByIdAndUpdate(id, data)
                const todos = await Todolist.find()
                res.writeHead(200, headers)
                res.write(JSON.stringify({
                    status: 'success',
                    todos
                }))
                res.end()
            } catch (err) {
                handleErr(res)
            }
        })
    } else if (req.method === 'OPTIONS') {
        res.writeHead(200, headers)
        res.end()
    } else {
        res.writeHead(404, headers)
        res.write(JSON.stringify({
            status: 'false',
            message: '404 not found'
        }))
    }
}
const server = http.createServer(requestLister)
server.listen(process.env.PORT)
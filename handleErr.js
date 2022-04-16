const headers = require('./headers')
const handleErr = (res) => {
    res.writeHead(400, headers)
    res.write(JSON.stringify({
        status: 'false',
        message: '欄位錯誤或無此 Id'
    }))
    res.end()
}
module.exports = handleErr
var mysql = require('mysql')
module.exports = ()=>{
    return mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'123456',
        database:'BD_FIRSTAPP'
    })
}
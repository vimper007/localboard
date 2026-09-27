const http = require('http')
const server = http.createServer((req,res)=>{
    res.write('Hello World')
    res.end()
})

server.listen(3000,()=>console.log("Server listening on http://localhost:3000"))
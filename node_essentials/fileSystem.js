const fs = require('fs')
fs.writeFile('example1.txt','Hello World from Node',{flag:'a'},(err,data)=>{
    if (err) throw err
    console.log(data)
})


fs.readFile('example1.txt','utf8',(err,data)=>{
    if (err) throw err
    console.log(data)
})
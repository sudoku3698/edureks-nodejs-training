const fs = require('fs')
const path = require('path')
const readFile = (req, res,next) => {
    const filePath = path.join(__dirname, 'example.txt')
    console.log("Hello World")
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            res.status(500).send('Error reading file')
        }
        res.status(200).send({"message":data})
    })
}

const writeFile = (req, res,next) => {
    const filePath = path.join(__dirname, 'example.txt')
    const body = req.body
    console.log(body)
    fs.writeFile(filePath, '\n'+body.message,{flag: 'w'} ,(err) => {
        if (err) {
            console.error(err)
            res.status(500).send('Error writing file')
        }
        res.status(200).send({"message":"File written successfully"})
    })
}


const appendFile = (req, res,next) => {
    const filePath = path.join(__dirname, 'example.txt')
    const body = req.body
    console.log(body)
    fs.writeFile(filePath, '\n'+body.message,{flag: 'a'} ,(err) => {
        if (err) {
            console.error(err)
            res.status(500).send('Error writing file')
        }
        res.status(200).send({"message":"File written successfully"})
    })
}

const deleteFile = (req, res,next) => {
    const filePath = path.join(__dirname, 'example.txt')
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err)
            res.status(500).send('Error deleting file')
        }
        res.status(200).send({"message":"File deleted successfully"})
    })
}

module.exports = {
    readFile,
    writeFile,
    appendFile,
    deleteFile
}
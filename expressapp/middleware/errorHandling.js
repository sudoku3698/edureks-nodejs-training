module.exports.errorHandling = (err,req, res, next) => {
    if(err.code && err.status){
        res.status(err.status).json({
            message: err.message,
            code: err.code
        })
    }
    return res.status(500).json({
        message: err.message
    })
}

module.exports.auth = (req, res, next) => {
    console.log("Hello")
    if(req.headers.token!=='abc123'){
        return res.status(401).json({
            message: 'Unauthorized'})
    }
    next()
}
const session = require('express-session');
const loginForm = (req, res) => {
    const error = req.query.error;
    if (error) {
        res.render('auth/login', { title: "Login", error: error });
        return;
    }
    res.render('auth/login', { title: "Login",error: "" });
}

const login = (req, res) => {
    const user = req.body
    console.log(user)
    if(user.username=='sudesh' && user.password=='test123'){
        req.session.user = user;
        res.redirect('/cms')
    }else{
        res.redirect('/auth/login?error=Invalid username or password')
    }
}

const logout = (req, res) => {
    req.session.destroy(err => {
        if(err){
            res.status(500).json({ message: "logout failed" })
        }else{
            res.redirect('/auth/login')
        }
    })
}

module.exports = {
    loginForm,
    login,
    logout
}
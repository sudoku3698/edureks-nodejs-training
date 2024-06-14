const index = (req, res,next)=> {
    console.log(Object.keys(require('node:module')));
    
    res.render('pages/index',{title:"Home Page"});
}

const about = (req, res,next)=> {
    res.render('pages/about',{title:"AboutUs Page"});
}


module.exports = {
    index,
    about
}
const axios = require('axios')
const newsService = require('./newsService')
const index = async (req, res,next)=> {
    const response = await axios.get('http://localhost:6000/news')
    const news = response.data
    console.log(news)
    res.render('pages/index',{title:"News Head Lines", news,user:req.session.user});
}

const about = (req, res,next)=> {
    res.render('pages/about',{title:"About Us",user:req.session.user});
}


const addNewsForm = (req, res) => {
    res.render('pages/add', {title: "Add News",user:req.session.user});
}


const addNews = async (req, res) => {
    const news = req.body;
    news['id'] = Date.now();
    const currentDate = new Date();
    // const year = currentDate.getFullYear();
    // const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    // const day = String(currentDate.getDate()).padStart(2, '0');
    // news['date'] = `${year}-${month}-${day}`;
    try {
        const response = await axios.post('http://localhost:6000/news', news);
        res.redirect('/cms');
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
const editNews = async (req, res) => {
    const id = req.params.id
    try {
        const response = await axios.get(`http://localhost:6000/news/${id}`)
        const news = response.data
        res.render('pages/edit',{title:"Edit News", news,user:req.session.user})
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ message: 'News not found' })
        } else {
            throw error
        }
    }
}

const updateNews = async (req, res) => {
    const id = req.params.id
    const news = req.body
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    news['date'] = `${year}-${month}-${day}`;
    axios.put(`http://localhost:6000/news/${id}`, news)
        .then(response => {
            res.redirect('/cms')
        })
        .catch(error => {
            res.status(500).json({ message: 'Internal server error' })
        })
}

const deleteNews = async (req, res) => {
    const id = req.params.id
    axios.delete(`http://localhost:6000/news/${id}`)
        .then(() => {
            res.redirect('/cms')
        })
        .catch(error => {
            res.status(500).json({ message: 'Internal server error' })
        })
}
module.exports = {
    index,
    about,
    editNews,
    updateNews,
    deleteNews,
    addNewsForm,
    addNews
}
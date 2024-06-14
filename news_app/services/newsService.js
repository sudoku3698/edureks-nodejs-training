const axios = require('axios')


const getAllNews=async (req, res) => {
    const response = await axios.get('http://localhost:4000/news')
    const news = response.data
    res.json(news)
}

const getNewsById=async (req, res) => {
    const id = req.params.id
    try {
        const response = await axios.get(`http://localhost:4000/news/${id}`)
        const news = response.data
        res.json(news)
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ message: 'News not found' })
        } else {
            throw error
        }
    }
}

const addNews=async (req, res) => {
    let news=req.body
    news['id']=Date.now();
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    news['date'] = `${year}-${month}-${day}`;
    await axios.post('http://localhost:4000/news', req.body)
        .then(response => {
            res.status(201).json(response.data)
        })
        .catch(error => {
            res.status(500).json({ message: 'Internal server error' })
        })
}


const editNews = async (req, res) => {
    const id = req.params.id
    try {
        const response = await axios.get(`http://localhost:4000/news/${id}`)
        const news = response.data
        res.render('pages/edit',{title:"Edit News", news})
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ message: 'News not found' })
        } else {
            throw error
        }
    }
}

const updateNews=(req, res) => {
    const id = req.params.id
    const news = req.body
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    news['date'] = `${year}-${month}-${day}`;
    axios.put(`http://localhost:4000/news/${id}`, news)
        .then(response => {
            res.json(response.data)
        })
        .catch(error => {
            res.status(error.response.status).json({ message: 'News not found' })
        })
}

const deleteNews=(req, res) => {
    const id = req.params.id
    axios.delete(`http://localhost:4000/news/${id}`)
        .then(response => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(error.response.status).json({ message: 'News not found' })
        })
}

module.exports = {
    getAllNews,
    getNewsById,
    addNews,
    updateNews,
    deleteNews,
    editNews
}


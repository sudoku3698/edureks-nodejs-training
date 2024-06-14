const axios = require('axios')

const searchPeople=async (req,res,next)=>{
    if(!req.query.name) return next();
    const {name} = req.query
    const response = await axios.get(`http://localhost:4000/people/?search=${name}`)
    const peopleData = response.data
    console.log(peopleData)
    const people = peopleData.filter(person => person.name.includes(name))
    res.status(200).json(people)
    
}

const getAllPeople=async (req,res,next)=>{
    const response = await axios.get('http://localhost:4000/people')
    const peopleData = response.data
    throw new Error('Something went wrong');
    res.status(200).json(peopleData)
}

const getById=async (req,res,next)=>{
    const { id } = req.params
    const response = await axios.get(`http://localhost:4000/people/${id}`)
    const person = response.data
 
    if(!person){
        return next({
            status: 404,
            message: 'Person not found'})
    }
    res.status(200).json(person)
}

const createPerson=async (req,res,next)=>{
    const newPerson = {
        name: req.body.name,
        age: req.body.age
    };
    const response = await axios.post('http://localhost:4000/people', newPerson);
    const createdPerson = response.data;
    res.status(201).json(newPerson)
}


module.exports={
    getAllPeople,
    getById,
    searchPeople,
    createPerson
}
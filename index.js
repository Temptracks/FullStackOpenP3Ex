const express = require('express')
const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>Hello World - HomePage</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date(Date.now())
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).send('Error: Person not found!'
        )
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)

    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random()*100000000)
}

app.post('/api/persons', (request, response) => {
    const id = generateId()
    const body = request.body
    console.log('body.name', body.name)
    console.log('body.number', body.number)
    console.log('persons.find(person => person.name === body.name', persons.find(person => person.name === body.name))

    if(!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if(!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name already exists'
        })
    }

    const person = {
        id: id,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(persons)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
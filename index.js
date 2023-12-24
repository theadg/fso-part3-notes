const express = require('express')
const cors = require('cors')
const app = express()

/**
 * @Middleware
 * -> takes in JSON data of request
 * -> transforms JSON data to a JS Object
 * -> attaches it to request
 */
app.use(express.json())

/**
 * @Middleware
 * -> allows different origin to make requests to the server
 * -> origin = sources like different website
 */
app.use(cors())

app.use(express.static('dist'))

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {   
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },  
    {   
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello world from nodemon</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)

    if (!note) {
        return response.status(404).send(`Note with ${id} not found`)
    }

    return response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
    // no handling if note is missing
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(note => note.id))
        : 0

    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId()
    }

    notes = [...notes, note]

    response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
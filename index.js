const express = require('express')
const cors = require('cors')
require('dotenv').config()
const Note = require('./models/note')

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

/**
 * @Middleware
 * -> makes express show static content
 * -> "static content" = dist folder (contains minified files)
 */
app.use(express.static('dist'))

// let notes = [
//     {
//         id: 1,
//         content: "HTML is easy",
//         important: true
//     },
//     {   
//         id: 2,
//         content: "Browser can execute only JavaScript",
//         important: false
//     },  
//     {   
//         id: 3,
//         content: "GET and POST are the most important methods of HTTP protocol",
//         important: true
//     }
// ]

app.get('/', (request, response) => {
    response.send('<h1>Hello world from nodemon</h1>')
})

app.post('/api/notes', async (request, response) => {
    const { body } = request
    const { content, important } = body

    if (content === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const note = await Note.create({
        content,
        important: important || false,
    })

    console.log(note)
    return response.json(note);
});

app.get('/api/notes', async (request, response) => {
    const notes = await Note.find();

    // * Return as JSON
    return response.json(notes);
})

app.get('/api/notes/:id', async (request, response) => {
    const id = request.params.id
    const note = await Note.findById(id);

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
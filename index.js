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

app.get('/api/notes/:id', async (request, response, next) => {
    const id = request.params.id
    try {
        const note = await Note.findById(id);

        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    } catch (err) {
        // response.status(400).send({ error: 'malformatted id' })
        next(err)
    }
    
    // return response.json(note)
})

app.delete('/api/notes/:id', async (request, response, next) => {
    try {
        const note = await Note.findByIdAndDelete(request.params.id)
        response.status(204).json({ 'message': `successfully deleted ${note}`}).end()
    } catch (err) {
        next(err)
    }
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

app.put('/api/notes/:id', async (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    try {
        const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })

        response.json(updatedNote)
    } catch (err) {
        next(err)
    }
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } 

    next(error)
}

// handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
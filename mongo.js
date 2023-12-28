const mongoose = require('mongoose')

if (process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@part3-notes.vxsmlph.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

// * Improvement: Have own folder for Models that include Schema
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

// * Improvement: Have own folder for Models that include Schema
const Note = mongoose.model('Note', noteSchema)


// * Improvement: Have Controller
const note = new Note({
    content: 'HTML is Easy',
    important: true,
    newProp: 'this should not be added'
})

// note.save().then(result => {
//     console.log('note saved!')
//     console.log(result)
//     mongoose.connection.close()
// })

const index = async () => {
    const res = await Note.find({important: false});

    console.log(res);
    mongoose.connection.close()
}

index()
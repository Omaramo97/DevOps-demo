const express = require('express')
const app = express()
const path = require('path')

const cors = require('cors')
// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'd64ec7983854435a9f3d470fb95f8b45',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.use(express.json())
app.use(cors())

const students = ['Jimmy', 'Timothy', 'Jimothy', 'Omar']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
     rollbar.info('HTML file served successfully')
})

app.get('/api/students', (req, res) => {
    rollbar.info('Someone got the list of student on page load')
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body
   name = name.trim()

   const index = students.findIndex(student => {
       return student === name

    })
    
   try {
       if (index === -1 && name !== '') {
           students.push(name)
           rollbar.log('Student added successfully', {author: 'Omar', type: 'manual entry'})
           res.status(200).send(students)
       } else if (name === ''){
           rollbar.error('No name given')
           res.status(400).send('You must enter a name.')
       } else {
           rollbar.error('Student already exists')
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})
app.use(rollbar.errorHandler)

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`They're taking the Hobbits to port ${port}`))

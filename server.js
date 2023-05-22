const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const app = express()



// ROUTES
const articleRoute = require('./app/routes/Articles')
const authorRoute = require('./app/routes/Authors')
const commentRoute = require('./app/routes/Comments')

// ROUTES
const articleRoute = require('./app/routes/Articles')
const authorRoute = require('./app/routes/Authors')
const commentRoute = require('./app/routes/Comments')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

dotenv.config()

app.get('/', (req, res) => {
    res.send('This is the Home side!')
})

app.use('/articles', articleRoute)
app.use('/authors', authorRoute)
app.use('/comments', commentRoute)

mongoose.set('strictQuery', false)
mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xwkradj.mongodb.net/test`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(() => {
        console.log('Successfully connected to the database.')
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`)
        })
    })
    .catch((error) => {
        console.log('Could not connect to the database. Error...', error)
        process.exit()
    })

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('The server is running!');
});

let PORT = 3000;

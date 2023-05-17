const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Article = require('./app/models/articleModel');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

// ROUTES

app.get('/', (req, res) => {
    res.send('This is the Home side!');
});

app.get('/article', (req, res) => {
    res.send('Article side!');
});

app.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find({});
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/articles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findById(id);
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/articles', async (req, res) => {
    try {
        const article = await Article.create(req.body);
        res.status(200).json(article);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

// UPDATE

// DELETE

mongoose.set('strictQuery', false);
mongoose
    .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xwkradj.mongodb.net/test`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Successfully connected to the database.');
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('Could not connect to the database. Error...', error);
        process.exit();
    });

const PORT = 3000;

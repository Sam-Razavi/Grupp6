const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Article = require('./app/models/articleModel')
const Author = require('./app/models/authorModel')
const Comment = require('./app/models/commentModel')
const app = express()
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

dotenv.config()

// ROUTES

app.get('/', (req, res) => {
    res.send('This is the Home side!')
})

////////////////////////////////
////Article
///////////////////////////////

app.get('/article', (req, res) => {
    res.send('Article side!')
})

app.get('/articles', async (req, res) => {
    try {
        const value = myCache.get("allArticles");
        if (value == undefined) {
            // key not found in cache, fetch data from DB and save it in cache
            const articles = await Article.find({})
            myCache.set("allArticles", articles);
            res.status(200).json(articles);
        } else {
            // key found in cache, use that data
            res.status(200).json(value);
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.get('/articles/:id', async (req, res) => {
    try {
        const { id } = req.params
        const article = await Article.findById(id)
        res.status(200).json(article)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.post('/articles', async (req, res) => {
    try {
        const article = await Article.create(req.body)
        res.status(200).json(article)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})

// UPDATE
app.put('/articles/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findByIdAndUpdate(id, req.body, { new: true }); // new: true returns the updated document
        if (!article) {
            return res.status(404).json({ message: `Cannot find any article with ID ${id}` });
        }
        res.status(200).json(article);
        myCache.del("allArticles"); // invalidate cache for all articles
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// DELETE
app.delete('/articles/delete', async (req, res) => {
    try {
        const { id } = req.body;
        const article = await Article.findByIdAndDelete(id);
        if (!article) {
            return res.status(404).json({ message: `Cannot find any article with ID ${id}` });
        }
        res.status(200).json(article);
        myCache.del("allArticles"); // invalidate cache for all articles
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

////////////////////////////////
////Author
///////////////////////////////

app.get('/author', (req, res) => {
    res.send('Author side!')
})

app.get('/authors', async (req, res) => {
    try {
        const value = myCache.get("allAuthors");
        if (value == undefined) {
            const authors = await Author.find({})
            myCache.set("allAuthors", authors);
            res.status(200).json(authors);
        } else {
            res.status(200).json(value);
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.get('/authors/:id', async (req, res) => {
    try {
        const { id } = req.params
        const author = await Author.findById(id)
        res.status(200).json(author)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.post('/authors', async (req, res) => {
    try {
        const author = await Author.create(req.body)
        res.status(200).json(author)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})

// UPDATE
app.put('/authors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const author = await Author.findByIdAndUpdate(id, req.body, { new: true });
        if (!author) {
            return res.status(404).json({ message: `Cannot find any author with ID ${id}` });
        }
        res.status(200).json(author);
        myCache.del("allAuthors"); // invalidate cache for all authors
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// DELETE
app.delete('/authors/:id', async (req, res) => {
    try {
        const { id } = req.params
        const author = await Author.findByIdAndDelete(id)
        if (!author) {
            return res
                .status(404)
                .json({ message: `cannot find any author with ID ${id}` })
        }
        myCache.del("allAuthors"); // invalidate cache for all authors
        res.status(200).json(author)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

////////////////////////////////
////Comments
///////////////////////////////

app.get('/comment', (req, res) => {
    res.send('Comment side!')
})

app.get('/comments', async (req, res) => {
    try {
        const value = myCache.get("allComments");
        if (value == undefined) {
            const comments = await Comment.find({})
            myCache.set("allComments", comments);
            res.status(200).json(comments);
        } else {
            res.status(200).json(value);
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.get('/comments/:id', async (req, res) => {
    try {
        const { id } = req.params
        const comment = await Comment.findById(id)
        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.post('/comments', async (req, res) => {
    try {
        const comment = await Comment.create(req.body)
        res.status(200).json(comment)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})

// UPDATE
app.put('/comments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndUpdate(id, req.body, { new: true });
        if (!comment) {
            return res.status(404).json({ message: `Cannot find any comment with ID ${id}` });
        }
        res.status(200).json(comment);
        myCache.del("allComments"); // invalidate cache for all comments
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// DELETE
app.delete('/comments/:id', async (req, res) => {
    try {
        const { id } = req.params
        const comment = await Comment.findByIdAndDelete(id)
        if (!comment) {
            return res
                .status(404)
                .json({ message: `cannot find any comment with ID ${id}` })
        }
        myCache.del("allComments"); // invalidate cache for all comments
        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

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

const express = require('express')
const router = express.Router()

const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const Article = require('../models/articleModel')

router.get('/', async (req, res) => {
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

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const article = await Article.findById(id)
        res.status(200).json(article)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const article = await Article.create(req.body)
        res.status(200).json(article)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})

// UPDATE

router.put('/:id', async (req, res) => {
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
// DELETE
router.delete('/delete', async (req, res) => {
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



module.exports = router

const express = require('express')
const router = express.Router()

const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });//Every entry in cache lives up to 100 seconds and the cache checks itself every 120 seconds

const Article = require('../models/articleModel')

router.get('/', async (req, res) => {
    try {
        const value = myCache.get("allArticles");
        if (value == undefined) {
            const articles = await Article.find({})
            myCache.set("allArticles", articles); // adding articles to our cache
            console.log("Fetched from database"); // Showing that the data is generated and retrieved from the database
            res.status(200).json(articles);
        } else {
            console.log("Served from cache"); // Shows that the data is coming from the cache that we created
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
        myCache.del("allArticles"); // Deleting the cache so that we dont have 2 sperate sets of data (old an new)
        console.log('Deleted the cache'); // Confirming that the data in cache has been deleted
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
        console.log('Updated the cache due to update'); // shows that we have updated the cache as well as the database
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

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
        console.log('Deleted the cache'); // Deleting the cache so we dont have two seperate set of data
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})



module.exports = router

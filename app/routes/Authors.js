const express = require('express')
const router = express.Router()

const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const Author = require('../models/authorModel')

router.get('/', async (req, res) => {
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

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const author = await Author.findById(id)
        res.status(200).json(author)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const author = await Author.create(req.body)
        res.status(200).json(author)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})

// UPDATE
router.put('/:id', async (req, res) => {
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
router.delete('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        const author = await Author.findByIdAndDelete(id);
        if (!author) {
            return res.status(404).json({ message: `Cannot find any author with ID ${id}` });
        }
        res.status(200).json(author);
        myCache.del("allAuthors"); // invalidate cache for all authors
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


module.exports = router

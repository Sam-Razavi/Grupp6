const express = require('express')
const router = express.Router()

const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });//Every entry in cache lives up to 100 seconds and the cache checks itself every 120 seconds

const Comment = require('../models/commentModel')

router.get('/', async (req, res) => {
    try {
        const value = myCache.get("allComments");
        if (value == undefined) {
            const comments = await Comment.find({})
            myCache.set("allComments", comments); // adding articles to our cache
            console.log("Fetched comments from database"); // Showing that the data is generated and retrieved from the database
            res.status(200).json(comments);
        } else {
            console.log("Served comments from cache"); // Shows that the data is coming from the cache that we created
            res.status(200).json(value);
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const comment = await Comment.findById(id)
        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const comment = await Comment.create(req.body)
        myCache.del("allComments");// Deleting the cache so that we dont have 2 sperate sets of data (old an new)
        console.log('Deleted the cache');// Confirming that the data in cache has been deleted
        res.status(200).json(comment)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndUpdate(id, req.body, { new: true });
        if (!comment) {
            return res.status(404).json({ message: `Cannot find any comment with ID ${id}` });
        }
        res.status(200).json(comment);
        myCache.del("allComments"); // invalidate cache for all comments
        console.log('Updated the cache due to update'); // shows that we have updated the cache as well as the database
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// DELETE
router.delete('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            return res.status(404).json({ message: `Cannot find any comment with ID ${id}` });
        }
        res.status(200).json(comment);
        myCache.del("allComments"); // invalidate cache for all comments
        console.log('Deleted the cache'); // Deleting the cache so we dont have two seperate set of data
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


module.exports = router

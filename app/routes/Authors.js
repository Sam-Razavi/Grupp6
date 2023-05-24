const express = require('express');
const router = express.Router();

const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const Author = require('../models/authorModel');

/////////////// CREATE ///////////////
router.post('/', async (req, res) => {
    try {
        const author = await Author.create(req.body);
        res.status(200).send(`POSTED the new author!`);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

/////////////// READ ALL ///////////////
router.get('/', async (req, res) => {
    try {
        const value = myCache.get('allAuthors');
        if (value == undefined) {
            const authors = await Author.find({});
            myCache.set('allAuthors', authors);
            res.status(200).json(authors);
        } else {
            res.status(200).json(value);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/////////////// READ ONE SPECIFIC ///////////////
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const author = await Author.findById(id);
        res.status(200).json(author);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/////////////// UPDATE ///////////////
router.put('/update', async (req, res) => {
    try {
        const { _id } = req.body;
        const author = await Author.findByIdAndUpdate(_id, req.body, { new: true });
        if (!author) {
            return res.status(404).send(`Oops... 404. Cannot find any author with ID ${_id}`);
        }
        res.status(200).send(`UPDATED the author with ID ${_id}`);
        myCache.del('allAuthors'); // invalidate cache for all authors
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/////////////// DELETE ///////////////
router.delete('/delete', async (req, res) => {
    try {
        const { _id } = req.body;
        const author = await Author.findByIdAndDelete(_id);
        if (!author) {
            return res.status(404).send(`Oops... 404. Cannot find any author with ID ${_id}`);
        }
        res.status(200).send(`DELETED author with ID ${_id}`);
        myCache.del('allAuthors'); // invalidate cache for all authors
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

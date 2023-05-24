const express = require('express');
const router = express.Router();

const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const Comment = require('../models/commentModel');

/////////////// CREATE ///////////////
router.post('/', async (req, res) => {
    try {
        const comment = await Comment.create(req.body);
        res.status(200).send(`POSTED the new comment!`);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

/////////////// READ ALL ///////////////
router.get('/', async (req, res) => {
    try {
        const value = myCache.get('allComments');
        if (value == undefined) {
            const comments = await Comment.find({});
            myCache.set('allComments', comments);
            res.status(200).json(comments);
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
        const comment = await Comment.findById(id);
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/////////////// UPDATE ///////////////
router.put('/update', async (req, res) => {
    try {
        const { _id } = req.params;
        const comment = await Comment.findByIdAndUpdate(_id, req.body, { new: true });
        if (!comment) {
            return res.status(404).send(`Oops... 404. Cannot find any comment with ID ${_id}`);
        }
        res.status(200).send(`UPDATED the comment with ID ${_id}`);
        myCache.del('allComments'); // invalidate cache for all comments
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/////////////// DELETE ///////////////
router.delete('/delete', async (req, res) => {
    try {
        const { _id } = req.body;
        const comment = await Comment.findByIdAndDelete(_id);
        if (!comment) {
            return res.status(404).send(`Oops... 404. Cannot find any comment with ID ${_id}`);
        }
        res.status(200).send(`DELETED comment with ID ${_id}`);
        myCache.del('allComments'); // invalidate cache for all comments
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

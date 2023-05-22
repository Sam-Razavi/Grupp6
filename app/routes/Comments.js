const express = require('express')
const router = express.Router()

const Comment = require('../models/commentModel')

router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find({})
        res.status(200).json(comments)
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
        res.status(200).json(comment)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const comment = await Comment.findByIdAndUpdate(id, req.body)
        if (!comment) {
            return res
                .status(404)
                .json({ message: `cannot find any comment with ID ${id}` })
        }
        const updatedComment = await Comment.findById(id)
        res.status(200).json(updatedComment)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const comment = await Comment.findByIdAndDelete(id)
        if (!comment) {
            return res
                .status(404)
                .json({ message: `cannot find any comment with ID ${id}` })
        }
        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router

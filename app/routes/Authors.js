const express = require('express')
const router = express.Router()

const Author = require('../models/authorModel')

router.get('/', async (req, res) => {
    try {
        const authors = await Author.find({})
        res.status(200).json(authors)
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
        const { id } = req.params
        const author = await Author.findByIdAndUpdate(id, req.body)
        if (!author) {
            return res
                .status(404)
                .json({ message: `cannot find any author with ID ${id}` })
        }
        const updatedAuthor = await Author.findById(id)
        res.status(200).json(updatedAuthor)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const author = await Author.findByIdAndDelete(id)
        if (!author) {
            return res
                .status(404)
                .json({ message: `cannot find any author with ID ${id}` })
        }
        res.status(200).json(author)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router

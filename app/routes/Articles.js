const express = require('express')
const router = express.Router()

const Article = require('../models/articleModel')

router.get('/', async (req, res) => {
    try {
        const article = await Article.find({})
        res.status(200).json(article)
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
        const { id } = req.params
        const article = await Article.findByIdAndUpdate(id, req.body)
        if (!article) {
            return res
                .status(404)
                .json({ message: `cannot find any article with ID ${id}` })
        }
        const updatedArticle = await Article.findById(id)
        res.status(200).json(updatedArticle)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const article = await Article.findByIdAndDelete(id)
        if (!article) {
            return res
                .status(404)
                .json({ message: `cannot find any article with ID ${id}` })
        }
        res.status(200).json(article)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router

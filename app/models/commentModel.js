const mongoose = require('mongoose')

const commentSchema = mongoose.Schema(
    {
        article_id: {
            type: Number,
            required: [true, 'Enter a article id']
        },
        author: {
            type: String,
            required: [true, 'Enter a email']
        },
        content: {
            type: String,
            required: [true, 'Enter content']
        }
    },
    {
        timestamps: true
    }
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment

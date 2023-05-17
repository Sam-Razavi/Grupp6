const mongoose = require('mongoose');

const articleSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Enter a title name']
        },
        content: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;

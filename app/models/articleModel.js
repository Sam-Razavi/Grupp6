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
//  const authorsSchema = mongoose.Schema({})

//  const commentsSchema = mongoose.Schema({})

const Article = mongoose.model('Article', articleSchema);
/* const Author = mongoose.model('Author', authorSchema);
const Comment = mongoose.model('Comment', commentSchema); */

module.exports = Article;
/* module.exports = Author;
module.exports = Comment; */

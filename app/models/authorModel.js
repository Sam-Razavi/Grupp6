const mongoose = require('mongoose')

const authorSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Enter a name']
        },
        email: {
            type: String,
            required: [true, 'Enter a email']
        }
    },
    {
        timestamps: true
    }
)

const Author = mongoose.model('Author', authorSchema)

module.exports = Author

const mongoose = require('mongoose')

const posts = new mongoose.Schema(
    {
        title: {
            type: String,
            require: [true, 'title 必填']
        },
        createdAt: {
            type: Date,
            default: Date.now,
            select: false
        }
    },
    {
        versionKey: false
    }
)
const Posts = mongoose.model('Posts', posts)

module.exports = Posts
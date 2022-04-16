const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema(
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
const Todolist = mongoose.model('Todolist', todoSchema)

module.exports = Todolist
import {Schema, model } from 'mongoose';

const tasks = new Schema({
    userId: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    description: {
        type: String
    },
    expirationDate: {
        type: Date
    },
    expired: {
        type: Boolean,
        default: false
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true, versionKey: false
})

export const Tasks = model('tasks', tasks);
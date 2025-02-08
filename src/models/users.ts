import {Schema, model} from 'mongoose'

const user = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
}, {timestamps: true, versionKey: false});

export const User = model('user', user);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tasks = void 0;
const mongoose_1 = require("mongoose");
const tasks = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'User'
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
});
exports.Tasks = (0, mongoose_1.model)('tasks', tasks);

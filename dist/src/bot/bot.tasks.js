"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDay = exports.deleteTask = exports.checkCompleted = exports.getAllTask = exports.addTask = void 0;
const axios_1 = __importDefault(require("axios"));
const bot_utilities_1 = require("./bot.utilities");
const addTask = async (ctx, token, obj) => {
    const task = {
        description: obj.description,
        expirationDate: obj.expirationDate
    };
    const { data } = await axios_1.default.post(`${process.env.BACK_URL}/api/tasks/add-task`, task, {
        headers: { Authorization: token }
    });
    return ctx.reply(`Tarea ${data.description} grabada correctamente par el día ${data.expirationDate}`);
};
exports.addTask = addTask;
const getAllTask = async (ctx, token, date) => {
    const { data } = await axios_1.default.get(`${process.env.BACK_URL}/api/tasks/get`, {
        params: { date },
        headers: { Authorization: token }
    });
    if (data.length === 0)
        return ctx.reply(data);
    const responseMessage = data.map((task, index) => `${index + 1}. ${task.description} ${task.completed ? "✅ " : "❌ "}`)
        .join("\n");
    return ctx.reply(responseMessage);
};
exports.getAllTask = getAllTask;
const checkCompleted = async (ctx, token, obj) => {
    const { data } = await axios_1.default.put(`${process.env.BACK_URL}/api/tasks/${obj.description}/completed`, {}, {
        headers: { Authorization: token }
    });
    return ctx.reply(data);
};
exports.checkCompleted = checkCompleted;
const deleteTask = async (ctx, token, obj) => {
    const { data } = await axios_1.default.delete(`${process.env.BACK_URL}/api/tasks/${obj.description}/delete`, {
        headers: { Authorization: token }
    });
    return ctx.reply(data);
};
exports.deleteTask = deleteTask;
const getDay = async (ctx, token, obj) => {
    const { data } = await axios_1.default.get(`${process.env.BACK_URL}/api/tasks/${obj.description}`, {
        headers: { Authorization: token }
    });
    (0, bot_utilities_1.audioResponse)(ctx, data);
};
exports.getDay = getDay;

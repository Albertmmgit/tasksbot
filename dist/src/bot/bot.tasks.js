"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDay = exports.deleteTask = exports.checkCompleted = exports.getAllTaskDate = exports.addTask = void 0;
const axios_1 = __importDefault(require("axios"));
const bot_utilities_1 = require("./bot.utilities");
const date_fns_1 = require("date-fns");
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
const getAllTaskDate = async (ctx, token, obj) => {
    const { expirationDate, pending } = obj;
    const params = { expirationDate };
    if (pending)
        params.completed = true;
    console.log(params);
    const { data } = await axios_1.default.get(`${process.env.BACK_URL}/api/tasks/get`, {
        params,
        headers: { Authorization: token }
    });
    console.log(data);
    if (!Array.isArray(data))
        return ctx.reply(data);
    const responseMessage1 = `Las tareas ${pending ? 'pendientes' : ""} ${expirationDate ? `para el día ${expirationDate}` : ""}son:`;
    const newData = data.map(task => ({
        ...task,
        formattedDate: (0, date_fns_1.format)(new Date(task.expirationDate), "dd-MM-yyyy")
    }));
    const responseMessage = newData
        .map((task, index) => `${index + 1}. ${task.description}` +
        (expirationDate ? "" : ` - ${task.expirationDate}`) +
        (pending ? "" : ` ${task.completed ? "✅" : "❌"}`))
        .join("\n");
    return await ctx.reply(responseMessage1), await ctx.reply(responseMessage);
};
exports.getAllTaskDate = getAllTaskDate;
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
    if (data.length === 0)
        return ctx.reply('No se ha encontrado la tarea');
    console.log(data);
    (0, bot_utilities_1.audioResponse)(ctx, data);
};
exports.getDay = getDay;

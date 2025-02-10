"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectedUsers = exports.bot = void 0;
const telegraf_1 = require("telegraf");
require("./src/config/configDb");
const bot_menus_1 = require("./src/bot/bot.menus");
const gpt_1 = require("./gpt");
const axios_1 = __importDefault(require("axios"));
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
const openai_1 = __importDefault(require("openai"));
const stream_1 = require("stream");
const bot_utilities_1 = require("./src/bot/bot.utilities");
const openAi = new openai_1.default({
    apiKey: process.env.OPEN_AI_API_KEY
});
const streamPipeline = (0, util_1.promisify)(stream_1.pipeline);
exports.bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
exports.connectedUsers = new Set();
exports.bot.telegram.setMyCommands([
    { command: '/iniciar', description: 'Iniciar App' },
    { command: '/logout', description: 'Desconectarse' },
    { command: '/ejemplos', description: 'Ver ejemplos' }
]);
exports.bot.start((ctx) => {
    const welcomeMessage = `
    ¡Hola! 👋
    Bienvenida@. Utiliza el comando /iniciar para iniciar la aplicación
    `;
    ctx.sendMessage(welcomeMessage);
});
exports.bot.command('iniciar', (ctx) => {
    const user = {
        id: ctx.chat.id,
        token: undefined,
        action: "",
        logged: false
    };
    if (![...exports.connectedUsers].some(u => u.id === user.id)) {
        exports.connectedUsers.add(user);
        (0, bot_utilities_1.changeStatus)(ctx, 'init');
        (0, bot_menus_1.startMenu)(ctx);
    }
    else {
        ctx.reply('¡Ya estás conectado!');
    }
});
exports.bot.command('ejemplos', (ctx) => {
    const respone = `
    'Añade comprar pan mañana'
    'Ver tareas del domingo'
    'Ver tareas pendientes'
    'Reunion completada'
    'Que día tengo que entregar el exámen'
    `;
    ctx.sendMessage(respone);
});
exports.bot.command('logout', (ctx) => {
    const id = ctx.chat.id;
    for (const user of exports.connectedUsers) {
        if (user.id === id) {
            exports.connectedUsers.delete(user);
            ctx.reply('Te has desconetado');
            break;
        }
    }
});
exports.bot.on('callback_query', (ctx) => {
    (0, bot_menus_1.callBackQuery)(ctx);
});
exports.bot.on('message', async (ctx) => {
    const id = ctx.chat.id;
    const user = Array.from(exports.connectedUsers).find(user => user.id === id);
    const date = new Date(ctx.message.date * 1000).toString();
    if (!user)
        return ctx.reply('Debes iniciar la app con el comando /iniciar');
    if (user.logged === true && 'text' in ctx.message) {
        const text = ctx.message.text;
        const response = await (0, gpt_1.createResponse)(text, date);
        if (!(0, bot_utilities_1.isValidJson)(response))
            return ctx.reply('Error al recibir la respuesta');
        const obj = JSON.parse(response);
        (0, bot_menus_1.actionsMenu)(ctx, obj, user);
        return;
    }
    if (user.logged === true && 'voice' in ctx.message) {
        const fileId = ctx.message.voice.file_id;
        const fileLink = await ctx.telegram.getFileLink(fileId);
        const url = fileLink.toString();
        const audioResponse = await axios_1.default.get(url, { responseType: 'stream' });
        const file = 'audio.ogg';
        await streamPipeline(audioResponse.data, fs_1.default.createWriteStream(file));
        const transcription = await openAi.audio.transcriptions.create({
            file: fs_1.default.createReadStream(file),
            model: 'whisper-1'
        });
        fs_1.default.unlinkSync(file);
        const response = await (0, gpt_1.createResponse)(transcription.text, date);
        if (!(0, bot_utilities_1.isValidJson)(response))
            return ctx.reply('Error al recibir la respuesta');
        const obj = JSON.parse(response);
        (0, bot_menus_1.actionsMenu)(ctx, obj, user);
        return;
    }
    (0, bot_menus_1.logMenu)(ctx, user);
});

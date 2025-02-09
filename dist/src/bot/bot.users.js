"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const axios_1 = __importDefault(require("axios"));
const bot_utilities_1 = require("./bot.utilities");
const register = async (ctx) => {
    const message = ctx.text.trim();
    const [username, password] = message.split(',').map((data) => data.trim());
    const userData = {
        username,
        password
    };
    const { data } = await axios_1.default.post(`${process.env.BACK_URL}/api/users/register`, userData);
    if (!data.username) {
        return ctx.reply(data);
    }
    (0, bot_utilities_1.changeStatus)(ctx, 'login');
    ctx.reply(`Usuario ${data.username} creado correctamente. Introduce tu usuario y contraseña para entrar.`);
};
exports.register = register;
const login = async (ctx) => {
    const message = ctx.text.trim();
    const [username, password] = message.split(',').map((data) => data.trim());
    const userData = {
        username,
        password
    };
    try {
        const { data } = await axios_1.default.post(`${process.env.BACK_URL}/api/users/login`, userData);
        (0, bot_utilities_1.changeStatus)(ctx, 'logged');
        await ctx.reply(`Login Correcto con el usuario ${data.username}`);
        await ctx.reply('Ahora puedes crear, ver o eliminar tareas, asignarlas a un calendario o marcalas como completadas utilizando un lengaje natural ya sea con texto o voz. Utiliza el comando /ejemplos para ver que puedes hacer');
        (0, bot_utilities_1.addToken)(ctx, data.token);
        return;
    }
    catch (error) {
        console.log(error);
        ctx.reply('Error en email y/o contraseña');
    }
};
exports.login = login;

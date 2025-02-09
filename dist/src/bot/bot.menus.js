"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMenu = exports.actionsMenu = exports.callBackQuery = exports.startMenu = void 0;
const bot_utilities_1 = require("./bot.utilities");
const bot_tasks_1 = require("./bot.tasks");
const bot_users_1 = require("./bot.users");
const startMenu = (ctx) => {
    return ctx.reply('📌 Usa el menú del bot tocando el botón de abajo 👇', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Registro', callback_data: 'registro' }],
                [{ text: 'Login', callback_data: 'login' }]
            ]
        }
    });
};
exports.startMenu = startMenu;
const callBackQuery = (ctx) => {
    const callbackData = ctx.callbackQuery;
    if ('data' in callbackData) {
        switch (callbackData.data) {
            case 'registro':
                {
                    return ctx.reply('Introduce tu nombre de usuario y password separados por coma').then(() => {
                        (0, bot_utilities_1.changeStatus)(ctx, 'register');
                    });
                }
            case 'login':
                {
                    return ctx.reply('Introduce tu nombre de usuario y password separados por coma').then(() => {
                        (0, bot_utilities_1.changeStatus)(ctx, 'login');
                    });
                }
        }
    }
};
exports.callBackQuery = callBackQuery;
const actionsMenu = (ctx, obj, user) => {
    switch (obj.action) {
        case 'addTask':
            {
                (0, bot_tasks_1.addTask)(ctx, user.token, obj);
                break;
            }
        case 'getTask':
            {
                (0, bot_tasks_1.getAllTaskDate)(ctx, user.token, obj);
                break;
            }
        case 'checkCompleted':
            {
                (0, bot_tasks_1.checkCompleted)(ctx, user.token, obj);
                break;
            }
        case 'deleteTask':
            {
                (0, bot_tasks_1.deleteTask)(ctx, user.token, obj);
                break;
            }
        // case 'getAllTasks' :
        //     {
        //         getAllTasks(ctx, user.token, obj)
        //         break
        //     }
        case 'getDay':
            {
                (0, bot_tasks_1.getDay)(ctx, user.token, obj);
                break;
            }
        default:
            ctx.reply('No he entendido tu petición');
    }
};
exports.actionsMenu = actionsMenu;
const logMenu = (ctx, user) => {
    switch (user.action) {
        case 'register':
            {
                (0, bot_users_1.register)(ctx);
                break;
            }
        case 'login':
            {
                (0, bot_users_1.login)(ctx);
                break;
            }
        case 'init':
            {
                return ctx.reply('Debes seleccionar una de las dos opciones del menú');
            }
    }
};
exports.logMenu = logMenu;

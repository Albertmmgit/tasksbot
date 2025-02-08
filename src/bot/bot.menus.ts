import { Context } from "telegraf"
import { CallbackQuery } from "telegraf/typings/core/types/typegram";
import { changeStatus } from "./bot.utilities";
import { addTask, checkCompleted, deleteTask, getAllTaskDate, getDay } from "./bot.tasks";
import { login, register } from "./bot.users";

export const startMenu = (ctx: Context) => {
    return ctx.reply('📌 Usa el menú del bot tocando el botón de abajo 👇', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Registro', callback_data: 'registro' }],
                [{ text: 'Login', callback_data: 'login' }]
            ]
        }
    })
}

export const callBackQuery = (ctx) => {
    const callbackData: CallbackQuery = ctx.callbackQuery; // Esto obtiene el valor del callback_data
    if ('data' in callbackData) {
        switch (callbackData.data) {
            case 'registro':
                {
                    return ctx.reply('Introduce tu nombre de usuario y password separados por coma').then(() => {
                        changeStatus(ctx, 'register')
                    })
                }
            case 'login':
                {
                    return ctx.reply('Introduce tu nombre de usuario y password separados por coma').then(() => {
                        changeStatus(ctx, 'login')
                    })
                }
        }
    }
}

export const actionsMenu = (ctx: Context, obj, user) => {
    switch (obj.action) {
        case 'addTask':
            {
                addTask(ctx, user.token, obj)
                break;
            }
        case 'getTask':
            {
                getAllTaskDate(ctx, user.token, obj.expirationDate)
                break;
            }
        case 'checkCompleted':
            {
                checkCompleted(ctx, user.token, obj)
                break
            }
        case 'deleteTask':
            {
                deleteTask(ctx, user.token, obj)
                break
            }
        case 'pending' :
            {
                break
            }
        case 'getDay':
            {
                getDay(ctx, user.token, obj)
                break
            }
        default:
            ctx.reply('No he entendido tu petición')
    }
}

export const logMenu = (ctx: Context, user) => {
    switch (user.action) {
        case 'register':
            {
                register(ctx)
                break;
            }
        case 'login':
            {
                login(ctx)
                break;
            }
        case 'init':
            {
                return ctx.reply('Debes seleccionar una de las dos opciones del menú')
            }

    }
}
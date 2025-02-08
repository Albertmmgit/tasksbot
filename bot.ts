import { Context, Telegraf } from 'telegraf';
import './src/config/configDb'
import { actionsMenu, callBackQuery, logMenu, startMenu } from './src/bot/bot.menus';
import { User } from './src/interfaces/iuser';
import { createResponse } from './gpt';
import { openAiResponse } from './src/interfaces/iopenairesponse';
import axios from 'axios'
import { promisify } from 'util';
import fs from 'fs'
import OpenAI from "openai";
import { pipeline } from 'stream';
import { changeStatus } from './src/bot/bot.utilities';


const openAi = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
})
const streamPipeline = promisify(pipeline);

export const bot = new Telegraf(process.env.BOT_TOKEN!);

export const connectedUsers: Set<User> = new Set()

bot.telegram.setMyCommands([
    {command: '/iniciar', description: 'Iniciar App'},
    {command: '/logout', description: 'Desconectarse'},
    {command: '/ejemplos', description: 'Ver ejemplos'}
])

bot.start( (ctx) => {
 
    const welcomeMessage = `
    ¡Hola! 👋
    Bienvenida@. Utiliza el comando /iniciar para iniciar la aplicación
    `;

    ctx.sendMessage(welcomeMessage)
});
bot.command('iniciar', (ctx) => {
    const user: User = {
        id: ctx.chat.id,
        token: undefined,
        action: "",
        logged: false
    }
    if (![...connectedUsers].some(u => u.id === user.id)) {
        connectedUsers.add(user);
        changeStatus(ctx, 'init')
        startMenu(ctx)
    } else {
        ctx.reply('¡Ya estás conectado!');
    }
})

bot.command('ejemplos', (ctx) => {
    const respone = `
    'Añade comprar pan mañana'
    'Ver tareas del domingo'
    'Que día tengo que que entregar el exámen'
    `;

    ctx.sendMessage(respone)
})

bot.on('callback_query', (ctx) => {
    callBackQuery(ctx)
});

bot.on('message', async (ctx: Context) => {
    const id = ctx.chat!.id;
    const user = Array.from(connectedUsers).find(user => user.id === id);
    const date = new Date(ctx.message!.date * 1000).toString()

    if (!user) return ctx.reply('Debes iniciar la app con el comadno /start')

    if (user.logged === true && 'text' in ctx.message!) {
        const text = ctx.message.text
        const response = await createResponse(text, date)
        const obj: openAiResponse = JSON.parse(response!);
        console.log('response', response)
        console.log('obj', obj)
        actionsMenu(ctx, obj, user)
        return
    }

    if (user.logged === true && 'voice' in ctx.message!) {
        const fileId = ctx.message.voice.file_id; 
        const fileLink = await ctx.telegram.getFileLink(fileId);
        const url = fileLink.toString()
        const audioResponse = await axios.get(url, { responseType: 'stream' });
        const file = 'audio.ogg';
        await streamPipeline(audioResponse.data, fs.createWriteStream(file))
        const transcription = await openAi.audio.transcriptions.create({
            file: fs.createReadStream(file),
            model: 'whisper-1'
        })
        fs.unlinkSync(file)
        const response = await createResponse(transcription.text, date)
        const obj: openAiResponse = JSON.parse(response!);
        console.log('response', response)
        console.log('obj', obj)
        actionsMenu(ctx, obj, user)
        return
    }
    logMenu(ctx, user)

})

bot.command('logout', (ctx) => {
    const id = ctx.chat.id
    for (const user of connectedUsers) {
        if (user.id === id) {
            connectedUsers.delete(user);
            ctx.reply('Te has desconetado')
            break;
        }
    }
})

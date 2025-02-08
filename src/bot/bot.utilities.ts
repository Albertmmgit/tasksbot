import { Context } from "telegraf";
import { connectedUsers } from "../../bot";
import googleTTS from "google-tts-api"; 
import { dateText } from "../../gpt";
import axios from 'axios'
import { openAiResponse } from "../interfaces/iopenairesponse";

export const changeStatus = (ctx: Context, action: string) => {
    const id = ctx.chat!.id
    for (const user of connectedUsers) {
        if (user.id === id) {
            user.action = action
            if(action === 'logged') {
                user.logged = true
            }
            break;
        }
    }
}

export const addToken = (ctx: Context, token: string) => {
    const id = ctx.chat!.id
    for (const user of connectedUsers) {
        if (user.id === id) {
            user.token = token
            break;
        }
    }
}

export const audioResponse = async (ctx: Context, data: openAiResponse) => {
    const date = data[0].expirationDate
    const formmatDate = date.split("T")[0]
    const textDate = await dateText(formmatDate)
    const response = `Tienes que ${data[0].description} el día ${textDate}`
    const url = googleTTS.getAudioUrl(response, {
            lang: 'es',
            slow: false,
            host: 'https://translate.google.com'
        });
        axios.get(url, {responseType: 'arraybuffer'})
        .then((response) => {
            const audio = Buffer.from(response.data, 'binary')
            return ctx.replyWithVoice({source: audio}) 
        })
}
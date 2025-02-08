import axios from "axios";
import { addToken, changeStatus } from "./bot.utilities";
import { Context } from "telegraf";

export const register = async (ctx: Context) => {
    const message = ctx.text!.trim();

    const [username, password] = message!.split(',').map((data) => data.trim());

    const userData = {
        username,
        password
    }

    const { data } = await axios.post(`${process.env.BACK_URL}/api/users/register`, userData)

    if (!data.username) {
        return ctx.reply(data)
    }
    changeStatus(ctx, 'login')
    ctx.reply(`Usuario ${data.username} creado correctamente. Introduce tu usuario y contraseña para entrar.`)
}

export const login = async (ctx: Context) => {
    const message = ctx.text!.trim();

    const [username, password] = message!.split(',').map((data) => data.trim());

    const userData = {
        username,
        password
    }
  
    try {
        const { data } = await axios.post(`${process.env.BACK_URL}/api/users/login`, userData)

        changeStatus(ctx, 'logged')
        ctx.reply(`Login Correcto con el usuario ${data.username}`)
        ctx.reply('Ahora puedes crear, ver o eliminar tareas, asignarlas a un calendario o marcalas como completadas utilizando un lengaje natural ya sea con texto o voz.')
        addToken(ctx, data.token)
        return

    } catch (error) {
        console.log(error)
        ctx.reply('Error en email y/o contraseña')
    }
}
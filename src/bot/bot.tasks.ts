import axios from "axios"
import { Context } from "telegraf";
import { openAiResponse } from "../interfaces/iopenairesponse";
import { audioResponse } from "./bot.utilities";
import { tasksFilter } from "../interfaces/itaskfilter";
import {format} from 'date-fns'


export const addTask = async (ctx: Context, token: string, obj: openAiResponse) => {
    const task = {
        description: obj.description,
        expirationDate: obj.expirationDate
    }
    const { data } = await axios.post(`${process.env.BACK_URL}/api/tasks/add-task`, task,
        {
            headers: { Authorization: token }
        }
    )
    return ctx.reply(`Tarea ${data.description} grabada correctamente par el día ${data.expirationDate}`)
}

export const getAllTaskDate = async (ctx: Context, token: string, obj: openAiResponse) => {

    const {expirationDate, pending} = obj

    const params: tasksFilter = { expirationDate}

    if (pending) params.completed = true
    console.log(params)
    const { data } = await axios.get(`${process.env.BACK_URL}/api/tasks/get`,
        {
            params,
            headers: { Authorization: token }
        }
    )
    console.log(data)
    if (!Array.isArray(data)) return ctx.reply(data)

 
        
    const responseMessage1 = `Las tareas ${pending ? 'pendientes' : ""} ${expirationDate ? `para el día ${expirationDate}` : ""}son:`  
    
    const newData = data.map(task => ({
        ...task,
        formattedDate: task.expirationDate 
            ? format(new Date(task.expirationDate), "dd-MM-yyyy") 
            : "Fecha no disponible"
    }));
    

    const responseMessage = newData
    .map((task: openAiResponse, index: number) => 
        `${index + 1}. ${task.description}` + 
        (expirationDate ? "" : ` - ${task.formattedDate}`) + 
        (pending ? "" : ` ${task.completed ? "✅" : "❌"}`)
    )
    .join("\n");

    return await ctx.reply(responseMessage1), await ctx.reply(responseMessage)
}

export const checkCompleted = async (ctx: Context, token: string, obj: openAiResponse) => {
    const { data } = await axios.put(`${process.env.BACK_URL}/api/tasks/${obj.description}/completed`, {},
        {
            headers: { Authorization: token }
        }
    )
    return ctx.reply(data)
}

export const deleteTask = async (ctx: Context, token: string, obj: openAiResponse) => {
    const { data } = await axios.delete(`${process.env.BACK_URL}/api/tasks/${obj.description}/delete`,
        {
            headers: { Authorization: token }
        }
    )
    return ctx.reply(data)
}

export const getDay = async (ctx: Context, token: string, obj: openAiResponse) => {
    const { data } = await axios.get(`${process.env.BACK_URL}/api/tasks/${obj.description}`,
        {
            headers: { Authorization: token }

        }
    )
    if (data.length === 0 ) return ctx.reply('No se ha encontrado la tarea')
    console.log(data)
    audioResponse(ctx, data)
}
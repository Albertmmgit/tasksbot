import axios from "axios"
import { Context } from "telegraf";
import { openAiResponse } from "../interfaces/iopenairesponse";
import { audioResponse } from "./bot.utilities";
import { tasksFilter } from "../interfaces/itaskfilter";


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
        
    const responseMessage1 = `Las tareas ${pending ? 'pendientes' : ""} ${expirationDate ? `para el día ${expirationDate}` : ""} son:`   

    const responseMessage = data.map((task: openAiResponse, index: number) => `${index + 1}. ${task.description} ${task.completed ? "✅ " : "❌ "}`)
        .join("\n");
    return ctx.reply(responseMessage1), ctx.reply(responseMessage)
}

// export const getAllTasks = async (ctx: Context, token: string, obj: openAiResponse) => {

// const pending = obj.pending


//     const {data} = await axios.get(`${process.env.BACK_URL}/api/tasks/getAll`,
//         {
//             params: { pending },
//             headers: { Authorization: token }
//         }
//     )
//     console.log('respuesta', data)

//     if (data.length === 0) return ctx.reply(data)

//     const responseMessage = data.map((task: openAiResponse, index: number) => `${index + 1}. ${task.description} - ${task.expirationDate} ${pending ? "" : (task.completed ? "✅ " : "❌ ")}
// `)
//         .join("\n");
//     return ctx.reply(responseMessage)
// }

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
    console.log(data)
    audioResponse(ctx, data)
}
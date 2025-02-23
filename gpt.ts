import OpenAI from "openai";
import dotenv from 'dotenv';


dotenv.config()

const openAi = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
})

export const dateText = async(fecha: string) => {
    const response = await openAi.chat.completions.create({
        model: 'chatgpt-4o-latest',
        messages: [
            {role: 'system', content: 'Tienes que interpretar una fecha'},

            {role: 'assistant', content: 'vas a recibir una fecha en formato numerico y la tienes que devolver en formato texto, por ejemplo si la fecha es 07-02-2025 tienes que devoler un string con: siete de febrero de 2025'},

            {role: 'user', content: `la fecha es ${fecha}, devuelve el string según las instrucciones dadas
            `}
        ]
    })
    return response.choices[0].message.content
}
export const createResponse = async (ctx: string, date: string) => {
    const response = await openAi.chat.completions.create({
        model: 'chatgpt-4o-latest',
        messages: [
            {role: 'system', content: 'Eres un asistente especializado en gestionar tareas dentro de una aplicación. No debes responder con texto para el usuario, sino con un JSON válido sin markdowns que indique qué acción debe realizar la API.'},

            {role: 'assistant', content: `Tu objetivo es analizar la petición del usuario y clasificarla en una de las siguientes acciones: "addTask" (añadir tarea), "getTask" (consultar tareas) (consultar todas las tareas sin expecificar la fehca), "checkCompleted" (marcar tarea como completada. Piensa que el usuario puede usar palabras como completar, hecho, realizada o similares...), "deleteTask" (eliminar tarea) o "getDay" (preguntar que día hay que hacer una determinada tarea). Siempre tienes que basarte en ${date} para determinar la fecha correcta, ten en cuenta tambíen que la fecha de grabación siempre sera superior a la actual. La respuesta siempre debe ser con formato JSON sin markdowns`},

            {role: 'user', content: `El usuario te pasa esta peticion ${ctx}, tu función es determinar que quiere hacer el usuario, las opciones sin grabar una tarea, eliminarla, ver tareas pendientes en una fecha determinada, marcar como completada una determinada tarea...Las acciones que debes determinar son: "addTask", "getTask" (el usuario puede hacer la consulta por fecha, por taras pendientes o sin especificar), "checkCompleted", "deleteTask", "getDay". Devuelve la respuesta como una cadena en un formato válido json sin markdowns:
            {
            "action": "Aquí escribe la acción", 
            "description": "Aquí escribe la tarea", 
            "pending": "devolver con 'true' si en ${ctx} interpretas que el usuario solo quiere ver tareas pendienes de realizar. Solo debes añadir el parametro pending en caso que sea true si no no incluyas pending"
            "expirationDate" (si el usuario la indica): "Aquí escribe la fecha con formato YYYY-MM-DD",
            "completed" (if exists): "Aquí escribe 'true'" 
             en caso que la tarea sea completada
            }.
            En caso de que no puedas determinar el campo "action" (el usuario no especifica que accion quiere realizar sobre la tarea dicha) devuelve este string en formato json sin markdowns { mensaje: Debes indicar la acción a realizar}
             En caso de que el usuario escriba algo fuera de contexto devuelve este string en formato json sin markdowns { mensaje: No te he entendido.}
            `}
        ]
    })
    return response.choices[0].message.content;
    }




    


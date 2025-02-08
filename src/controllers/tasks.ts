import { Tasks } from "../models/tasks"


export const postTask = async (req, res, next) => {
    req.body.userId = req.userId
    try {
        const task = await Tasks.create(req.body);
        res.status(200).json(task)
    } catch (error) {
        next(error)
        res.status(400).send('No se ha podido guardar la tarea')
    }
}

export const getByUserId = async (req, res, next) => {
    const userId  = req.userId
    const { date } = req.query
    console.log(typeof date)
    console.log(userId)

    const [year, month, day] = date.split("-");

    const startOfDay = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    const endOfDay = new Date(`${year}-${month}-${day}T23:59:59.999Z`);

    try {
        const tasks = await Tasks.find({
            userId, 
            expirationDate: { $gte: startOfDay, $lte: endOfDay }
        })
        if (tasks.length === 0) {
            return res.status(200).send(`No hay tareas asignadas para el día ${date}.`);
        }
        res.status(200).json(tasks)
    } catch (error) {
        next(error)
        res.status(400).send('Error al obtener la tarea')
    }
}

export const getTaskByDate = async (req, res, next) => {
    const { task } = req.params
    const userId = req.userId
    console.log(task, userId)
    try {
        const response = await Tasks.find({
            userId,
            description: { $regex: task, $options: "i" }
        })
        res.status(200).json(response)
    } catch (error) {
        next(error)
        res.status(500).send('No se ha encontrado la tarea')
    }
}

export const deleteTask = async (req, res, next) => {
    const { task } = req.params;
    const userId  = req.userId
    try {
        const response = await Tasks.findOneAndDelete(
            {
                userId,
                description: task
            })

        if (!response) {
            return res.status(404).send(`No se encontró la tarea "${task}" para eliminar.`);
        }
        res.status(200).send(`Tarea ${task} eliminada correctamente`)
    } catch (error) {
        next(error)
        res.status(500).send(`Error al eliminar la tarea ${task}`)
    }
}

export const taskCompleted = async (req, res, next) => {
    const  task  = req.params
    const  userId  = req.userId
    console.log(req.params)
    try {
        const response = await Tasks.findOneAndUpdate(
            {
                userId,
                description: { $regex: task, $options: "i" }
            },
            { completed: true },
            { new: true }
        )

        if (!response) {
            return res.status(404).send(`No se encontró la tarea "${task}" para completar.`);
        }
        res.status(200).json(`Tarea ${task} completada`)
    } catch (error) {
        next(error)
    }
}
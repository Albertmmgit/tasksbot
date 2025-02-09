export interface tasksFilter {
userId: number,
expirationDate?: { $gte: Date; $lte: Date },
completed?: boolean
}
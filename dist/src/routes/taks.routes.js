"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tasks_1 = require("../controllers/tasks");
const middlewares_1 = require("../utilities/middlewares");
const router = express_1.default.Router();
//add task
router.post('/add-task', middlewares_1.verifyToken, tasks_1.postTask);
//get all tasks by Date
router.get('/get', middlewares_1.verifyToken, tasks_1.getByUserId);
//get all tasks
router.get('getAll', middlewares_1.verifyToken, tasks_1.getAll);
//get one task
router.get('/:task', middlewares_1.verifyToken, tasks_1.getTaskByDate);
//check task completed
router.put('/:task/completed', middlewares_1.verifyToken, tasks_1.taskCompleted);
//delete task
router.delete('/:task/delete', middlewares_1.verifyToken, tasks_1.deleteTask);
exports.default = router;

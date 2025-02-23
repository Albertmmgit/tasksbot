import express from 'express';
import { deleteTask, getByUserId, getTaskByDate, postTask, taskCompleted } from '../controllers/tasks';
import { verifyToken } from '../utilities/middlewares';


const router = express.Router();

//add task
router.post('/add-task', verifyToken, postTask);

//get tasks 
router.get('/get', verifyToken, getByUserId);

//get one task
router.get('/:task', verifyToken, getTaskByDate);

//check task completed
router.put('/:task/completed', verifyToken, taskCompleted)

//delete task
router.delete('/:task/delete', verifyToken, deleteTask);


export default router


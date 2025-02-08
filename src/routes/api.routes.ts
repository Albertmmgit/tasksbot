import express from 'express';
import usersRoutes from './users.routes';
import tasksRoutes from './taks.routes'

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/tasks', tasksRoutes)


export default router

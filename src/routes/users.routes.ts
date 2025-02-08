import {Router} from 'express'
import {login,register, updateUser } from "../controllers/user";

const router = Router()

router.post('/register', register)
router.post('/login', login)

router.put('/userId', updateUser)



export default router
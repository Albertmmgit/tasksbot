import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/users';

export const register = async (req, res, next) => {
    try {
        const username = req.body.username
        const userExists = await User.findOne({ username })
        if (userExists) return res.status(200).send('Este nombre de usuario ya existe, elige otro')

        req.body.password = await bcrypt.hash(req.body.password, 8);
        const user = await User.create(req.body);
        res.status(200).json(user)
    } catch (error) {
        next(error)
        res.status(500).send('Error al crear el usuario')
    }
}

export const login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('Error en usuario y/o conrtaseña ')
        }

        const same = await bcrypt.compare(password, user.password);
        if (!same) {
            return res.status(500).send('Error en usuario y/o contraseña')
        }

        res.json({
            message: 'Login correcto',
            username: user.username,
            token: jwt.sign({
                user_id: user._id,

            }, process.env.TOKEN_KEY)
        })
    } catch (error) {
        next(error)
        return res.status(500).send('Error en usuario y/o contraseña')
    }
}

export const updateUser = async (req, res, next) => {
    const { userId } = req.params
    try {
        const user = await User.findByIdAndUpdate(userId, req.body);
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}



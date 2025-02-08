"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = require("../models/users");
const register = async (req, res, next) => {
    try {
        const username = req.body.username;
        const userExists = await users_1.User.findOne({ username });
        if (userExists)
            return res.status(200).send('Este nombre de usuario ya existe, elige otro');
        req.body.password = await bcrypt_1.default.hash(req.body.password, 8);
        const user = await users_1.User.create(req.body);
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
        res.status(500).send('Error al crear el usuario');
    }
};
exports.register = register;
const login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await users_1.User.findOne({ username });
        if (!user) {
            return res.status(400).send('Error en usuario y/o conrtaseña ');
        }
        const same = await bcrypt_1.default.compare(password, user.password);
        if (!same) {
            return res.status(500).send('Error en usuario y/o contraseña');
        }
        res.json({
            message: 'Login correcto',
            username: user.username,
            token: jsonwebtoken_1.default.sign({
                user_id: user._id,
            }, process.env.TOKEN_KEY)
        });
    }
    catch (error) {
        next(error);
        return res.status(500).send('Error en usuario y/o contraseña');
    }
};
exports.login = login;
const updateUser = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await users_1.User.findByIdAndUpdate(userId, req.body);
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;

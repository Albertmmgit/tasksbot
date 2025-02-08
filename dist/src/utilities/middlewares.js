"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']; // Suponiendo que el token está en el header Authorization
    if (!token) {
        return res.status(403).json({ message: "Acceso denegado. No se proporcionó token." });
    }
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token inválido." });
        }
        req.userId = decoded.user_id;
        next();
    });
};
exports.verifyToken = verifyToken;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    const url = `mongodb+srv://amartinezmarg:${process.env.DB_KEY}@tasksbotapp.dwyu3.mongodb.net/?retryWrites=true&w=majority&ssl=true&appName=tasksbotapp`;
    try {
        mongoose_1.default.connect(url);
        console.log("Conectado a MongoDB Atlas");
    }
    catch (error) {
        console.error('Error de conexión a la base de datos', error);
    }
};
connectDB();
module.exports = mongoose_1.default;

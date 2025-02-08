import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()


const connectDB = async () => {

    const url = `mongodb+srv://amartinezmarg:${process.env.DB_KEY}@tasksbotapp.dwyu3.mongodb.net/?retryWrites=true&w=majority&ssl=true&appName=tasksbotapp`
    try {
 
        mongoose.connect(url)
        console.log("Conectado a MongoDB Atlas")
        
    } catch (error) {
        console.error('Error de conexión a la base de datos', error)
    }

}

connectDB()

module.exports = mongoose
import dotenv from 'dotenv';
import http from 'node:http'
import express from 'express';
import cors from 'cors';
import routes from './src/routes/api.routes'
import {bot} from './bot'

export const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

app.use(bot.webhookCallback('/telegram-bot'))
app.use('/api', routes)

bot.telegram.setWebhook(`${process.env.BOT_URL}/telegram-bot`)

const port = process.env.PORT || 3000

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Servidor node escuchando en el puerto ${port}`)
})




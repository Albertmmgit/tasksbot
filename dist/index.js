"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const node_http_1 = __importDefault(require("node:http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const api_routes_1 = __importDefault(require("./src/routes/api.routes"));
const bot_1 = require("./bot");
exports.app = (0, express_1.default)();
dotenv_1.default.config();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
exports.app.use(bot_1.bot.webhookCallback('/telegram-bot'));
exports.app.use('/api', api_routes_1.default);
bot_1.bot.telegram.setWebhook(`${process.env.BOT_URL}/telegram-bot`);
const port = process.env.PORT || 3000;
const server = node_http_1.default.createServer(exports.app);
server.listen(port, () => {
    console.log(`Servidor node escuchando en el puerto ${port}`);
});

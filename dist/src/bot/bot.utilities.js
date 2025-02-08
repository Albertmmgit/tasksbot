"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.audioResponse = exports.addToken = exports.changeStatus = void 0;
const bot_1 = require("../../bot");
const googleTTS = __importStar(require("google-tts-api"));
const gpt_1 = require("../../gpt");
const axios_1 = __importDefault(require("axios"));
const changeStatus = (ctx, action) => {
    const id = ctx.chat.id;
    for (const user of bot_1.connectedUsers) {
        if (user.id === id) {
            user.action = action;
            if (action === 'logged') {
                user.logged = true;
            }
            break;
        }
    }
};
exports.changeStatus = changeStatus;
const addToken = (ctx, token) => {
    const id = ctx.chat.id;
    for (const user of bot_1.connectedUsers) {
        if (user.id === id) {
            user.token = token;
            break;
        }
    }
};
exports.addToken = addToken;
const audioResponse = async (ctx, data) => {
    const date = data[0].expirationDate;
    const formmatDate = date.split("T")[0];
    const textDate = await (0, gpt_1.dateText)(formmatDate);
    const response = `Tienes que ${data[0].description} el día ${textDate}`;
    const url = googleTTS.getAudioUrl(response, {
        lang: 'es',
        slow: false,
        host: 'https://translate.google.com'
    });
    axios_1.default.get(url, { responseType: 'arraybuffer' })
        .then((response) => {
        const audio = Buffer.from(response.data, 'binary');
        return ctx.replyWithVoice({ source: audio });
    });
};
exports.audioResponse = audioResponse;

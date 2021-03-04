"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const infoLogger = winston_1.default.createLogger({
    format: winston_1.default.format.simple(),
    transports: [
        new winston_1.default.transports.File({ filename: process.cwd() + '\\logs\\info.log', level: 'info' })
    ],
});
const errorLogger = winston_1.default.createLogger({
    format: winston_1.default.format.simple(),
    transports: [
        new winston_1.default.transports.File({ filename: process.cwd() + '\\logs\\errors.log', level: 'error' })
    ],
});
module.exports.infoLogger = infoLogger;
module.exports.errorLogger = errorLogger;

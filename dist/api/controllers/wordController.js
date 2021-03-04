"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeWord = exports.addSamples = exports.addWord = exports.getTopWords = exports.getWords = void 0;
const word_1 = __importDefault(require("../models/word"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const jf = __importStar(require("joiful"));
require('dotenv').config();
//console.log(Buffer.from(process.env.PRIVATE_KEY as string, 'base64').toString());
let privateKeyString = (_a = process.env.PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n');
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert({
        privateKey: privateKeyString,
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL
    })
});
const db = firebase_admin_1.default.firestore();
const waitRandom = () => {
    const date = Date.now();
    let now = null;
    do {
        now = Date.now();
    } while (now - date < Math.round(Math.random() * (3000 - 500)) + 500);
};
const assignId = () => {
    return (db.collection('words').doc().id);
};
let getWords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let words = [];
    let snapshot = yield db.collection('words')
        .orderBy('time', 'desc')
        .limit(10)
        .get();
    snapshot.forEach(doc => words.push(word_1.default.fromMap(doc.data())));
    return res.send(words);
});
exports.getWords = getWords;
let getTopWords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let words = [];
    let snapshot = yield db.collection('words')
        .orderBy('likes', 'desc')
        .limit(10)
        .get();
    snapshot.forEach(doc => words.push(word_1.default.fromMap(doc.data())));
    return res.send(words);
});
exports.getTopWords = getTopWords;
let addWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let receivedWord = req.body.word;
    receivedWord.id = assignId();
    let word = word_1.default.fromMap(receivedWord);
    let { error } = jf.validate(word);
    if (error)
        return res.send({ status: 'Invalid Request', error: error.details[0].message });
    let jsonWord = JSON.parse(JSON.stringify(word));
    jsonWord.time = firebase_admin_1.default.firestore.FieldValue.serverTimestamp();
    let result = yield db.collection('words').doc(word.id).set(jsonWord);
    return res.send(result);
});
exports.addWord = addWord;
let addSamples = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = req.body.data;
    let results = [];
    for (let sample of data) {
        waitRandom();
        sample.id = assignId();
        let word = word_1.default.fromMap(sample);
        let { error } = jf.validate(word);
        if (error)
            return res.send({ status: 'Invalid Request', error: error.details[0].message });
        let jsonWord = JSON.parse(JSON.stringify(word));
        jsonWord.time = firebase_admin_1.default.firestore.FieldValue.serverTimestamp();
        results.push(yield db.collection('words').doc(word.id).set(jsonWord));
    }
    return res.send(results);
});
exports.addSamples = addSamples;
let likeWord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let wordId = req.body.data.word_id;
    let wordRef = yield db.collection('words').doc(wordId).get();
    if (wordRef.exists) {
        let result = yield db.collection('words').doc(wordRef.id).update({ likes: firebase_admin_1.default.firestore.FieldValue.increment(1) });
        return res.send(result);
    }
    else {
        return res.send({ status: 'Word Not Found' });
    }
});
exports.likeWord = likeWord;

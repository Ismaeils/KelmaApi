import {Request, Response} from 'express';
import Word from '../models/word';
import admin from 'firebase-admin';
import * as jf from 'joiful';

require('dotenv').config();
//console.log(Buffer.from(process.env.PRIVATE_KEY as string, 'base64').toString());
let privateKeyString = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n');

admin.initializeApp({
    credential: admin.credential.cert({
        privateKey: privateKeyString,
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL
    })
});
const db = admin.firestore();

const waitRandom = () => { 
    const date = Date.now();
    let now = null;
    do {
        now = Date.now();
    } while (now - date < Math.round(Math.random() * (3000 - 500)) + 500);
}

const assignId = ()=>{
    return (db.collection('words').doc().id);

}


export let getWords = async (req:Request, res:Response)=> {
    let currentWordId = req.body.word_id;
    let words:Array<Word> = [];
    let snapshot;
    if(currentWordId){
        let wordRef = db.collection('words').doc(currentWordId);
        let currentWordSnapshot = await wordRef.get();
        let startAtSnapshot = db.collection('words')
        .orderBy('time', 'desc')
        .startAt(currentWordSnapshot);

        snapshot = await startAtSnapshot.limit(10).get();
        
    }else{
        snapshot = await db.collection('words')
        .orderBy('time', 'desc')
        .limit(10)
        .get();
    }
    snapshot.forEach(doc=>words.push(Word.fromMap(doc.data())));
    return res.send(words);
}

export let getTopWords = async (req:Request, res:Response)=> {
    let words:Array<Word> = [];
    let snapshot = await db.collection('words')
    .orderBy('likes', 'desc')
    .limit(10)
    .get();

    snapshot.forEach(doc=>words.push(Word.fromMap(doc.data())));

    return res.send(words);
}

export let addWord = async (req:Request, res:Response)=>{
    let receivedWord = req.body.word;
    receivedWord.id = assignId();

    let word = Word.fromMap(receivedWord);
    let {error} = jf.validate(word);
    if(error) return res.send({status: 'Invalid Request', error: error.details[0].message});

    let jsonWord = JSON.parse(JSON.stringify(word));
    jsonWord.time = admin.firestore.FieldValue.serverTimestamp();

    let result = await db.collection('words').doc(word.id).set(jsonWord);
    return res.send(result);
}

export let addSamples = async (req:Request, res:Response)=>{
    let data = req.body.data;
    let results = [];
    for(let sample of data){
        waitRandom();
        sample.id = assignId();

        let word = Word.fromMap(sample);
        let {error} = jf.validate(word);
        
        if(error) return res.send({status: 'Invalid Request', error: error.details[0].message});

        let jsonWord = JSON.parse(JSON.stringify(word));
        jsonWord.time = admin.firestore.FieldValue.serverTimestamp();

        results.push(await db.collection('words').doc(word.id).set(jsonWord));
    }
    return res.send(results);
}

export let likeWord = async (req:Request, res:Response)=>{

    let wordId = req.body.data.word_id;
    let wordRef = await db.collection('words').doc(wordId).get();

    if(wordRef.exists){
        let result = await db.collection('words').doc(wordRef.id).update({likes: admin.firestore.FieldValue.increment(1)});
        return res.send(result);
    }else{
        return res.send({status: 'Word Not Found'});
    }

}
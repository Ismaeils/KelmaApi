import { Application } from "express";
import * as wordController from './controllers/wordController';

export default (app:Application)=>{

    app.get('/',wordController.getWords);

    app.get('/topwords',wordController.getTopWords);

    app.post('/newword',wordController.addWord);

    app.post('/addsamples',wordController.addSamples);

    app.put('/like',wordController.likeWord);
    
}
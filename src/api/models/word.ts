import * as jf from 'joiful';
import admin from 'firebase-admin';
export default class Word{
    @jf.string().max(100).required()
    id: string;
    
    @jf.string().max(100).required()
    title: string;

    @jf.string().max(100).required()
    credit: string;

    @jf.array().required()
    uses: Array<String>;

    @jf.number().required()
    likes: number;

    constructor(id:string, title:string, credit:string, uses:Array<string>, likes:number){
        this.id = id;
        this.title = title;
        this.credit = credit;
        this.uses = uses;
        this.likes = likes;
    }

    static fromMap(word:any){
        return new Word(word.id,word.title,word.credit, word.uses, word.likes);
    }
    
};
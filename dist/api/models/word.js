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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const jf = __importStar(require("joiful"));
class Word {
    constructor(id, title, credit, uses, likes) {
        this.id = id;
        this.title = title;
        this.credit = credit;
        this.uses = uses;
        this.likes = likes;
    }
    static fromMap(word) {
        return new Word(word.id, word.title, word.credit, word.uses, word.likes);
    }
}
__decorate([
    jf.string().max(100).required(),
    __metadata("design:type", String)
], Word.prototype, "id", void 0);
__decorate([
    jf.string().max(100).required(),
    __metadata("design:type", String)
], Word.prototype, "title", void 0);
__decorate([
    jf.string().max(100).required(),
    __metadata("design:type", String)
], Word.prototype, "credit", void 0);
__decorate([
    jf.array().required(),
    __metadata("design:type", Array)
], Word.prototype, "uses", void 0);
__decorate([
    jf.number().required(),
    __metadata("design:type", Number)
], Word.prototype, "likes", void 0);
exports.default = Word;
;

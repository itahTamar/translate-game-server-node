"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { getUserWords } from './userWordsCont';
const userWordsCont_1 = require("./userWordsCont");
const router = express_1.default.Router();
router
    .get('/getXRandomUserWords', userWordsCont_1.getXRandomUserWords)
    .get('/getAllUsersWords', userWordsCont_1.getAllUsersWords)
    .get('/random-words', userWordsCont_1.getXRandomUserWords)
    .delete('/deleteUserWord/:wordID', userWordsCont_1.deleteUserWord);
exports.default = router;
//# sourceMappingURL=userWordsRoute.js.map
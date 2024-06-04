"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wordCont_1 = require("./wordCont");
const router = express_1.default.Router();
router
    .get('/get-words', wordCont_1.getWords)
    // .get('/get-word-by-id', getWordByID)
    .post('/add-word', wordCont_1.addWord)
    .patch('/updateWord/:wordID', wordCont_1.updateWord);
// .delete('/deleteWordById/:wordID', deleteWordById);
exports.default = router;
//# sourceMappingURL=wordRoute.js.map
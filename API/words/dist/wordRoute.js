"use strict";
exports.__esModule = true;
var express_1 = require("express");
var wordCont_1 = require("./wordCont");
var router = express_1["default"].Router();
router
    .get('/get-words', wordCont_1.getWords)
    .post('/add-word', wordCont_1.addWord);
// .delete('/delete-word', deleteWord);
exports["default"] = router;

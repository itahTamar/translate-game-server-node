"use strict";
exports.__esModule = true;
var express_1 = require("express");
// import { getUserWords } from './userWordsCont';
var userWordsCont_1 = require("./userWordsCont");
var router = express_1["default"].Router();
router.get('/get-user-words', userWordsCont_1.getUserWordsGili);
exports["default"] = router;

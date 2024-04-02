"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.addWord = exports.getWords = void 0;
//import { UserWordsModel } from './wordModel';
//import { userWordsArr } from './../userWords/userWordsModel';
// import { UserModel, UserSchema } from './../users/userModel';
// import mongoose from "mongoose";
//import { UserWordModel } from "../userWords/userWordsModel";
var wordModel_1 = require("./wordModel");
//import { getUser } from '../users/userCont';
var jwt_simple_1 = require("jwt-simple");
//get
function getWords(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var wordsDB, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, wordModel_1.WordModel.find({})]; //bring all words from DB
                case 1:
                    wordsDB = _a.sent() //bring all words from DB
                    ;
                    res.send({ words: wordsDB });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
} //work ok
exports.getWords = getWords;
function addWord(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userID, secret, decodedUserId, _a, en_word, he_word, word, wordDBid, isWordExist, existingUserWord, newUserWordDB, userWords, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    userID = req.cookies.user;
                    if (!userID)
                        throw new Error("At WordsCont addWord: userID not found in cookie");
                    console.log('At addWord the userID from cookies: ', { userID: userID });
                    secret = process.env.JWT_SECRET;
                    if (!secret)
                        throw new Error("At userCont getUser: Couldn't load secret from .env");
                    decodedUserId = jwt_simple_1["default"].decode(userID, secret);
                    console.log('At userCont getUser the decodedUserId:', decodedUserId);
                    _a = req.body, en_word = _a.en_word, he_word = _a.he_word;
                    console.log({ en_word: en_word, he_word: he_word }); // work
                    if (!en_word || !he_word)
                        throw new Error("At wordCont addWord: Please complete all fields");
                    word = new wordModel_1.WordModel({ en_word: en_word, he_word: he_word });
                    console.log("At wordCont addWord word at line 40: ", word);
                    wordDBid = void 0;
                    return [4 /*yield*/, wordModel_1.WordModel.findOne({ en_word: en_word, he_word: he_word })];
                case 1:
                    isWordExist = _b.sent();
                    if (isWordExist) {
                        console.log("This word already exist in word-DB");
                        wordDBid = isWordExist._id;
                        console.log("At wordCont addWord wordDBid at line 48: ", wordDBid);
                    }
                    else {
                        word.save(); //save the word in word-DB
                        wordDBid = word._id;
                        console.log("At wordCont addWord wordDBid at line 52: ", wordDBid);
                    }
                    return [4 /*yield*/, wordModel_1.UserWordsModel.findOne({ wordsId: wordDBid, userId: decodedUserId })];
                case 2:
                    existingUserWord = _b.sent();
                    if (!existingUserWord) return [3 /*break*/, 3];
                    throw new Error("At wordCont addWord: the word already exist in your DB");
                case 3: return [4 /*yield*/, wordModel_1.UserWordsModel.create({
                        wordsId: wordDBid,
                        userId: decodedUserId
                    })];
                case 4:
                    newUserWordDB = _b.sent();
                    console.log("At wordCont addWord newUserWordDB at line 63: ", newUserWordDB); //--> work
                    _b.label = 5;
                case 5: return [4 /*yield*/, wordModel_1.UserWordsModel.find({ userId: decodedUserId })]; //bring all user-words from DB 
                case 6:
                    userWords = _b.sent() //bring all user-words from DB 
                    ;
                    console.log("At wordCont addWord userWords line 69: ", userWords);
                    //send the new word array to user
                    if (userWords === undefined)
                        throw new Error("At wordCont addWord line 63: userWordsArr is undefine or empty ");
                    res.send({ words: userWords }); //*till here everything work ok!
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _b.sent();
                    console.error(error_2);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
} //work ok
exports.addWord = addWord;
//post (add) -> not work
// export async function updateWord(req: any, res: any) {
//     try {
//         //get user id from cookie
//         const userID: string = req.cookies.user;  //unique id. get the user id from the cookie - its coded!
//         if (!userID) throw new Error("At WordsCont addWord: userID not found in cookie");
//         console.log('At addWord the userID from cookies: ', { userID });
//         const secret = process.env.JWT_SECRET;
//         if (!secret) throw new Error("At userCont getUser: Couldn't load secret from .env");
//         const decodedUserId = jwt.decode(userID, secret);
//         console.log('At userCont getUser the decodedUserId:', decodedUserId)
//         const { wrongEnWord, wronginterpretation } = req.body;
//         console.log({ wrongEnWord, wronginterpretation });  // work
//         if (!wrongEnWord || !wronginterpretation) throw new Error("At wordCont addWord: Please complete all filds");
//         //creat new word with using mongoos
//         const word = new WordModel({ wrongEnWord, wronginterpretation });
//         console.log("At wordCont addWord word at line 40: ", word)
//         let wordDBid;
//         //chack if the word exist on word-DB
//         const isWordExist = await WordModel.findOne({ wrongEnWord: wrongEnWord, wronginterpretation: wronginterpretation })
//         if (isWordExist) {
//             console.log("This word alrady exist in word-DB")
//             wordDBid = isWordExist._id
//             console.log("At wordCont addWord wordDBid at line 48: ", wordDBid)
//         } else {
//             word.save() //save the word in word-DB
//             wordDBid = word._id
//             console.log("At wordCont addWord wordDBid at line 52: ", wordDBid)
//         }
//         //chack if the words alredy in the userWordsDB -> work 
//         const existingUserWord = await UserWordsModel.findOne({ wordsId: wordDBid, userId: decodedUserId })
//         if (existingUserWord) throw new Error("At wordCont addWord: the word alredy exist in your DB")
//         else {
//             const newUserWordDB = await UserWordsModel.create({
//                 wordsId: wordDBid,
//                 userId: decodedUserId
//             }); // save the new word in the user-word-DB
//             console.log("At wordCont addWord newUserWordDB at line 63: ", newUserWordDB) //--> work
//         }
//         //query the DB to retrive all the user words
//         const userWords = await UserWordsModel.find({ userId: decodedUserId })  //bring all user-words from DB 
//         console.log("At wordCont addWord userWords line 69: ", userWords) 
//         //send the new word array to user
//         if (userWords === undefined) throw new Error("At wordCont addWord line 63: userWordsArr is undefine or emty ");
//         res.send({ words: userWords }); //*till here everything work ok!
//     } catch (error) {
//         console.error(error);
//     }
// }
//delete --> not work
//!to renew this fun --> only for admin in the future
// export async function deleteWord(req: any) {
//     try {
//         const { wrongEnWord, wronginterpretation } = req.body;
//         console.log("At deleteWord the req.body got:",wrongEnWord, wronginterpretation ) //undefined undefined
//         await WordModel.findOneAndDelete(wrongEnWord, wronginterpretation);
//     } catch (error) {
//         console.error(error);
//     }
// }

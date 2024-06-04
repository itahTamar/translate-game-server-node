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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWord = exports.addWord = exports.getWords = void 0;
const wordModel_1 = require("./wordModel");
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const mongoCRUD_1 = require("../../CRUD/mongoCRUD");
const mongoCRUD_2 = require("./../../CRUD/mongoCRUD");
//get all words of all users
function getWords(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("hello from getWords");
            const wordsDB = yield (0, mongoCRUD_1.getAllData)(req, res, wordModel_1.WordModel);
            res.send({ words: wordsDB });
        }
        catch (error) {
            console.error(error);
        }
    });
} //work ok
exports.getWords = getWords;
function addWord(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get user id from cookie
            const userID = req.cookies.user; //unique id. get the user id from the cookie - its coded!
            if (!userID)
                throw new Error("At WordsCont addWord: userID not found in cookie");
            console.log("At addWord the userID from cookies: ", { userID }); //work ok
            const secret = process.env.JWT_SECRET;
            if (!secret)
                throw new Error("At userCont getUser: Couldn't load secret from .env");
            const decodedUserId = jwt_simple_1.default.decode(userID, secret);
            console.log("At userCont getUser the decodedUserId:", decodedUserId); //work ok
            const { en_word, he_word } = req.body;
            console.log("At wordCont/addWord the req.body:", { en_word, he_word }); // work ok
            if (!en_word || !he_word)
                throw new Error("At wordCont addWord: Please complete all fields");
            //create new word with using mongoose
            const word = new wordModel_1.WordModel({ en_word, he_word });
            console.log("At wordCont addWord word:", word); //work ok
            let wordDBid;
            //check if the word exist on word-DB
            const isWordExist = yield (0, mongoCRUD_2.getOneData)(req, res, wordModel_1.WordModel, {
                en_word: en_word,
                he_word: he_word,
            });
            console.log("At wordCont/addWord isWordExist:", isWordExist); //isWordExist: {ok: true, response: {_id: , en_word:"" , he_word: ""}}
            if (isWordExist) {
                console.log("This word already exist in word-DB");
                wordDBid = isWordExist.response._id;
                console.log("At wordCont/addWord wordDBid:", wordDBid);
            }
            else {
                //save the new word in word-DB
                const ok = (0, mongoCRUD_1.saveData)(word); //work ok
                if (!ok)
                    throw new Error("at addWord Fails to save the word in word-db");
                wordDBid = word._id;
                console.log("At wordCont/addWord wordDBid:", wordDBid);
            }
            //check if the words already in the userWordsDB -> work
            const existingUserWord = yield (0, mongoCRUD_2.getOneData)(req, res, wordModel_1.UserWordsModel, { wordsId: wordDBid, userId: decodedUserId });
            console.log("At wordCont/addWord existingUserWord:", existingUserWord);
            let message;
            if (existingUserWord.ok) {
                console.log("At wordCont addWord: the word already exist in your DB");
                message = "the word already exist in your vocabulary";
            }
            else {
                const newUserWordDB = yield (0, mongoCRUD_1.createAndSaveData)(req, res, wordModel_1.UserWordsModel, "wordsId", "userId", wordDBid, decodedUserId); // save the new word in the user-word-DB
                console.log("At wordCont addWord newUserWordDB:", newUserWordDB); //--> work
                message = "the word was successfully saved";
            }
            //query the DB to retrieve all the user words
            const userWords = yield (0, mongoCRUD_1.getAllData)(req, res, wordModel_1.UserWordsModel, { userId: decodedUserId }); //bring all user-words from DB
            console.log("At wordCont/addWord userWords:", userWords);
            //send the new word array to user
            if (userWords === undefined)
                throw new Error("At wordCont addWord line 63: userWordsArr is undefine or empty ");
            res.send({ ok: true, words: userWords, message });
        }
        catch (error) {
            console.error(error);
        }
    });
} //work ok
exports.addWord = addWord;
//!get one word by wordID - not use
// export async function getWordByID(wordDBid: string | ObjectId) {
//   try {
//     // const wordDB = await getDataByID(WordModel, wordDBid); //bring the word from DB
//     const wordDB = await WordModel.findOne({ _id: wordDBid }); //bring the word from DB
//     console.log("at getWordByID the wordDB:", wordDB);
//     return { word: wordDB };
//   } catch (error) {
//     console.error(error);
//   }
// } 
//update thw word in words.db (wil update for all users using this word)
function updateWord(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const wordID = req.params.wordID;
            if (!wordID)
                throw new Error("no word id in params updateWord");
            console.log("at wordCont/updateWord the wordID:", wordID);
            const { en_word, he_word } = req.body;
            if (!en_word || !he_word)
                throw new Error("no word in body");
            const updateWordData = { en_word, he_word };
            //find the word in DB by word_id and update
            const wordExistAndUpdate = yield (0, mongoCRUD_1.updateOneData)(wordModel_1.WordModel, { _id: wordID }, updateWordData);
            console.log("at wordCont/updateWord the wordExistAndUpdate", wordExistAndUpdate);
            res.send(wordExistAndUpdate);
            //at wordCont/updateWord the wordExistAndUpdate {
            //   ok: true,
            //   response: {
            //        _id: new ObjectId("66571ff99d66a29097bae66d"),
            //        en_word: 'the update en_word',
            //        he_word:'the update he_word',
            //        __v: 0
            //   },
            //   massage: 'The word update successfully'
            // }
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: error.message });
        }
    });
} //work ok
exports.updateWord = updateWord;
//! delete word from all DB (admin only) - not use yet
//1. delete the word by id from all user-word-model (no need for userID)
//2. delete the word by id from word-model
// export async function deleteWordById(req: any, res: any) {
//   try {
//     const wordID = req.params.wordID;
//     if (!wordID) throw new Error("no word id in params deleteUserWord");
//     console.log("at wordCont/deleteUserWord the wordID:", wordID);
//     if (await UserWordsModel.findOneAndDelete({ wordsId: wordID })) {
//       if (await WordModel.findOneAndDelete({ _id: wordID })) {
//         res.send({ ok: true, massage: "the word deleted successfully" });
//       }
//     } else {
//       res.send({ ok: false, massage: "the word was not deleted" });
//     }
//   } catch (error) {
//     console.error(error, "at wordCont/deleteUserWord delete failed");
//   }
// }
//# sourceMappingURL=wordCont.js.map
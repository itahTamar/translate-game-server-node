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
exports.deleteUserWord = exports.getXRandomUserWords = exports.getAllUsersWords = void 0;
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const mongoCRUD_1 = require("../../CRUD/mongoCRUD");
const wordModel_1 = require("./../words/wordModel");
let ObjectId = require("mongoose").Types.ObjectId;
// function createUserWordDocument(
//   id: string,
//   wordsId: ObjectId,
//   userId: ObjectId
// ): UserWordDocument {
//   const userWordDocument: UserWordDocument = Object.create(
//     Object.getPrototypeOf({})
//   );
//   Object.defineProperties(userWordDocument, {
//     id: { value: id, enumerable: true },
//     wordsId: { value: wordsId, enumerable: true },
//     userId: { value: userId, enumerable: true },
//     // Define any other properties you need
//   });
//   return userWordDocument;
// }
function getAllUsersWords(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get user id from cookie
            const userID = req.cookies.user; //unique id. get the user id from the cookie - its coded!
            if (!userID)
                throw new Error("At userWordsCont getAllUsersWords: userID not found in cookie");
            console.log("At userWordsCont getUserWords the userID from cookies: ", {
                userID,
            }); //work ok
            const secret = process.env.JWT_SECRET;
            if (!secret)
                throw new Error("At userWordsCont getAllUsersWords: Couldn't load secret from .env");
            const decodedUserId = jwt_simple_1.default.decode(userID, secret);
            console.log("At userWordsCont getAllUsersWords the decodedUserId:", decodedUserId); //work ok
            // const allUserWordsIDFromDBs = await UserWordsModel.find({userId: decodedUserId}); //get all users word into array of objects with the id of the words not the words themselves
            const userWordDocResult = yield (0, mongoCRUD_1.getAllDataFromMongoDB)(wordModel_1.UserWordsModel, { userId: decodedUserId });
            if (!userWordDocResult.ok)
                throw new Error(userWordDocResult.error);
            console.log("At userWordsCont getAllUsersWords the userWordDocResult:", userWordDocResult);
            //@ts-ignore
            const userWordArray1 = userWordDocResult.response;
            console.log("At userWordsCont getAllUsersWords the userWordArray1:", userWordArray1);
            const allUserWordsArray = yield userWordArray1.map((e) => (0, mongoCRUD_1.getOneDataFromJoinCollectionInMongoDB)(wordModel_1.WordModel, e.wordsId));
            console.log("At userWordsCont getAllUsersWords the allUserWordsArray:", allUserWordsArray);
            const allUserWordsData = yield Promise.all(allUserWordsArray.map((promise) => __awaiter(this, void 0, void 0, function* () { return yield promise; })));
            console.log("At userWordsCont getAllUsersWords the allUserWordsData:", allUserWordsData);
            const extractedResponses = allUserWordsData.map((e) => e.response);
            console.log("At userWordsCont getAllUsersWords the response:", extractedResponses);
            res.send({ ok: true, words: extractedResponses });
            // res.send({ ok: true, words: allUserWordsArray});
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ ok: false, error: error.message });
        }
    });
} //work ok
exports.getAllUsersWords = getAllUsersWords;
//get X random words from the user words in the DB
function getXRandomUserWords(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //get user id from cookie
            const userID = req.cookies.user; //unique id. get the user id from the cookie - its coded!
            if (!userID)
                throw new Error("At userWordsCont/getXRandomUserWords: userID not found in cookie");
            console.log("At userWordsCont/getXRandomUserWords the userID from cookies: ", {
                userID,
            });
            const secret = process.env.JWT_SECRET;
            if (!secret)
                throw new Error("At userWordsCont/getXRandomUserWords: Couldn't load secret from .env");
            const decodedUserId = jwt_simple_1.default.decode(userID, secret);
            console.log("At userWordsCont/getXRandomUserWords the decodedUserId:", decodedUserId);
            const userIdMongoose = new ObjectId(decodedUserId);
            console.log("At userWordsCont/getXRandomUserWords the userIdMongoose:", userIdMongoose);
            const userWordsListResult = yield (0, mongoCRUD_1.getXRandomDataList)(wordModel_1.UserWordsModel, "userId", userIdMongoose, 3, "words", "wordsId", "_id", "word");
            console.log("At userWordsCont/getXRandomUserWords the userWordsListResult:", userWordsListResult);
            const userWordsList = userWordsListResult.response;
            console.log("At userWordsCont/getXRandomUserWords the userWordsList:", userWordsList);
            const wordList = userWordsList.map((e) => e.word[0]);
            console.log("At userWordsCont/getXRandomUserWords the wordList:", wordList);
            res.send({ ok: true, words: wordList });
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ ok: false, error: error.message });
        }
    });
} //work ok
exports.getXRandomUserWords = getXRandomUserWords;
//delete word from user
function deleteUserWord(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userID = req.cookies.user; //unique id. get the user id from the cookie - its coded!
            if (!userID)
                throw new Error("At userWordsCont getUserWords: userID not found in cookie");
            console.log("At userWordsCont getUserWords the userID from cookies: ", {
                userID,
            });
            const secret = process.env.JWT_SECRET;
            if (!secret)
                throw new Error("At userWordsCont getUserWords: Couldn't load secret from .env");
            const decodedUserId = jwt_simple_1.default.decode(userID, secret);
            console.log("At userWordsCont getUserWords the decodedUserId:", decodedUserId);
            const wordID = req.params.wordID;
            if (!wordID)
                throw new Error("no word id in params deleteUserWord");
            console.log("at wordCont/deleteUserWord the wordID:", wordID);
            if (yield (0, mongoCRUD_1.deleteOneDataFromMongoDB)(wordModel_1.UserWordsModel, {
                wordsId: wordID,
                userId: decodedUserId,
            })) {
                res.send({ ok: true, massage: "the word deleted from user" });
            }
            else {
                res.send({ ok: false, massage: "the word not deleted from user" });
            }
        }
        catch (error) {
            console.error(error, "at wordCont/deleteUserWord delete failed");
        }
    });
} //work ok
exports.deleteUserWord = deleteUserWord;
//# sourceMappingURL=userWordsCont.js.map
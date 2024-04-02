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
exports.getUserWordsGili = void 0;
var jwt_simple_1 = require("jwt-simple");
var wordModel_1 = require("./../words/wordModel");
var ObjectId = require('mongoose').Types.ObjectId;
// export async function getUserWords(req:any, res:any) { //work
//     try {
//         //get user id from cookie
//         const userID: string = req.cookies.user;  //unique id. get the user id from the cookie - its coded!
//         if (!userID) throw new Error("At userWordsCont getUserWords: userID not found in cookie");
//         console.log('At userWordsCont getUserWords the userID from cookies: ', { userID });
//         const secret = process.env.JWT_SECRET;
//         if (!secret) throw new Error("At userWordsCont getUserWords: Couldn't load secret from .env");
//         const decodedUserId = jwt.decode(userID, secret);
//         console.log('At userWordsCont getUserWords the decodedUserId:', decodedUserId)
//         const userWordsDBs = await UserWordsModel.find({userId: decodedUserId});  //work
//         console.log("At userWordsCont getUserWords the userWordsDB:",userWordsDBs )
//         // const userWordsArr = await Promise.all(
//         //     userWordsDBs.map(async (userWordsDB) => {
//         //         const word = await WordModel.findById(userWordsDB.wordsId);
//         //         return word;
//         //     })
//         // );
//         const userWordsArr = await UserWordsModel.aggregate([
//             {
//                 $match: {
//                     userId: decodedUserId,
//                 },
//             },
//             {
//                 $lookup: {
//                     from: "words", // Replace with the actual name of your words collection
//                     localField: "wordsId",
//                     foreignField: "_id",
//                     as: "word",
//                 },
//             },
//             {
//                 $unwind: "$word", // If there is a one-to-one relationship, you can skip this stage
//             },
//             {
//                 $project: {
//                     word: 1, // Include only the "word" field in the final output
//                 },
//             },
//         ]);
//         console.log("At userWordsCont getUserWords the userWordsArr:", userWordsArr)
//         res.send({words: userWordsArr}); //work
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ error: error.message });
//     }
// }
function getUserWordsGili(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userID, secret, decodedUserId, userIdMongoose, userWordsModel, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userID = req.cookies.user;
                    if (!userID)
                        throw new Error("At userWordsCont getUserWords: userID not found in cookie");
                    console.log("At userWordsCont getUserWords the userID from cookies: ", {
                        userID: userID
                    });
                    secret = process.env.JWT_SECRET;
                    if (!secret)
                        throw new Error("At userWordsCont getUserWords: Couldn't load secret from .env");
                    decodedUserId = jwt_simple_1["default"].decode(userID, secret);
                    console.log("At userWordsCont getUserWords the decodedUserId:", decodedUserId);
                    userIdMongoose = new ObjectId(decodedUserId);
                    return [4 /*yield*/, wordModel_1.UserWordsModel.aggregate([
                            { $match: { userId: userIdMongoose } },
                            { $sample: { size: 3 } },
                            { $lookup: { from: 'words', localField: 'wordsId', foreignField: "_id", as: "word" } }
                        ])];
                case 1:
                    userWordsModel = _a.sent();
                    res.send({ words: userWordsModel }); //work
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    res.status(500).send({ error: error_1.message });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getUserWordsGili = getUserWordsGili;

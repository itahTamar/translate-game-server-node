"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserWordsModel = exports.words = exports.WordModel = exports.WordSchema = exports.Word = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userModel_1 = require("../users/userModel");
class Word {
    constructor({ en_word, he_word }) {
        this.en_word = en_word;
        this.he_word = he_word;
    }
}
exports.Word = Word;
//building a schema
exports.WordSchema = new mongoose_1.Schema({
    en_word: {
        type: String,
        required: true,
    },
    he_word: {
        type: String,
        required: true,
    },
});
// Create a unique compound index for en_word, he_word
exports.WordSchema.index({ en_word: 1, he_word: 1 }, { unique: true });
// export const WordModel = model("word", WordSchema);
exports.WordModel = (0, mongoose_1.model)("word", exports.WordSchema);
exports.words = [];
const UserWordsSchema = new mongoose_1.default.Schema({
    wordsId: { type: mongoose_1.Schema.Types.ObjectId, ref: exports.WordModel },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: userModel_1.UserModel },
});
// Create a unique compound index for UserWordsSchema
UserWordsSchema.index({ wordsId: 1, userId: 1 }, { unique: true });
exports.UserWordsModel = (0, mongoose_1.model)("UserWords", UserWordsSchema);
//# sourceMappingURL=wordModel.js.map
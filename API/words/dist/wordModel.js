"use strict";
exports.__esModule = true;
exports.UserWordsModel = exports.words = exports.WordModel = exports.WordSchema = exports.Word = void 0;
var mongoose_1 = require("mongoose");
var userModel_1 = require("../users/userModel");
var Word = /** @class */ (function () {
    function Word(_a) {
        var en_word = _a.en_word, he_word = _a.he_word;
        this.en_word = en_word;
        this.he_word = he_word;
    }
    return Word;
}());
exports.Word = Word;
//deine a schema
exports.WordSchema = new mongoose_1.Schema({
    en_word: {
        type: String,
        required: true
    },
    he_word: {
        type: String,
        required: true
    }
});
// Create a unique compound index for en_word, he_word
exports.WordSchema.index({ en_word: 1, he_word: 1 }, { unique: true });
exports.WordModel = mongoose_1.model("word", exports.WordSchema);
exports.words = [];
var UserWordsSchema = new mongoose_1["default"].Schema({
    wordsId: { type: mongoose_1.Schema.Types.ObjectId, ref: exports.WordModel },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: userModel_1.UserModel }
});
// Create a unique compound index for UserWordsSchema
UserWordsSchema.index({ wordsId: 1, userId: 1 }, { unique: true });
exports.UserWordsModel = mongoose_1["default"].model("userwords", UserWordsSchema);

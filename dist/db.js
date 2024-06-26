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
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
function setupDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield mongodb_1.MongoClient.connect('mongodb://localhost:27017');
        const db = client.db('translationGame');
        const collection = db.collection('words');
        // Drop the unique index on the en_word field
        yield collection.dropIndex('en_word_1');
        // Close the connection
        yield client.close();
    });
}
exports.default = setupDatabase;

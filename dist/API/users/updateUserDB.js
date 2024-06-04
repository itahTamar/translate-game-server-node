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
exports.addFieldToUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = require("./userModel");
const User = mongoose_1.default.model('User', userModel_1.userSchema);
//general function to add a field to my DB
function addFieldToUsers(fieldName, defaultValue) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield User.updateMany({}, { $set: { [fieldName]: defaultValue } });
            console.log(`${result.modifiedCount} documents were updated with ${fieldName}.`);
        }
        catch (err) {
            console.error(`Error updating documents with ${fieldName}:`, err);
        }
    });
}
exports.addFieldToUsers = addFieldToUsers;
//# sourceMappingURL=updateUserDB.js.map
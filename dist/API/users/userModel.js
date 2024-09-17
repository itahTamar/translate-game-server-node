"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.UserModel = exports.userSchema = exports.User = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
class User {
    constructor({ userName, password }) {
        this.userName = userName;
        this.password = password;
        this.role = "user";
        this.highScore = 0;
        this.email = "none";
    }
    setRole(role) {
        this.role = role;
    }
}
exports.User = User;
//define a schema (It is like interface in typescript)
exports.userSchema = new mongoose_2.default.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    highScore: { type: Number, default: 0 }, // Add the new field with a default value
    role: { type: String, default: "user" },
    email: { type: String, default: "none" }
});
//"users" is the name of the collection in the DB
exports.UserModel = (0, mongoose_1.model)("users", exports.userSchema);
exports.users = [];
//# sourceMappingURL=userModel.js.map
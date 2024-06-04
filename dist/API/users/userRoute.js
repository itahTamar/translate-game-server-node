"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userCont_1 = require("./userCont");
//import { isAdmin } from './middelware/users';
const router = express_1.default.Router();
router
    .post('/login', userCont_1.login)
    .post("/register", userCont_1.registerUser)
    .get("/getUserHighScore", userCont_1.getUserHighScore);
//.get("/get-user", getUser)
//.get("/get-users",isAdmin, getUsers)
exports.default = router;
//# sourceMappingURL=userRoute.js.map
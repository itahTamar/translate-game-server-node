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
exports.saveUserScore = exports.getUserHighScore = exports.updateUser = exports.deleteUser = exports.login = exports.registerUser = void 0;
const userModel_1 = require("./userModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const mongoose_1 = __importDefault(require("mongoose"));
const { JWT_SECRET } = process.env;
const secret = JWT_SECRET;
const saltRounds = 10;
//register user
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("hello from server registerUser");
        const { userName, password } = req.body;
        console.log({ userName }, { password });
        if (!userName || !password)
            throw new Error("At userCont-registerUser complete all fields");
        //encode password with bcrypt.js
        const hash = yield bcrypt_1.default.hash(password, saltRounds);
        const user = new userModel_1.UserModel({ userName, password: hash });
        const userDB = yield user.save(); //if there is problem saving in DB it catch the error
        console.log(userDB);
        if (userDB) {
            res.send({ ok: true });
        }
        else {
            res.send({ ok: false });
        }
    }
    catch (error) {
        console.error(error);
        res.send({ ok: false, error: "server error at register-user" });
    }
}); //work ok
exports.registerUser = registerUser;
//login user
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        console.log("At userCont login:", { userName, password });
        if (!userName || !password)
            throw new Error("At userCont login: complete all fields");
        //check if user exist and password is correct
        const userDB = yield userModel_1.UserModel.findOne({ userName });
        if (!userDB)
            throw new Error("At userCont login: some of the details are incorrect");
        const { password: hash } = userDB;
        if (!hash)
            throw new Error("At userCont login: some of the details are incorrect");
        //check if hash password is equal to the password that the user entered
        const match = yield bcrypt_1.default.compare(password, hash);
        if (!match)
            throw new Error("At userCont login: some of the details are incorrect");
        //create and encode cookie with JWT
        // encode
        const JWTCookie = jwt_simple_1.default.encode(userDB._id, secret); //the id given by mongo is store in the cookie
        console.log("At userCont login JWTCookie:", JWTCookie); //got it here!
        res.cookie("user", JWTCookie, {
            // httpOnly: true,  //makes the cookie inaccessible via JavaScript on the client side. It won't show up in document.cookie or the browser's developer tools.
            path: "/", // Set the path to root to make it available across the entire site
            sameSite: 'None', // Required for cross-origin cookies
            secure: true, //true for PROD, false for DEV
            maxAge: 1000 * 60 * 60 * 24, //1 day
        }); //send the cookie to client
        res.send({ ok: true });
    }
    catch (error) {
        console.error(error);
        res.status(401).send({ error });
    }
}); //work ok
exports.login = login;
//did not use this functions now:
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userName, password } = req.body;
            if (!userName || !password)
                throw new Error("please fill all");
            //check if user exist and password is correct
            const userDB = yield userModel_1.UserModel.findOne({ userName });
            if (!userDB)
                throw new Error("some of the details are incorrect");
            const { password: hash } = userDB;
            if (!hash)
                throw new Error("some of the details are incorrect");
            //check if hash password is equal to the password that the user entered
            const match = yield bcrypt_1.default.compare(password, hash);
            if (!match)
                throw new Error("some of the details are incorrect");
            yield userModel_1.UserModel.findOneAndDelete({ userName, password });
            res.send({ ok: true });
        }
        catch (error) {
            console.error(error);
            res.send({ error });
        }
    });
}
exports.deleteUser = deleteUser;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { oldName, oldpassword, newname, newpassword } = req.body;
            if (!oldName || !oldpassword || !newname || !newpassword)
                throw new Error("please fill all");
            //check if user exist and password is correct
            const userDB = yield userModel_1.UserModel.findOne({ oldName });
            if (!userDB)
                throw new Error("some of the details are incorrect");
            const { password: hash } = userDB;
            if (!hash)
                throw new Error("some of the details are incorrect");
            //check if hash password is equal to the password that the user entered
            const match = yield bcrypt_1.default.compare(oldpassword, hash);
            if (!match)
                throw new Error("some of the details are incorrect");
            const newUserdb = yield userModel_1.UserModel.findOneAndUpdate({ oldName, oldpassword }, { newname, newpassword });
            res.send({ ok: true }, newUserdb);
        }
        catch (error) {
            console.error(error);
            res.send({ error });
        }
    });
}
exports.updateUser = updateUser;
function getUserHighScore(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userID = req.cookies.user; //unique id. get the user id from the cookie - its coded!
        if (!userID)
            throw new Error("At userCont/getUserScores: userID not found in cookie");
        console.log("At userCont/getUserScores the userID from cookies: ", {
            userID,
        });
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error("At userCont/getUserScores: Couldn't load secret from .env");
        const decodedUserId = jwt_simple_1.default.decode(userID, secret);
        console.log("At userCont/getUserScores the decodedUserId:", decodedUserId);
        const objectId = new mongoose_1.default.Types.ObjectId(decodedUserId);
        console.log("At userCont/getUserScores the objectId:", objectId);
        const userDB = yield userModel_1.UserModel.findById(objectId);
        if (!userDB)
            throw new Error("At userCont/getUserScores: can not find user");
        console.log("At userCont/getUserScores the userDB.highScore:", userDB.highScore);
        res.send({ ok: true, highScore: userDB.highScore });
    });
}
exports.getUserHighScore = getUserHighScore;
function saveUserScore(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userID = req.cookies.user; //unique id. get the user id from the cookie - its coded!
        if (!userID)
            throw new Error("At userCont/getUserScores: userID not found in cookie");
        console.log("At userCont/getUserScores the userID from cookies: ", {
            userID,
        });
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error("At userCont/getUserScores: Couldn't load secret from .env");
        const decodedUserId = jwt_simple_1.default.decode(userID, secret);
        console.log("At userCont/getUserScores the decodedUserId:", decodedUserId);
        const objectId = new mongoose_1.default.Types.ObjectId(decodedUserId);
        console.log("At userCont/getUserScores the objectId:", objectId);
        //save the score to user db
        //const userDB = await UserModel.findById(objectId);
        //res.send({ ok: true, highScore: userDB.highScore });
    });
}
exports.saveUserScore = saveUserScore;
//# sourceMappingURL=userCont.js.map
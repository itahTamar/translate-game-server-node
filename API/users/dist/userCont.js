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
exports.updateUser = exports.deleteUser = exports.login = exports.registerUser = void 0;
var userModel_1 = require("./userModel");
var bcrypt_1 = require("bcrypt");
var jwt_simple_1 = require("jwt-simple");
var JWT_SECRET = process.env.JWT_SECRET;
var secret = JWT_SECRET;
var saltRounds = 10;
//register user (work ok)
exports.registerUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userName, password, hash, user, userDB, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, userName = _a.userName, password = _a.password;
                console.log({ userName: userName }, { password: password });
                if (!userName || !password)
                    throw new Error("At userCont registrerUser complete all fields");
                return [4 /*yield*/, bcrypt_1["default"].hash(password, saltRounds)];
            case 1:
                hash = _b.sent();
                user = new userModel_1.UserModel({ userName: userName, password: hash });
                return [4 /*yield*/, user.save()];
            case 2:
                userDB = _b.sent();
                console.log(userDB);
                res.send({ ok: true, userDB: userDB });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error(error_1);
                res.send({ error: error_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
//work ok
exports.login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userName, password, userDB, hash, match, JWTCookie, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, userName = _a.userName, password = _a.password;
                console.log("At userCont login:", { userName: userName, password: password });
                if (!userName || !password)
                    throw new Error("At userCont login: complete all fields");
                return [4 /*yield*/, userModel_1.UserModel.findOne({ userName: userName })];
            case 1:
                userDB = _b.sent();
                if (!userDB)
                    throw new Error("At userCont login: some of the details are incorrect");
                hash = userDB.password;
                if (!hash)
                    throw new Error("At userCont login: some of the details are incorrect");
                return [4 /*yield*/, bcrypt_1["default"].compare(password, hash)];
            case 2:
                match = _b.sent();
                if (!match)
                    throw new Error("At userCont login: some of the details are incorrect");
                JWTCookie = jwt_simple_1["default"].encode(userDB._id, secret);
                console.log("At userCont login JWTCookie:", JWTCookie); //got it here!
                res.cookie("user", JWTCookie, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }); //send the cookie to claint
                res.send({ ok: true });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error(error_2);
                res.status(401).send({ error: error_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// export async function getUser(userID: string) {
//   try {
//       const secret = process.env.JWT_SECRET;
//       if (!secret) throw new Error("At userCont getUser: Couldn't load secret from .env"); 
//       console.log('At userCont getUser the parameter:', userID) //got it
//       const decodedUserId = jwt.decode(userID, secret); 
//       console.log('At userCont getUser the decodedUserId:', decodedUserId) 
//       // const { userId } = decodedUserId;
//       const userDB = await UserModel.findById(decodedUserId);
//       if (!userDB) throw new Error(`At userCont getUser: Couldn't find user id with the id: ${decodedUserId}`);
//       //console.log('At userCont getUser userDB:',userDB) //work
//       //res.send({ userDB });
//       return userDB.userName
//   } catch (error) {
//       //res.send({ error: error.message })
//       console.error(error);
//   }
// }
//did not use this functions now:
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, userName, password, userDB, hash, match, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    _a = req.body, userName = _a.userName, password = _a.password;
                    if (!userName || !password)
                        throw new Error("please fill all");
                    return [4 /*yield*/, userModel_1.UserModel.findOne({ userName: userName })];
                case 1:
                    userDB = _b.sent();
                    if (!userDB)
                        throw new Error("some of the details are incorrect");
                    hash = userDB.password;
                    if (!hash)
                        throw new Error("some of the details are incorrect");
                    return [4 /*yield*/, bcrypt_1["default"].compare(password, hash)];
                case 2:
                    match = _b.sent();
                    if (!match)
                        throw new Error("some of the details are incorrect");
                    return [4 /*yield*/, userModel_1.UserModel.findOneAndDelete({ userName: userName, password: password })];
                case 3:
                    _b.sent();
                    res.send({ ok: true });
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _b.sent();
                    console.error(error_3);
                    res.send({ error: error_3.message });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.deleteUser = deleteUser;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, oldName, oldpassword, newname, newpassword, userDB, hash, match, newUserdb, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    _a = req.body, oldName = _a.oldName, oldpassword = _a.oldpassword, newname = _a.newname, newpassword = _a.newpassword;
                    if (!oldName || !oldpassword || !newname || !newpassword)
                        throw new Error("please fill all");
                    return [4 /*yield*/, userModel_1.UserModel.findOne({ oldName: oldName })];
                case 1:
                    userDB = _b.sent();
                    if (!userDB)
                        throw new Error("some of the details are incorrect");
                    hash = userDB.password;
                    if (!hash)
                        throw new Error("some of the details are incorrect");
                    return [4 /*yield*/, bcrypt_1["default"].compare(oldpassword, hash)];
                case 2:
                    match = _b.sent();
                    if (!match)
                        throw new Error("some of the details are incorrect");
                    return [4 /*yield*/, userModel_1.UserModel.findOneAndUpdate({ oldName: oldName, oldpassword: oldpassword }, { newname: newname, newpassword: newpassword })];
                case 3:
                    newUserdb = _b.sent();
                    res.send({ ok: true }, newUserdb);
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _b.sent();
                    console.error(error_4);
                    res.send({ error: error_4.message });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.updateUser = updateUser;

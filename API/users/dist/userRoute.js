"use strict";
exports.__esModule = true;
var express_1 = require("express");
var userCont_1 = require("./userCont");
//import { isAdmin } from './middelware/users';
var router = express_1["default"].Router();
router
    .post('/login', userCont_1.login)
    .post("/register", userCont_1.registerUser);
//.get("/get-user", getUser)
//.get("/get-users",isAdmin, getUsers)
exports["default"] = router;

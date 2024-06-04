"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const { SECRET } = process.env;
const secret = SECRET;
const jwt = require('jwt-simple');
function isAdmin(req, res, next) {
    try {
        //take from cookie and decode cookie and check for admin role
        const token = req.cookies.user;
        if (!token)
            throw new Error("no token");
        const cookie = jwt.decode(token, secret);
        //decoded cookie
        const { role } = cookie;
        req.role = role;
        if (role !== "admin")
            throw new Error("no admin");
        next();
    }
    catch (error) {
        res.status(401).send({ error: error.message });
    }
}
exports.isAdmin = isAdmin;
//at the moment - do not use it
//# sourceMappingURL=userMid.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_uri = process.env.MONGO_URL;
const connectionMongo = mongoose_1.default
    .connect(mongodb_uri)
    .then(() => {
    console.info("MongoDB connected");
    // addFieldToUsers("role", "user");  //update my user DB with a new field
})
    .catch((err) => {
    console.error(err);
});
exports.default = connectionMongo;
//# sourceMappingURL=mongodb.js.map
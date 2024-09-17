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
    // Update user DB with a new field - enter new fieldName and defaultValue and save & run "npm run dev"
    // addFieldToUsers("email", "none");  
})
    .catch((err) => {
    console.error(err);
});
exports.default = connectionMongo;
//# sourceMappingURL=dbConn.js.map
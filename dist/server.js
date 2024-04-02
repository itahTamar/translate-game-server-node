"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//npm i dotenv
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = express_1.default();
const port = process.env.PORT || 3000;
//middleware for using parser
app.use(cookie_parser_1.default());
//static files
app.use(express_1.default.static("public"));
//body
app.use(express_1.default.json());
//connect to mongoDB with mongoose
const mongodb_uri = process.env.MONGO_URL;
// connect to mongoDB with mongoose
mongoose_1.default.connect(mongodb_uri).then(() => {
    console.info("MongoDB connected");
})
    .catch(err => {
    console.error(err);
});
// get router from usersRouter
const userRoute_1 = __importDefault(require("./API/users/userRoute"));
app.use("/API/users", userRoute_1.default);
// get router from wordRouter
const wordRoute_1 = __importDefault(require("./API/words/wordRoute"));
app.use("/API/words", wordRoute_1.default);
// get router from wordRouter
const userWordsRoute_1 = __importDefault(require("./API/userWords/userWordsRoute"));
app.use("/API/userWords", userWordsRoute_1.default);
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

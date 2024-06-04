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
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
//npm i dotenv
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
//middleware for using parser
app.use((0, cookie_parser_1.default)());
//static files
// app.use(express.static("public"));
//body
app.use(express_1.default.json());
const mongodb_1 = __importDefault(require("./DBConnections/mongodb"));
// //connect to mongoDB with mongoose
// const mongodb_uri = process.env.MONGO_URL;
// // connect to mongoDB with mongoose
// mongoose.connect(mongodb_uri).then(() => {
//   console.info("MongoDB connected");
//   // addFieldToUsers("role", "user");  //update my user DB with a new field
// })
//   .catch(err => {
//     console.error(err)
//   })
// get router from usersRouter
const userRoute_1 = __importDefault(require("./API/users/userRoute"));
app.use("/api/users", userRoute_1.default);
// get router from wordRouter
const wordRoute_1 = __importDefault(require("./API/words/wordRoute"));
app.use("/api/words", wordRoute_1.default);
// get router from wordRouter
const userWordsRoute_1 = __importDefault(require("./API/userWords/userWordsRoute"));
app.use("/api/userWords", userWordsRoute_1.default);
// app.use((req, res, next) => {
//   console.log(`Received request: ${req.method} ${req.url}`);
//   next();
// });
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
const connectToMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongodb_1.default;
        // console.info("MongoDB connected");
        // addFieldToUsers("role", "user"); // Update user DB with a new field
    }
    catch (err) {
        console.error(err);
        process.exit(1); // Exit the process with a non-zero code
    }
});
connectToMongoDB()
    .then(() => {
    app.use((req, res, next) => {
        console.log(`Received request: ${req.method} ${req.url}`);
        next();
    });
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
})
    .catch((err) => {
    console.error(err);
});
//# sourceMappingURL=server.js.map
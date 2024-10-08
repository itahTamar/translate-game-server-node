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
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = require("./config/corsOptions");
const mailService_1 = require("./services/mailService"); // Import the sendEmail function
//npm i dotenv
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
//middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ limit: '25mb' })); //parses incoming URL-encoded data (like form submissions) and add it to req.body. it limit the size of the request body.
app.use((0, cors_1.default)(corsOptions_1.corsOptions));
//middleware for using parser
app.use((0, cookie_parser_1.default)());
const dbConn_1 = __importDefault(require("./config/dbConn"));
//API routes
// get router from usersRouter
const userRoute_1 = __importDefault(require("./API/users/userRoute"));
app.use("/api/users", userRoute_1.default);
// get router from wordRouter
const wordRoute_1 = __importDefault(require("./API/words/wordRoute"));
app.use("/api/words", wordRoute_1.default);
// get router from wordRouter
const userWordsRoute_1 = __importDefault(require("./API/userWords/userWordsRoute"));
app.use("/api/userWords", userWordsRoute_1.default);
// Route for sending recovery email
app.post("/send_recovery_email", (req, res) => {
    (0, mailService_1.sendEmail)(req.body)
        .then((response) => res.send(response.message))
        .catch((error) => res.status(500).send(error.message));
});
// Connect to MongoDB
const connectToMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield dbConn_1.default;
        // Update user DB with a new field - enter new fieldName and defaultValue and save & run "npm run dev"
        // addFieldToUsers("email", "none"); 
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
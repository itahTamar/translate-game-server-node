"use strict";

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var express_1 = __importDefault(require("express"));

var mongoose_1 = __importDefault(require("mongoose"));

var cookie_parser_1 = __importDefault(require("cookie-parser")); //npm i dotenv


var dotenv_1 = __importDefault(require("dotenv"));

dotenv_1["default"].config();
var app = express_1["default"]();
var port = process.env.PORT || 3004; //middleware for using parser

app.use(cookie_parser_1["default"]()); //static files

app.use(express_1["default"]["static"]("public")); //body

app.use(express_1["default"].json()); //connect to mongoDB with mongoose

var mongodb_uri = process.env.MONGO_URL; // connect to mongoDB with mongoose

mongoose_1["default"].connect(mongodb_uri).then(function () {
  console.info("MongoDB connected");
})["catch"](function (err) {
  console.error(err);
}); // get router from usersRouter

var userRoute_1 = __importDefault(require("./API/users/userRoute"));

app.use("/API/users", userRoute_1["default"]); // get router from wordRouter

var wordRoute_1 = __importDefault(require("./API/words/wordRoute"));

app.use("/API/words", wordRoute_1["default"]); // get router from wordRouter

var userWordsRoute_1 = __importDefault(require("./API/userWords/userWordsRoute"));

app.use("/API/userWords", userWordsRoute_1["default"]);
app.use(function (req, res, next) {
  console.log("Received request: ".concat(req.method, " ").concat(req.url));
  next();
});
app.listen(port, function () {
  console.log("Example app listening on port ".concat(port));
});
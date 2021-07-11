"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var cors_1 = __importDefault(require("cors"));
var routes = __importStar(require("./routes"));
var swaggerDocument = __importStar(require("./docs/swagger.json"));
dotenv_1["default"].config({ path: path_1["default"].resolve(__dirname, '../.env') });
var app = express_1["default"]();
var port = process.env.PORT;
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded());
app.use(cors_1["default"]());
app.use('/api', swagger_ui_express_1["default"].serve, swagger_ui_express_1["default"].setup(swaggerDocument));
app.set('views', __dirname + "/views");
app.set('view engine', 'pug');
routes.register(app);
// eslint-disable-next-line no-console
app.listen(port, function () { return console.log("Running on port " + port); });

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.register = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var pg_promise_1 = __importDefault(require("pg-promise"));
dotenv_1["default"].config({ path: path_1["default"].resolve(__dirname, '../../.env') });
var url = process.env.URL;
console.log(url);
function sendRequest() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, match;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_fetch_1["default"](url)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    console.log(data);
                    match = new RegExp(/\.(jpg|JPG|png|PNG|gif|jpeg)/g);
                    if (!match.test(data.url)) {
                        return [2 /*return*/, sendRequest()];
                    }
                    return [2 /*return*/, data.url];
            }
        });
    });
}
var register = function (app) {
    var port = parseInt(process.env.PGPORT, 10);
    var config = {
        database: process.env.PGDATABASE,
        host: process.env.PGHOST,
        port: port,
        user: process.env.PGUSER
    };
    var pgp = pg_promise_1["default"]();
    var db = pgp(config);
    app.get('/', function (_req, res) {
        res.render('index', {
            title: 'Hey', message: 'Hello there!', getImage: '/image', listImages: '/list/dog/images'
        });
    });
    app.post('/upload/dog/image', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(req.body);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.one("\n                INSERT INTO images( url, width, height )\n                VALUES( $[url], $[width], $[height])\n                RETURNING id;", __assign({}, req.body))];
                case 2:
                    id = _a.sent();
                    res.json({ id: id });
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    res.json({ error: err_1.message || err_1 });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    app.get('/image', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var imageUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sendRequest()];
                case 1:
                    imageUrl = _a.sent();
                    res.render('image', { getURI: 'Hey', url: imageUrl });
                    return [2 /*return*/];
            }
        });
    }); });
    app.get('/list/dog/images', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var images, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db.any("\n                SELECT\n                    id\n                    , url\n                    , width\n                    , height\n                FROM    images\n                ORDER BY id")];
                case 1:
                    images = _a.sent();
                    res.json(images);
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    res.json({ error: err_2.message || err_2 });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get('/list/dog/images/view', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var images, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db.any("\n                SELECT\n                    id\n                    , url\n                    , width\n                    , height\n                FROM    images\n                ORDER BY id")];
                case 1:
                    images = _a.sent();
                    res.render('list', { results: images });
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    // tslint:disable-next-line:no-console
                    console.error(err_3);
                    res.json({ error: err_3.message || err_3 });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get('/list/dog/images/remove/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db.result("\n                DELETE\n                FROM    images\n                WHERE   id = $[id]", { id: req.params.id }, function (r) { return r.rowCount; })];
                case 1:
                    id = _a.sent();
                    res.json({ id: id });
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    // tslint:disable-next-line:no-console
                    console.error(err_4);
                    res.json({ error: err_4.message || err_4 });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
};
exports.register = register;

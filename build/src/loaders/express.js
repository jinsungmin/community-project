"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const middlewares_1 = require("../api/middlewares");
const _1 = require("./");
const routes_1 = __importDefault(require("../api/routes"));
const app = express_1.default();
app.enable('trust proxy');
app.set('etag', false);
app.set('views', path_1.default.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(cors_1.default());
app.use(middlewares_1.assignId);
app.use(middlewares_1.morgan({
    skip: (req, res) => req.originalUrl.includes('/swagger') || req.originalUrl.includes('/health') || res.statusCode > 300,
    stream: _1.logger.infoStream
}));
app.use(middlewares_1.morgan({
    skip: (req, res) => res.statusCode < 400,
    stream: _1.logger.errorStream
}));
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(helmet_1.default());
app.get('/health', (req, res) => res.status(200).end());
routes_1.default(app);
exports.default = app;

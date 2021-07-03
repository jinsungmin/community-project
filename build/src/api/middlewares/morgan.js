"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const hiddenFields = ['password', 'newPassword'];
morgan_1.default.token('reqId', (req) => req['id']);
morgan_1.default.token('userId', (req) => req['userId']);
morgan_1.default.token('body', (req) => {
    const ret = Object.assign({}, req.body);
    Object.keys(ret).forEach((key) => {
        if (hiddenFields.indexOf(key) > -1)
            ret[key] = '*'.repeat(8);
    });
    return ret;
});
function jsonFormat(tokens, req, res) {
    return JSON.stringify({
        reqId: req.id,
        userId: tokens.userId(req, res),
        body: tokens.body(req, res),
        remoteAddress: tokens['remote-addr'](req, res),
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        httpVersion: tokens['http-version'](req, res),
        status: tokens.status(req, res),
        contentLength: tokens.res(req, res, 'content-length'),
        referrer: tokens.referrer(req, res),
        userAgent: tokens['user-agent'](req, res),
        responseTime: tokens['response-time'](req, res)
    });
}
exports.default = ({ skip, stream }) => morgan_1.default(jsonFormat, { skip, stream });

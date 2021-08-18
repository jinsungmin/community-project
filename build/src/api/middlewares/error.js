"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const serialize_error_1 = require("serialize-error");
const loaders_1 = require("../../loaders");
function notFound(req, res, next) {
    res.status(404).send();
}
exports.notFound = notFound;
function errorHandler(e, req, res, next) {
    const status = e.status || 500;
    delete e.status;
    const response = {};
    if (e) {
        if (status >= 500)
            loaders_1.logger.fatal(e, { reqId: req.id });
        const error = serialize_error_1.serializeError(e) || {};
        response.message = error.message;
        if (process.env.NODE_ENV !== 'production') {
            response.stack = error.stack;
        }
        if (process.env.NODE_ENV === 'test' && status < 500) {
            loaders_1.logger.error(e);
        }
    }
    res.status(status).json(response);
}
exports.errorHandler = errorHandler;

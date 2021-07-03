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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schemas = __importStar(require("../schemas"));
function verifyOptions(req, paths, schema, coerceTypes) {
    const options = Object.assign(Object.assign(Object.assign({}, req.query), req.body), req.file);
    try {
        if (paths) {
            paths.forEach((path) => Schemas.validate(req.params, path));
        }
        if (schema)
            Schemas.validate(options, schema, { coerceTypes });
    }
    catch (e) {
        throw new Error(e);
    }
    return Object.assign(Object.assign({}, req.params), options);
}
exports.default = (paths, schema, coerceTypes) => {
    return (req, res, next) => {
        try {
            req.options = verifyOptions(req, paths, schema, coerceTypes);
            next();
        }
        catch (e) {
            e.status = 400;
            next(e);
        }
    };
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = require("express");
const default_1 = require("./default");
const middlewares_1 = require("../middlewares");
const schemas_1 = require("../schemas");
const loaders_1 = require("../../loaders");
const { errorHandler, notFound } = middlewares_1.error;
const excluded = ['/'];
function validateResponse(ctrl) {
    return function (req, res, next) {
        const json = res.json;
        res.json = function (body) {
            if (res.headersSent) {
                next();
                return;
            }
            let ret = body;
            if (res.statusCode >= 200 && res.statusCode < 300) {
                if (ctrl.responses && ctrl.responses[res.statusCode]) {
                    const response = ctrl.responses[res.statusCode];
                    if (response.schema) {
                        try {
                            ret = JSON.parse(JSON.stringify(ret));
                            schemas_1.validate(ret, response.schema);
                        }
                        catch (e) {
                            if (process.env.NODE_ENV === 'production')
                                loaders_1.logger.fatal(e);
                            else
                                next(e);
                        }
                    }
                }
            }
            json.call(res, ret);
        };
        next();
    };
}
function getController(path, obj, router) {
    if (typeof obj === 'function') {
        router.use(path, obj);
    }
    else {
        Object.keys(obj).forEach((key) => {
            const ctrl = obj[key];
            if (ctrl instanceof default_1.ApiRouter) {
                let url;
                if (typeof ctrl.name === 'string') {
                    url = ctrl.name.length > 0 ? `${path}/${ctrl.name}` : path;
                }
                else {
                    url = `${path}/${key}`;
                }
                if (!ctrl.handler)
                    throw new Error(`${url} handler is required`);
                const args = [middlewares_1.request(ctrl.paths, ctrl.schema, ctrl.coerceTypes), ...ctrl.middlewares, ctrl.handler];
                if (path.startsWith('/admin') && !ctrl.isPublic)
                    args.unshift(middlewares_1.auth.admin);
                else if (!ctrl.isPublic)
                    args.unshift(middlewares_1.auth.user(ctrl.protected));
                args.unshift(validateResponse(ctrl));
                router[ctrl.method](url, args);
            }
        });
    }
}
function loadRoutes(dir, currentDir, router) {
    fs_1.default.readdirSync(dir)
        .sort((a, b) => {
        return (Number(fs_1.default.lstatSync(path_1.default.join(dir, b)).isDirectory()) - Number(fs_1.default.lstatSync(path_1.default.join(dir, a)).isDirectory()));
    })
        .forEach((target) => {
        const targetDir = path_1.default.join(dir, target);
        const routePath = path_1.default.dirname(`/${path_1.default.relative(currentDir, targetDir)}`);
        if (fs_1.default.lstatSync(targetDir).isDirectory()) {
            loadRoutes(targetDir, currentDir, router);
        }
        else if (target.startsWith('index.') && !excluded.includes(routePath)) {
            const importPath = path_1.default.relative(__dirname, targetDir);
            const file = require(`./${importPath}`);
            getController(routePath, file.default || file, router);
        }
    });
}
exports.default = (app) => {
    const router = express_1.Router();
    loadRoutes(__dirname, __dirname, router);
    app.use('/', router);
    app.use(notFound);
    app.use(errorHandler);
};

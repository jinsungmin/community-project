"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const default_1 = require("../default");
const schemas_1 = require("../../schemas");
const package_json_1 = __importDefault(require("../../../../package.json"));
const loaders_1 = require("../../../loaders");
function escapeRefString(str) {
    return str.replace(/~/g, '~0').replace(/\//g, '~1');
}
function generatePath(path, obj, swaggerPaths) {
    Object.keys(obj).forEach((key) => {
        const ctrl = obj[key];
        if (ctrl instanceof default_1.ApiRouter) {
            let url;
            if (typeof ctrl.name === 'string') {
                if (ctrl.name.length > 0) {
                    const sub = ctrl.name
                        .split('/')
                        .map((str) => {
                        if (str.indexOf(':') === 0) {
                            str = str.replace(':', '');
                            return `{${str}}`;
                        }
                        return str;
                    })
                        .join('/');
                    url = `${path}/${sub}`;
                }
                else {
                    url = path;
                }
            }
            else {
                url = `${path}/${key}`;
            }
            if (ctrl.method) {
                if (!swaggerPaths.hasOwnProperty(url)) {
                    swaggerPaths[url] = {};
                }
                const path = {
                    tags: ctrl.tags,
                    summary: ctrl.summary,
                    description: ctrl.description,
                    parameters: [...ctrl.parameters],
                    responses: {}
                };
                if (ctrl.paths) {
                    ctrl.paths.forEach((aPath) => {
                        const schema = schemas_1.getSchema(aPath);
                        if (typeof schema === 'object') {
                            Object.entries(schema.properties).forEach(([key]) => {
                                path.parameters.push({
                                    in: 'path',
                                    name: key,
                                    required: true,
                                    schema: schema.properties[key]
                                });
                            });
                        }
                    });
                }
                if (ctrl.schema) {
                    const schema = schemas_1.getSchema(ctrl.schema);
                    if (['post', 'put'].includes(ctrl.method)) {
                        const contentType = ctrl.contentType ? ctrl.contentType : 'application/json';
                        path.requestBody = { content: {} };
                        path.requestBody.content[contentType] = {
                            schema: { $ref: `#/components/schemas/${escapeRefString(ctrl.schema)}` }
                        };
                    }
                    else if (schema && schema.properties) {
                        Object.entries(schema.properties).forEach(([key]) => {
                            const required = schema.required.indexOf(key) > -1;
                            path.parameters.push({
                                in: 'query',
                                name: key,
                                required,
                                schema: schema.properties[key]
                            });
                        });
                    }
                }
                if (ctrl.responses) {
                    Object.entries(ctrl.responses).forEach(([k, v]) => {
                        const { schema } = v, rest = __rest(v, ["schema"]);
                        if (schema) {
                            path.responses[k] = Object.assign(Object.assign({}, rest), { content: {
                                    'application/json': { schema: { $ref: `#/components/schemas/${escapeRefString(schema)}` } }
                                } });
                        }
                        else {
                            path.responses[k] = v;
                        }
                    });
                }
                if (!ctrl.isPublic) {
                    path.security = [{ bearerAuth: [] }];
                }
                swaggerPaths[url][ctrl.method] = path;
            }
        }
    });
}
function loadRoutes(dir, currentDir, swaggerPaths) {
    try {
        fs_1.default.readdirSync(dir)
            .sort((a, b) => {
            return (Number(fs_1.default.lstatSync(path_1.default.join(dir, b)).isDirectory()) - Number(fs_1.default.lstatSync(path_1.default.join(dir, a)).isDirectory()));
        })
            .forEach((target) => {
            const targetDir = path_1.default.join(dir, target);
            const routePath = path_1.default.dirname(`/${path_1.default.relative(currentDir, targetDir)}`);
            if (fs_1.default.lstatSync(targetDir).isDirectory()) {
                loadRoutes(targetDir, currentDir, swaggerPaths);
            }
            else if (target.startsWith('index.')) {
                const importPath = path_1.default.relative(__dirname, targetDir);
                const middleware = require(`./${importPath}`);
                generatePath(routePath, middleware.default || middleware, swaggerPaths);
            }
        });
    }
    catch (e) {
        loaders_1.logger.fatal(e);
    }
    return swaggerPaths;
}
exports.default = (source) => {
    try {
        const securitySchemes = {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        };
        const swagger = {
            openapi: '3.0.3',
            info: {
                title: `${package_json_1.default.name} ${process.env.NODE_ENV}`,
                description: `API Document for ${package_json_1.default.name} ${process.env.NODE_ENV}`,
                contact: {
                    name: 'Marcus'
                },
                version: '0.1.0'
            },
            components: {
                securitySchemes
            }
        };
        swagger.servers = [{ url: source }];
        swagger.paths = loadRoutes(path_1.default.join(__dirname, `../../routes`, source), path_1.default.join(__dirname, `../../routes`, source), {});
        swagger.components.schemas = schemas_1.getSchemas('/').reduce((prev, curr) => {
            const { $id } = curr, rest = __rest(curr, ["$id"]);
            prev[$id] = rest;
            return prev;
        }, {});
        return swagger;
    }
    catch (e) {
        throw e;
    }
};

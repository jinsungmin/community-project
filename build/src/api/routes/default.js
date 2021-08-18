"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRouter = void 0;
class ApiRouter {
    constructor(object) {
        this.name = object.name;
        this.method = object.method || 'get';
        this.summary = object.summary || '';
        this.description = object.description || '';
        this.tags = object.tags || [];
        this.paths = object.paths;
        this.schema = object.schema;
        this.handler = object.handler;
        this.parameters = object.parameters || [];
        this.responses = object.responses || { 200: { description: 'Success' } };
        this.contentType = object.contentType || 'application/json';
        this.middlewares = object.middlewares || [];
        this.isPublic = object.isPublic || false;
        this.protected = object.protected || false;
        this.roles = object.roles || [];
        this.fileNames = object.fileNames || [];
        this.coerceTypes = object.coerceTypes ? object.coerceTypes : 'array';
    }
}
exports.ApiRouter = ApiRouter;

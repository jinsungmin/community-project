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
exports.postRefresh = exports.postAuth = void 0;
const default_1 = require("../../default");
const ctrl = __importStar(require("./auth-ctrl"));
const postAuth = new default_1.ApiRouter({
    name: '',
    method: 'post',
    summary: '로그인',
    schema: 'requests/admin/auth/PostAuth',
    tags: ['Auth'],
    isPublic: true,
    responses: {
        200: { schema: 'responses/admin/auth/PostAuth' },
        404: { description: 'Not found' }
    },
    handler: ctrl.postAuth
});
exports.postAuth = postAuth;
const postRefresh = new default_1.ApiRouter({
    name: 'refresh',
    method: 'post',
    summary: 'Refresh Token',
    schema: 'requests/admin/auth/PostAuthRefresh',
    tags: ['Auth'],
    isPublic: true,
    responses: {
        200: { schema: 'responses/admin/auth/PostAuth' },
        401: { description: 'Expired token' }
    },
    handler: ctrl.postRefresh
});
exports.postRefresh = postRefresh;

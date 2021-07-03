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
exports.postAuthRefresh = exports.postAuthReset = exports.getAuthRegisterName = exports.getAuthRegisterEmail = exports.postAuthRegister = exports.putAuth = exports.postAuth = void 0;
const default_1 = require("../../default");
const ctrl = __importStar(require("./auth-ctrl"));
const postAuth = new default_1.ApiRouter({
    name: '',
    method: 'post',
    summary: '유저 로그인',
    schema: 'requests/front/auth/PostAuth',
    tags: ['Auth'],
    isPublic: true,
    responses: {
        200: { schema: 'responses/front/auth/PostAuth' },
        404: { description: 'Not found' }
    },
    handler: ctrl.postAuth
});
exports.postAuth = postAuth;
const putAuth = new default_1.ApiRouter({
    name: '',
    method: 'put',
    summary: '패스워드 변경',
    schema: 'requests/front/auth/PutAuth',
    tags: ['Auth'],
    roles: ['owner'],
    responses: {
        200: { schema: 'responses/front/auth/PutAuth' },
        404: { description: 'Not found' }
    },
    handler: ctrl.putAuth
});
exports.putAuth = putAuth;
const postAuthRegister = new default_1.ApiRouter({
    name: 'register',
    method: 'post',
    summary: '유저가입',
    description: '/verifications -> /verifications/confirm -> /auth/register',
    schema: 'requests/front/auth/PostAuthRegister',
    tags: ['Auth'],
    isPublic: true,
    responses: {
        201: { schema: 'responses/front/auth/PostAuth' },
        401: { description: '만료된 토큰' },
        409: { description: 'already_added' }
    },
    handler: ctrl.postAuthRegister
});
exports.postAuthRegister = postAuthRegister;
const getAuthRegisterEmail = new default_1.ApiRouter({
    name: 'register/email',
    method: 'get',
    summary: '유저가입 이메일 중복확인',
    schema: 'requests/front/auth/GetAuthRegisterEmail',
    tags: ['Auth'],
    isPublic: true,
    responses: {
        204: { description: 'Success!' },
        409: { description: 'already_added' }
    },
    handler: ctrl.getAuthRegisterEmail
});
exports.getAuthRegisterEmail = getAuthRegisterEmail;
const getAuthRegisterName = new default_1.ApiRouter({
    name: 'register/name',
    method: 'get',
    summary: '유저가입 닉네임 중복확인',
    schema: 'requests/front/auth/GetAuthRegisterName',
    tags: ['Auth'],
    isPublic: true,
    responses: {
        204: { description: 'Success!' },
        409: { description: 'already_added' }
    },
    handler: ctrl.getAuthRegisterName
});
exports.getAuthRegisterName = getAuthRegisterName;
const postAuthReset = new default_1.ApiRouter({
    name: 'reset',
    method: 'put',
    summary: '패스워드 재설정',
    schema: 'requests/front/auth/PostAuthReset',
    tags: ['Auth'],
    isPublic: true,
    responses: {
        204: { description: '이메일 발송 성공' },
        401: { description: '만료된 토큰' },
        404: { description: 'not_found' }
    },
    handler: ctrl.postAuthReset
});
exports.postAuthReset = postAuthReset;
const postAuthRefresh = new default_1.ApiRouter({
    name: 'refresh',
    method: 'post',
    summary: '토큰 갱신',
    schema: 'requests/front/auth/PostAuthRefresh',
    tags: ['Auth'],
    isPublic: true,
    responses: {
        201: { schema: 'responses/front/auth/PostAuthRefresh' },
        401: { description: '만료된 토큰' },
    },
    handler: ctrl.postAuthRefresh
});
exports.postAuthRefresh = postAuthRefresh;

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
exports.postVerificationsEmail = exports.postVerificationsConfirm = exports.postVerifications = void 0;
const default_1 = require("../../default");
const ctrl = __importStar(require("./verifications-ctrl"));
const postVerifications = new default_1.ApiRouter({
    name: '',
    method: 'post',
    summary: 'OTP 생성 및 SMS 전송. 개발 서버에서는 Response에서 확인 가능',
    schema: 'requests/front/verifications/PostVerifications',
    tags: ['Verifications'],
    isPublic: true,
    responses: {
        200: { schema: 'responses/front/verifications/PostVerifications' },
        404: { description: '해당 전화번호로 가입한 유저가 없음' },
        409: {
            description: `사용중인 전화번호\n
    already_in_use - 이미 가입된 유저의 전화번호`
        }
    },
    handler: ctrl.postVerifications
});
exports.postVerifications = postVerifications;
const postVerificationsConfirm = new default_1.ApiRouter({
    name: 'confirm',
    method: 'post',
    summary: 'OTP 인증',
    schema: 'requests/front/verifications/PostVerificationsConfirm',
    tags: ['Verifications'],
    isPublic: true,
    responses: {
        200: { schema: 'responses/front/verifications/PostVerificationsConfirm' },
        401: { description: '만료된 토큰' },
        409: { description: '잘못된 OTP' }
    },
    handler: ctrl.postVerificationsConfirm
});
exports.postVerificationsConfirm = postVerificationsConfirm;
const postVerificationsEmail = new default_1.ApiRouter({
    name: 'email',
    method: 'post',
    summary: '이메일 인증',
    schema: 'requests/front/verifications/PostVerificationsEmail',
    tags: ['Verifications'],
    isPublic: true,
    responses: {
        200: { schema: 'responses/front/verifications/PostVerificationsEmail' },
        401: { description: 'not_found' },
        409: { description: 'not_found' }
    },
    handler: ctrl.postVerificationsEmail
});
exports.postVerificationsEmail = postVerificationsEmail;

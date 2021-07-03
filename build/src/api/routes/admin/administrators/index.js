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
exports.deleteAdminsWithId = exports.putAdminsWithId = exports.getAdminsWithId = exports.getAdmins = exports.postAdmins = void 0;
const default_1 = require("../../default");
const ctrl = __importStar(require("./administrators-ctrl"));
const postAdmins = new default_1.ApiRouter({
    name: '',
    method: 'post',
    summary: '관리자 추가',
    schema: 'requests/admin/administrators/PostAdministrators',
    tags: ['Admins'],
    responses: {
        201: { schema: 'responses/admin/administrators/PostAdministrators' },
        409: { description: 'already added' }
    },
    handler: ctrl.postAdmins
});
exports.postAdmins = postAdmins;
const getAdmins = new default_1.ApiRouter({
    name: '',
    method: 'get',
    summary: '관리자 목록 조회',
    schema: 'requests/admin/administrators/GetAdministrators',
    tags: ['Admins'],
    responses: {
        200: { schema: 'responses/admin/administrators/GetAdministrators' }
    },
    handler: ctrl.getAdmins
});
exports.getAdmins = getAdmins;
const getAdminsWithId = new default_1.ApiRouter({
    name: ':id',
    method: 'get',
    paths: ['common/IdPath'],
    summary: '관리자 상세 조회',
    tags: ['Admins'],
    responses: {
        200: { schema: 'responses/admin/administrators/GetAdministratorsWithId' },
        404: { description: 'Not found' }
    },
    handler: ctrl.getAdminsWithId
});
exports.getAdminsWithId = getAdminsWithId;
const putAdminsWithId = new default_1.ApiRouter({
    name: ':id',
    method: 'put',
    paths: ['common/IdPath'],
    summary: '관리자 수정',
    schema: 'requests/admin/administrators/PutAdministrators',
    tags: ['Admins'],
    responses: {
        200: { schema: 'responses/admin/administrators/PutAdministratorsWithId' },
        404: { description: 'Not found' }
    },
    handler: ctrl.putAdminsWithId
});
exports.putAdminsWithId = putAdminsWithId;
const deleteAdminsWithId = new default_1.ApiRouter({
    name: ':id',
    method: 'delete',
    paths: ['common/IdPath'],
    summary: '관리자 삭제',
    tags: ['Admins'],
    responses: {
        204: { description: 'Success' },
        404: { description: 'Not found' }
    },
    handler: ctrl.deleteAdminsWithId
});
exports.deleteAdminsWithId = deleteAdminsWithId;

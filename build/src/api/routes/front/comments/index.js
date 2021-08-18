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
exports.deleteCommentsWithId = exports.putCommentsWithId = exports.getCommentsWithId = exports.getComments = exports.postComments = void 0;
const default_1 = require("../../default");
const ctrl = __importStar(require("./comments-ctrl"));
const postComments = new default_1.ApiRouter({
    name: '',
    method: 'post',
    summary: '댓글 추가',
    schema: 'requests/front/comments/PostComments',
    tags: ['Comments'],
    responses: {
        201: { schema: 'responses/front/comments/PostComments' },
        409: { description: 'already added' }
    },
    handler: ctrl.postComments
});
exports.postComments = postComments;
const getComments = new default_1.ApiRouter({
    name: '',
    method: 'get',
    summary: '댓글 목록 조회',
    schema: 'requests/front/comments/GetComments',
    tags: ['Comments'],
    responses: {
        200: { schema: 'responses/front/comments/GetComments' }
    },
    handler: ctrl.getComments
});
exports.getComments = getComments;
const getCommentsWithId = new default_1.ApiRouter({
    name: ':id',
    method: 'get',
    paths: ['common/IdPath'],
    summary: '댓글 상세 조회',
    tags: ['Comments'],
    responses: {
        200: { schema: 'responses/front/comments/GetCommentsWithId' },
        404: { description: 'Not found' }
    },
    handler: ctrl.getCommentsWithId
});
exports.getCommentsWithId = getCommentsWithId;
const putCommentsWithId = new default_1.ApiRouter({
    name: ':id',
    method: 'put',
    paths: ['common/IdPath'],
    summary: '댓글 수정',
    schema: 'requests/front/comments/PutComments',
    tags: ['Comments'],
    responses: {
        200: { schema: 'responses/front/comments/PutCommentsWithId' },
        404: { description: 'Not found' }
    },
    handler: ctrl.putCommentsWithId
});
exports.putCommentsWithId = putCommentsWithId;
const deleteCommentsWithId = new default_1.ApiRouter({
    name: ':id',
    method: 'delete',
    paths: ['common/IdPath'],
    summary: '댓글 삭제',
    tags: ['Comments'],
    responses: {
        204: { description: 'Success' },
        404: { description: 'Not found' }
    },
    handler: ctrl.deleteCommentsWithId
});
exports.deleteCommentsWithId = deleteCommentsWithId;

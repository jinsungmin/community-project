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
exports.deletePostsWithId = exports.putPostsWithId = exports.getPostsWithId = exports.getPosts = exports.postPosts = void 0;
const default_1 = require("../../default");
const ctrl = __importStar(require("./posts-ctrl"));
const postPosts = new default_1.ApiRouter({
    name: '',
    method: 'post',
    summary: '게시글 추가',
    schema: 'requests/front/posts/PostPosts',
    tags: ['Posts'],
    responses: {
        201: { schema: 'responses/front/posts/PostPosts' },
        409: { description: 'already added' }
    },
    handler: ctrl.postPosts
});
exports.postPosts = postPosts;
const getPosts = new default_1.ApiRouter({
    name: '',
    method: 'get',
    summary: '게시글 목록 조회',
    schema: 'requests/front/posts/GetPosts',
    tags: ['Posts'],
    responses: {
        200: { schema: 'responses/front/posts/GetPosts' }
    },
    handler: ctrl.getPosts
});
exports.getPosts = getPosts;
const getPostsWithId = new default_1.ApiRouter({
    name: ':id',
    method: 'get',
    paths: ['common/IdPath'],
    summary: '게시글 상세 조회',
    tags: ['Posts'],
    responses: {
        200: { schema: 'responses/front/posts/GetPostsWithId' },
        404: { description: 'Not found' }
    },
    handler: ctrl.getPostsWithId
});
exports.getPostsWithId = getPostsWithId;
const putPostsWithId = new default_1.ApiRouter({
    name: ':id',
    method: 'put',
    paths: ['common/IdPath'],
    summary: '게시글 수정',
    schema: 'requests/front/posts/PutPosts',
    tags: ['Posts'],
    responses: {
        200: { schema: 'responses/front/posts/PutPostsWithId' },
        404: { description: 'Not found' }
    },
    handler: ctrl.putPostsWithId
});
exports.putPostsWithId = putPostsWithId;
const deletePostsWithId = new default_1.ApiRouter({
    name: ':id',
    method: 'delete',
    paths: ['common/IdPath'],
    summary: '게시글 삭제',
    tags: ['Posts'],
    responses: {
        204: { description: 'Success' },
        404: { description: 'Not found' }
    },
    handler: ctrl.deletePostsWithId
});
exports.deletePostsWithId = deletePostsWithId;

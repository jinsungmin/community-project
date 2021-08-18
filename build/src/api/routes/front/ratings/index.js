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
exports.deleteRatingsWithId = exports.getRatingsWithId = exports.getRatings = exports.postRatings = void 0;
const default_1 = require("../../default");
const ctrl = __importStar(require("./ratings-ctrl"));
const postRatings = new default_1.ApiRouter({
    name: '',
    method: 'post',
    summary: '레이팅 추가',
    schema: 'requests/front/ratings/PostRatings',
    tags: ['Ratings'],
    responses: {
        201: { schema: 'responses/front/ratings/PostRatings' },
        409: { description: 'already added' }
    },
    handler: ctrl.postRatings
});
exports.postRatings = postRatings;
const getRatings = new default_1.ApiRouter({
    name: '',
    method: 'get',
    summary: '레이팅 목록 조회',
    schema: 'requests/front/ratings/GetRatings',
    tags: ['Ratings'],
    responses: {
        200: { schema: 'responses/front/ratings/GetRatings' }
    },
    handler: ctrl.getRatings
});
exports.getRatings = getRatings;
const getRatingsWithId = new default_1.ApiRouter({
    name: ':id',
    method: 'get',
    paths: ['common/IdPath'],
    summary: '레이팅 상세 조회',
    tags: ['Ratings'],
    responses: {
        200: { schema: 'responses/front/posts/GetRatingsWithId' },
        404: { description: 'Not found' }
    },
    handler: ctrl.getRatingsWithId
});
exports.getRatingsWithId = getRatingsWithId;
const deleteRatingsWithId = new default_1.ApiRouter({
    name: ':id',
    method: 'delete',
    paths: ['common/IdPath'],
    summary: '레이팅 삭제',
    tags: ['Ratings'],
    responses: {
        204: { description: 'Success' },
        404: { description: 'Not found' }
    },
    handler: ctrl.deleteRatingsWithId
});
exports.deleteRatingsWithId = deleteRatingsWithId;

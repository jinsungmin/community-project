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
exports.getCategoriesWithId = exports.getCategories = void 0;
const default_1 = require("../../default");
const ctrl = __importStar(require("./categories-ctrl"));
const getCategories = new default_1.ApiRouter({
    name: '',
    method: 'get',
    summary: '카테고리 목록 조회',
    schema: 'requests/front/categories/GetCategories',
    tags: ['Categories'],
    responses: {
        200: { schema: 'responses/front/categories/GetCategories' }
    },
    handler: ctrl.getCategories
});
exports.getCategories = getCategories;
const getCategoriesWithId = new default_1.ApiRouter({
    name: ':id',
    method: 'get',
    paths: ['common/IdPath'],
    summary: '카테고리 상세 조회',
    tags: ['Categories'],
    responses: {
        200: { schema: 'responses/front/categories/GetCategoriesWithId' },
        404: { description: 'Not found' }
    },
    handler: ctrl.getCategoriesWithId
});
exports.getCategoriesWithId = getCategoriesWithId;

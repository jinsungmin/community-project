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
exports.putUsers = exports.getUsers = void 0;
const default_1 = require("../../default");
const ctrl = __importStar(require("./users-ctrl"));
const getUsers = new default_1.ApiRouter({
    name: '',
    method: 'get',
    summary: '유저 정보 조회',
    tags: ['Users'],
    responses: {
        200: { schema: 'responses/front/GetUsers' }
    },
    handler: ctrl.getUsers
});
exports.getUsers = getUsers;
const putUsers = new default_1.ApiRouter({
    name: '',
    method: 'put',
    summary: '유저 정보 수정',
    schema: 'requests/front/users/PutUsers',
    tags: ['Users'],
    responses: {
        200: { schema: 'common/IdPath' }
    },
    handler: ctrl.putUsers
});
exports.putUsers = putUsers;
const deleteUsers = new default_1.ApiRouter({
    name: '',
    method: 'delete',
    summary: '유저 탈퇴',
    tags: ['Users'],
    responses: {
        204: { description: 'Success!' }
    },
    handler: ctrl.deleteUsers
});

import {ApiRouter} from '../../default'
import * as ctrl from './comments-ctrl'

const postComments = new ApiRouter({
    name: '',
    method: 'post',
    summary: '댓글 추가',
    schema: 'requests/front/comments/PostComments',
    tags: ['Comments'],
    responses: {
        201: {schema: 'responses/front/comments/PostComments'},
        409: {description: 'already added'}
    },
    handler: ctrl.postComments
})

const getComments = new ApiRouter({
    name: '',
    method: 'get',
    summary: '댓글 목록 조회',
    schema: 'requests/front/comments/GetComments',
    tags: ['Comments'],
    responses: {
        200: {schema: 'responses/front/comments/GetComments'}
    },
    handler: ctrl.getComments
})

const getCommentsWithId = new ApiRouter({
    name: ':id',
    method: 'get',
    paths: ['common/IdPath'],
    summary: '댓글 상세 조회',
    tags: ['Comments'],
    responses: {
        200: {schema: 'responses/front/comments/GetCommentsWithId'},
        404: {description: 'Not found'}
    },
    handler: ctrl.getCommentsWithId
})

const putCommentsWithId = new ApiRouter({
    name: ':id',
    method: 'put',
    paths: ['common/IdPath'],
    summary: '댓글 수정',
    schema: 'requests/front/comments/PutComments',
    tags: ['Comments'],
    responses: {
        200: {schema: 'responses/front/comments/PutCommentsWithId'},
        404: {description: 'Not found'}
    },
    handler: ctrl.putCommentsWithId
})

const deleteCommentsWithId = new ApiRouter({
    name: ':id',
    method: 'delete',
    paths: ['common/IdPath'],
    summary: '댓글 삭제',
    tags: ['Comments'],
    responses: {
        204: {description: 'Success'},
        404: {description: 'Not found'}
    },
    handler: ctrl.deleteCommentsWithId
})

export {postComments, getComments, getCommentsWithId, putCommentsWithId, deleteCommentsWithId}

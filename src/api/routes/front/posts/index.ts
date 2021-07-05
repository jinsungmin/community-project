import {ApiRouter} from '../../default'
import * as ctrl from './posts-ctrl'

const postPosts = new ApiRouter({
    name: '',
    method: 'post',
    summary: '게시글 추가',
    schema: 'requests/front/posts/PostPosts',
    tags: ['Posts'],
    responses: {
        201: {schema: 'responses/front/posts/PostPosts'},
        409: {description: 'already added'}
    },
    handler: ctrl.postPosts
})

const getPosts = new ApiRouter({
    name: '',
    method: 'get',
    summary: '게시글 목록 조회',
    schema: 'requests/front/posts/GetPosts',
    tags: ['Posts'],
    responses: {
        200: {schema: 'responses/front/posts/GetPosts'}
    },
    handler: ctrl.getPosts
})

const getPostsWithId = new ApiRouter({
    name: ':id',
    method: 'get',
    paths: ['common/IdPath'],
    summary: '게시글 상세 조회',
    tags: ['Posts'],
    responses: {
        200: {schema: 'responses/front/posts/GetPostsWithId'},
        404: {description: 'Not found'}
    },
    handler: ctrl.getPostsWithId
})

const putPostsWithId = new ApiRouter({
    name: ':id',
    method: 'put',
    paths: ['common/IdPath'],
    summary: '게시글 수정',
    schema: 'requests/front/posts/PutPosts',
    tags: ['Posts'],
    responses: {
        200: {schema: 'responses/front/posts/PutPostsWithId'},
        404: {description: 'Not found'}
    },
    handler: ctrl.putPostsWithId
})

const deletePostsWithId = new ApiRouter({
    name: ':id',
    method: 'delete',
    paths: ['common/IdPath'],
    summary: '게시글 삭제',
    tags: ['Posts'],
    responses: {
        204: {description: 'Success'},
        404: {description: 'Not found'}
    },
    handler: ctrl.deletePostsWithId
})

export {postPosts, getPosts, getPostsWithId, putPostsWithId, deletePostsWithId}

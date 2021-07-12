import {ApiRouter} from '../../default'
import * as ctrl from './categories-ctrl'

const postCategories = new ApiRouter({
    name: '',
    method: 'post',
    summary: '카테고리 추가',
    schema: 'requests/admin/categories/PostCategories',
    tags: ['Categories'],
    responses: {
        201: {schema: 'responses/admin/categories/PostCategories'},
        409: {description: 'already added'}
    },
    handler: ctrl.postCategories
})

const getCategories = new ApiRouter({
    name: '',
    method: 'get',
    summary: '카테고리 목록 조회',
    schema: 'requests/admin/categories/GetCategories',
    tags: ['Categories'],
    responses: {
        200: {schema: 'responses/admin/categories/GetCategories'}
    },
    handler: ctrl.getCategories
})

const getCategoriesWithId = new ApiRouter({
    name: ':id',
    method: 'get',
    paths: ['common/IdPath'],
    summary: '카테고리 상세 조회',
    tags: ['Categories'],
    responses: {
        200: {schema: 'responses/admin/categories/GetCategoriesWithId'},
        404: {description: 'Not found'}
    },
    handler: ctrl.getCategoriesWithId
})

const putCategoriesWithId = new ApiRouter({
    name: ':id',
    method: 'put',
    paths: ['common/IdPath'],
    summary: '카테고리 수정',
    schema: 'requests/admin/categories/PutCategories',
    tags: ['Categories'],
    responses: {
        200: {schema: 'responses/admin/categories/PutCategoriesWithId'},
        404: {description: 'Not found'}
    },
    handler: ctrl.putCategoriesWithId
})

const deleteCategoriesWithId = new ApiRouter({
    name: ':id',
    method: 'delete',
    paths: ['common/IdPath'],
    summary: '카테고리 삭제',
    tags: ['Categories'],
    responses: {
        204: {description: 'Success'},
        404: {description: 'Not found'}
    },
    handler: ctrl.deleteCategoriesWithId
})

export {postCategories, getCategories, getCategoriesWithId, putCategoriesWithId, deleteCategoriesWithId}

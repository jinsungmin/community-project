import {ApiRouter} from '../../default'
import * as ctrl from './categories-ctrl'

const getCategories = new ApiRouter({
    name: '',
    method: 'get',
    summary: '카테고리 목록 조회',
    schema: 'requests/front/categories/GetCategories',
    tags: ['Categories'],
    responses: {
        200: {schema: 'responses/front/categories/GetCategories'}
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
        200: {schema: 'responses/front/categories/GetCategoriesWithId'},
        404: {description: 'Not found'}
    },
    handler: ctrl.getCategoriesWithId
})

export {getCategories, getCategoriesWithId}

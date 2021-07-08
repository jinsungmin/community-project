import {ApiRouter} from '../../default'
import * as ctrl from './ratings-ctrl'

const postRatings = new ApiRouter({
    name: '',
    method: 'post',
    summary: '레이팅 추가',
    schema: 'requests/front/ratings/PostRatings',
    tags: ['Ratings'],
    responses: {
        201: {schema: 'responses/front/ratings/PostRatings'},
        409: {description: 'already added'}
    },
    handler: ctrl.postRatings
})

const getRatings = new ApiRouter({
    name: '',
    method: 'get',
    summary: '레이팅 목록 조회',
    schema: 'requests/front/ratings/GetRatings',
    tags: ['Ratings'],
    responses: {
        200: {schema: 'responses/front/ratings/GetRatings'}
    },
    handler: ctrl.getRatings
})

const getRatingsWithId = new ApiRouter({
    name: ':id',
    method: 'get',
    paths: ['common/IdPath'],
    summary: '레이팅 상세 조회',
    tags: ['Ratings'],
    responses: {
        200: {schema: 'responses/front/posts/GetRatingsWithId'},
        404: {description: 'Not found'}
    },
    handler: ctrl.getRatingsWithId
})

const deleteRatingsWithId = new ApiRouter({
    name: ':id',
    method: 'delete',
    paths: ['common/IdPath'],
    summary: '레이팅 삭제',
    tags: ['Ratings'],
    responses: {
        204: {description: 'Success'},
        404: {description: 'Not found'}
    },
    handler: ctrl.deleteRatingsWithId
})

export {postRatings, getRatings, getRatingsWithId, deleteRatingsWithId}

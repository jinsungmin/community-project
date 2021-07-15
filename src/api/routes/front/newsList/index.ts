import {ApiRouter} from "../../default";
import * as ctrl from "./newsList-ctrl";

const getNewsList = new ApiRouter({
    name: '',
    method: 'get',
    summary: '뉴스 목록 조회',
    tags: ['NewsList'],
    isPublic: true,
    responses: {
        200: {schema: 'responses/front/newsList/GetNewsList'}
    },
    handler: ctrl.getNewsList
})

export {getNewsList}
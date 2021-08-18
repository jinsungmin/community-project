"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsList = void 0;
const services_1 = require("../../../../services");
async function getNewsList(req, res, next) {
    try {
        //console.log('test:', req.options)
        //const {search, sort, order, start, perPage, userId, postId, parentId} = req.options
        const ret = await services_1.NewsService.getNews(['LX세미콘', '텔레칩스']);
        res.status(200).json(ret);
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        next(e);
    }
}
exports.getNewsList = getNewsList;

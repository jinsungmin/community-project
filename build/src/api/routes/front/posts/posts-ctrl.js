"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostsWithId = exports.putPostsWithId = exports.getPostsWithId = exports.getPosts = exports.postPosts = void 0;
const services_1 = require("../../../../services");
async function postPosts(req, res, next) {
    try {
        const { userId, categoryId, title, content } = req.options;
        const ret = await services_1.PostService.create({ userId, categoryId, title, content });
        res.status(201).json(ret);
    }
    catch (e) {
        if (e.message === 'already_in_use')
            e.status = 409;
        next(e);
    }
}
exports.postPosts = postPosts;
async function getPosts(req, res, next) {
    try {
        const { search, sort, order, start, perPage, userId, categoryId } = req.options;
        const ret = await services_1.PostService.findAll({ search, sort, order, start, perPage, userId, categoryId });
        res.status(200).json(ret);
    }
    catch (e) {
        next(e);
    }
}
exports.getPosts = getPosts;
async function getPostsWithId(req, res, next) {
    try {
        const { id } = req.options;
        const patient = await services_1.PostService.findOne(id);
        res.status(200).json(patient);
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        next(e);
    }
}
exports.getPostsWithId = getPostsWithId;
async function putPostsWithId(req, res, next) {
    try {
        const { id, categoryId, title, content } = req.options;
        const post = await services_1.PostService.update({ id, categoryId, title, content });
        res.status(200).json(post);
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        if (e.message === 'cannot_edit_user')
            e.status = 409;
        next(e);
    }
}
exports.putPostsWithId = putPostsWithId;
async function deletePostsWithId(req, res, next) {
    try {
        await services_1.PostService.deleteOne({ id: req.options.id });
        res.status(204).send();
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        next(e);
    }
}
exports.deletePostsWithId = deletePostsWithId;

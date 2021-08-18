"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentsWithId = exports.putCommentsWithId = exports.getCommentsWithId = exports.getComments = exports.postComments = void 0;
const services_1 = require("../../../../services");
async function postComments(req, res, next) {
    try {
        const { userId, postId, parentId, content } = req.options;
        const ret = await services_1.CommentService.create({ userId, postId, parentId, content });
        res.status(201).json(ret);
    }
    catch (e) {
        if (e.message === 'already_in_use')
            e.status = 409;
        next(e);
    }
}
exports.postComments = postComments;
async function getComments(req, res, next) {
    try {
        console.log('test:', req.options);
        const { search, sort, order, start, perPage, userId, postId, parentId } = req.options;
        const ret = await services_1.CommentService.findAll({ search, sort, order, start, perPage, userId, postId, parentId });
        res.status(200).json(ret);
    }
    catch (e) {
        next(e);
    }
}
exports.getComments = getComments;
async function getCommentsWithId(req, res, next) {
    try {
        const { id } = req.options;
        const comment = await services_1.CommentService.findOne(id);
        res.status(200).json(comment);
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        next(e);
    }
}
exports.getCommentsWithId = getCommentsWithId;
async function putCommentsWithId(req, res, next) {
    try {
        const { id, content } = req.options;
        console.log(id, content);
        const post = await services_1.CommentService.update({ id, content });
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
exports.putCommentsWithId = putCommentsWithId;
async function deleteCommentsWithId(req, res, next) {
    try {
        await services_1.CommentService.deleteOne({ id: req.options.id });
        res.status(204).send();
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        next(e);
    }
}
exports.deleteCommentsWithId = deleteCommentsWithId;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRatingsWithId = exports.getRatingsWithId = exports.getRatings = exports.postRatings = void 0;
const services_1 = require("../../../../services");
async function postRatings(req, res, next) {
    try {
        const { userId, postId, commentId, type } = req.options;
        const ret = await services_1.RatingService.create({ userId, postId, commentId, type });
        res.status(201).json(ret);
    }
    catch (e) {
        if (e.message === 'already_in_use')
            e.status = 409;
        next(e);
    }
}
exports.postRatings = postRatings;
async function getRatings(req, res, next) {
    try {
        const { userId, postId, commentId, type } = req.options;
        const ret = await services_1.RatingService.findAll({ userId, postId, commentId, type });
        res.status(200).json(ret);
    }
    catch (e) {
        next(e);
    }
}
exports.getRatings = getRatings;
async function getRatingsWithId(req, res, next) {
    try {
        const { id } = req.options;
        const patient = await services_1.RatingService.findOne(id);
        res.status(200).json(patient);
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        next(e);
    }
}
exports.getRatingsWithId = getRatingsWithId;
async function deleteRatingsWithId(req, res, next) {
    try {
        await services_1.RatingService.deleteOne({ id: req.options.id });
        res.status(204).send();
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        next(e);
    }
}
exports.deleteRatingsWithId = deleteRatingsWithId;

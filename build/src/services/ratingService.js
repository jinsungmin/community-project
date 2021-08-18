"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.update = exports.findOne = exports.findAll = exports.create = void 0;
const loaders_1 = require("../loaders");
const models_1 = require("../models");
async function create(options) {
    try {
        const ret = await models_1.Rating.create(options);
        if (ret) {
            const { postId, type } = ret;
            await models_1.Post.updateRating(postId, type);
        }
        return ret;
    }
    catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
            throw new Error('already_in_use');
        }
        throw e;
    }
}
exports.create = create;
async function findAll(options) {
    try {
        return await models_1.Rating.findAll(options);
    }
    catch (e) {
        throw e;
    }
}
exports.findAll = findAll;
async function findOne(options) {
    try {
        const rating = await models_1.Rating.findOne(options);
        if (rating)
            return rating;
        throw new Error('not_found');
    }
    catch (e) {
        throw e;
    }
}
exports.findOne = findOne;
async function update(options) {
    const connection = await loaders_1.db.beginTransaction();
    try {
        const comment = await models_1.Rating.updateOne(options, connection);
        await loaders_1.db.commit(connection);
        if (comment)
            return comment;
        throw new Error('not_found');
    }
    catch (e) {
        if (connection)
            await loaders_1.db.rollback(connection);
        throw e;
    }
}
exports.update = update;
async function deleteOne(options) {
    try {
        const temp = await models_1.Rating.findOne({ id: options.id });
        const ret = await models_1.Rating.deleteOne(options.id);
        if (ret) {
            const { postId, type } = temp;
            await models_1.Post.updateRating(postId, !type);
        }
        if (!ret)
            throw new Error('not_found');
    }
    catch (e) {
        throw e;
    }
}
exports.deleteOne = deleteOne;

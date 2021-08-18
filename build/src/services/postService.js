"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.update = exports.findOne = exports.findAll = exports.create = void 0;
const loaders_1 = require("../loaders");
const models_1 = require("../models");
async function create(options) {
    try {
        return await models_1.Post.create(options);
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
        return await models_1.Post.findAll(options);
    }
    catch (e) {
        throw e;
    }
}
exports.findAll = findAll;
async function findOne(id) {
    try {
        const post = await models_1.Post.findOne({ id });
        if (post)
            return post;
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
        const post = await models_1.Post.updateOne(options, connection);
        await loaders_1.db.commit(connection);
        if (post)
            return post;
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
        const ret = await models_1.Post.deleteOne(options.id);
        if (!ret)
            throw new Error('not_found');
    }
    catch (e) {
        throw e;
    }
}
exports.deleteOne = deleteOne;

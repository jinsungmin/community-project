"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.update = exports.findOne = void 0;
const models_1 = require("../models");
const aws_1 = require("../loaders/aws");
async function findOne(options) {
    try {
        const { id, name, phone, email } = options;
        const user = await models_1.User.findOne({ id, name, phone, accountId: email });
        if (user)
            return user;
        throw new Error('not_found');
    }
    catch (e) {
        throw e;
    }
}
exports.findOne = findOne;
async function update(options) {
    try {
        if (options.profileUrl) {
            options.profileUrl = await aws_1.copyTempObject(options.profileUrl, `images/users/${options.id}`);
        }
        const user = await models_1.User.updateOne(options);
        if (user)
            return user;
        throw new Error('not_found');
    }
    catch (e) {
        throw e;
    }
}
exports.update = update;
async function deleteOne(id) {
    try {
        const ret = await models_1.User.deleteOne(id);
        if (!ret)
            throw new Error('not_found');
    }
    catch (e) {
        throw e;
    }
}
exports.deleteOne = deleteOne;

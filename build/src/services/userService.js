"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.update = exports.findOne = void 0;
const models_1 = require("../models");
async function findOne(options) {
    try {
        const { id, name, email } = options;
        const user = await models_1.User.findOne({ id, name, accountId: email });
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.update = exports.findOne = exports.findAll = exports.create = void 0;
const loaders_1 = require("../loaders");
const models_1 = require("../models");
const code_1 = require("../libs/code");
async function create(name, password) {
    try {
        const passwordHash = code_1.createPasswordHash(password, code_1.passwordIterations.admin);
        return await models_1.Administrator.create(Object.assign(Object.assign({ name }, passwordHash), { createdAt: new Date() }));
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
        return await models_1.Administrator.findAll(options);
    }
    catch (e) {
        throw e;
    }
}
exports.findAll = findAll;
async function findOne(id) {
    try {
        const admin = await models_1.Administrator.findOne(id);
        if (admin)
            return admin;
        throw new Error('not_found');
    }
    catch (e) {
        throw e;
    }
}
exports.findOne = findOne;
async function update(id, name, nickname, password) {
    const connection = await loaders_1.db.beginTransaction();
    try {
        if (password) {
            const passwordHash = code_1.createPasswordHash(password, code_1.passwordIterations.admin);
            await models_1.Administrator.updatePassword(Object.assign({ id }, passwordHash), connection);
        }
        const admin = await models_1.Administrator.updateOne({ id, name, nickname }, connection);
        await loaders_1.db.commit(connection);
        if (admin)
            return admin;
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
        const ret = await models_1.Administrator.deleteOne(options);
        if (!ret)
            throw new Error('not_found');
    }
    catch (e) {
        throw e;
    }
}
exports.deleteOne = deleteOne;

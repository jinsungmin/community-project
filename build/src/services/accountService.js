"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOne = void 0;
const models_1 = require("../models");
async function findOne(accountId) {
    try {
        const account = await models_1.Account.findOne({ accountId });
        if (account)
            return account;
        throw new Error('not_found');
    }
    catch (e) {
        throw e;
    }
}
exports.findOne = findOne;

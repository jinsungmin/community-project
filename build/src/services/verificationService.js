"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirm = exports.findOne = exports.create = void 0;
const models_1 = require("../models");
const jwt_1 = require("../libs/jwt");
async function create(options) {
    try {
        const { type, email } = options;
        if (type === 'reset') {
            const user = await models_1.User.findOne({ accountId: email });
            if (!user) {
                throw new Error('not_found');
            }
        }
        else {
            const user = await models_1.User.findOne({ accountId: email });
            if (user)
                throw new Error('already_in_use');
        }
        const { id, code } = await models_1.Verification.create(options);
        const exp = Math.floor(Date.now() / 1000) + 3 * 60;
        const expireAt = new Date(exp * 1000);
        const codeToken = await jwt_1.createToken({ sub: id.toString(), exp }, { algorithm: 'RS256' });
        const ret = { codeToken, expireAt };
        if (process.env.NODE_ENV !== 'production') {
            ret.code = code;
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
async function findOne(id, used = false) {
    try {
        const admin = await models_1.Verification.findOne({ id, used });
        if (admin)
            return admin;
        throw new Error('not_found');
    }
    catch (e) {
        throw e;
    }
}
exports.findOne = findOne;
async function confirm(code, codeToken) {
    try {
        const { sub: id } = await jwt_1.decodeToken(codeToken, { algorithms: ['RS256'] });
        const verification = await models_1.Verification.findOne({ id, used: false });
        if (verification) {
            const { code: savedCode } = verification;
            if (code === savedCode) {
                await models_1.Verification.update({ id, confirmed: true });
                const exp = Math.floor(Date.now() / 1000) + 30 * 60;
                return await jwt_1.createToken({ sub: id, exp }, { algorithm: 'RS256' });
            }
            throw new Error('wrong_code');
        }
        throw new Error('expired_token');
    }
    catch (e) {
        throw e;
    }
}
exports.confirm = confirm;

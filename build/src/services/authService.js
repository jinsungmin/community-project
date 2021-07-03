"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRefreshToken = exports.adminSignIn = exports.userRefreshToken = exports.userResetPassword = exports.userUpdatePassword = exports.userSignIn = exports.userSignUp = void 0;
const libs_1 = require("../libs");
const models_1 = require("../models");
const code_1 = require("../libs/code");
const jwt_1 = require("../libs/jwt");
const loaders_1 = require("../loaders");
async function userSignUp(options) {
    const connection = await loaders_1.db.beginTransaction();
    try {
        const { password, email, profileUrl, phoneToken } = options, data = __rest(options, ["password", "email", "profileUrl", "phoneToken"]);
        const verification = await models_1.Verification.findOne({
            phone: options.phone,
            type: 'register',
            confirmed: true,
            used: false
        });
        if (!verification)
            throw { status: 401, message: 'expired_token' };
        await jwt_1.decodeToken(phoneToken, { subject: verification.id.toString(), algorithms: ['RS256'] });
        await models_1.Verification.update({ id: verification.id, used: true }, connection);
        const user = await models_1.User.create(Object.assign({}, data), connection);
        const accountInfo = await models_1.Account.create({ userId: user.id, type: 'email', accountId: email, password }, connection);
        /*
        if (profileUrl) {
          user.profileUrl = await copyTempObject(options.profileUrl, `images/users/${user.id}`)
          await User.updateOne({id: user.id, profileUrl: user.profileUrl}, connection)
        } */
        await loaders_1.db.commit(connection);
        const accessToken = await libs_1.jwt.createAccessToken({ userId: user.id });
        const refreshToken = await libs_1.jwt.createRefreshToken({ userId: user.id }, accountInfo.salt);
        return { user: Object.assign(Object.assign({}, user), { email }), accessToken, refreshToken };
    }
    catch (e) {
        if (connection)
            await loaders_1.db.rollback(connection);
        throw e;
    }
}
exports.userSignUp = userSignUp;
async function userSignIn(email, password) {
    try {
        const account = await models_1.Account.findOne({ type: 'email', accountId: email });
        if (account &&
            libs_1.code.verifyPassword(password, account.accountInfo.password, account.accountInfo.salt, code_1.passwordIterations.user)) {
            const accessToken = await libs_1.jwt.createAccessToken({ userId: account.userId });
            const refreshToken = await libs_1.jwt.createRefreshToken({ userId: account.userId }, account.accountInfo.salt);
            return { accessToken, refreshToken };
        }
        throw new Error('not_found');
    }
    catch (e) {
        throw e;
    }
}
exports.userSignIn = userSignIn;
async function userUpdatePassword(id, password, newPassword) {
    try {
        const account = await models_1.Account.findOne({ userId: id, type: 'email' });
        if (account &&
            libs_1.code.verifyPassword(password, account.accountInfo.password, account.accountInfo.salt, code_1.passwordIterations.user)) {
            await models_1.Account.updatePassword({
                userId: id,
                password: newPassword
            });
            const accessToken = await libs_1.jwt.createAccessToken({ userId: account.userId });
            const refreshToken = await libs_1.jwt.createRefreshToken({ userId: account.userId }, account.accountInfo.salt);
            return { accessToken, refreshToken };
        }
        throw new Error('not_found');
    }
    catch (e) {
        throw e;
    }
}
exports.userUpdatePassword = userUpdatePassword;
async function userResetPassword(phone, password, phoneToken) {
    const connection = await loaders_1.db.beginTransaction();
    try {
        const verification = await models_1.Verification.findOne({
            phone,
            type: 'reset',
            confirmed: true,
            used: false
        });
        if (!verification)
            throw { status: 401, message: 'expired_token' };
        await libs_1.jwt.decodeToken(phoneToken, { subject: verification.id.toString(), algorithms: ['RS256'] });
        await models_1.Verification.update({ id: verification.id, used: true }, connection);
        const user = await models_1.User.findOne({ phone });
        if (user) {
            await models_1.Account.updatePassword({ userId: user.id, password });
            await loaders_1.db.commit(connection);
        }
        else {
            throw new Error('not_found');
        }
    }
    catch (e) {
        if (connection)
            await loaders_1.db.rollback(connection);
        throw e;
    }
}
exports.userResetPassword = userResetPassword;
async function userRefreshToken(accessToken, refreshToken) {
    try {
        const payload = await libs_1.jwt.decodeToken(accessToken, { algorithms: ['RS256'], ignoreExpiration: true });
        const { accountInfo: { salt: refreshHash } } = await models_1.Account.findOne({ userId: payload.sub });
        await libs_1.jwt.decodeToken(refreshToken, { algorithms: ['HS256'] }, refreshHash);
        delete payload.iat;
        delete payload.exp;
        delete payload.nbf;
        delete payload.jti;
        return await libs_1.jwt.createAccessToken({ userId: payload.sub });
    }
    catch (e) {
        throw e;
    }
}
exports.userRefreshToken = userRefreshToken;
async function adminSignIn(options) {
    try {
        const admin = await models_1.Administrator.findOneSecret(null, options.name);
        if (admin && libs_1.code.verifyPassword(options.password, admin.password, admin.salt, code_1.passwordIterations.admin)) {
            const accessToken = await libs_1.jwt.createAdminAccessToken({
                id: admin.id,
                role: admin.role
            });
            const refreshToken = await libs_1.jwt.createAdminRefreshToken({ id: admin.id, role: admin.role }, admin.salt);
            return { accessToken, refreshToken, admin };
        }
        throw new Error('not_found');
    }
    catch (e) {
        throw e;
    }
}
exports.adminSignIn = adminSignIn;
async function adminRefreshToken({ accessToken, refreshToken }) {
    try {
        const payload = await libs_1.jwt.decodeAdminToken(accessToken, { algorithms: ['RS256'], ignoreExpiration: true });
        const { salt: refreshHash } = await models_1.Administrator.findOneSecret(payload.sub);
        await libs_1.jwt.decodeAdminToken(refreshToken, { algorithms: ['HS256'] }, refreshHash);
        delete payload.iat;
        delete payload.exp;
        delete payload.nbf;
        delete payload.jti;
        return await libs_1.jwt.createAdminAccessToken({ id: payload.sub, role: payload.role });
    }
    catch (e) {
        throw e;
    }
}
exports.adminRefreshToken = adminRefreshToken;

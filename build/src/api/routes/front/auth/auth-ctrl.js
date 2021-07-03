"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAuthRefresh = exports.postAuthReset = exports.getAuthRegisterName = exports.getAuthRegisterEmail = exports.postAuthRegister = exports.putAuth = exports.postAuth = void 0;
const services_1 = require("../../../../services");
async function postAuth(req, res, next) {
    try {
        const { email, password } = req.options;
        const { accessToken, refreshToken } = await services_1.AuthService.userSignIn(email, password);
        const user = await services_1.UserService.findOne({ email });
        res.status(200).json({ accessToken, refreshToken, user: user });
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        next(e);
    }
}
exports.postAuth = postAuth;
async function putAuth(req, res, next) {
    try {
        const { password, newPassword } = req.options;
        const { accessToken, refreshToken } = await services_1.AuthService.userUpdatePassword(req.user.id, password, newPassword);
        if (password === newPassword) {
            throw new Error('same_password');
        }
        res.status(200).json({ accessToken, refreshToken });
    }
    catch (e) {
        if (e.message === 'same_password')
            e.status = 409;
        next(e);
    }
}
exports.putAuth = putAuth;
async function postAuthRegister(req, res, next) {
    try {
        const { email, name, phone, phoneToken, profileUrl, password } = req.options;
        const ret = await services_1.AuthService.userSignUp({ email, name, phone, phoneToken, profileUrl, password });
        res.status(201).json(ret);
    }
    catch (e) {
        if (e.message === 'expired_token')
            e.status = 401;
        if (e.message === 'not_found_verification_code')
            e.status = 404;
        else if (e.message === 'already_in_use')
            e.status = 409;
        next(e);
    }
}
exports.postAuthRegister = postAuthRegister;
async function getAuthRegisterEmail(req, res, next) {
    try {
        const { email } = req.options;
        await services_1.AccountService.findOne(email);
        throw new Error('already_added');
    }
    catch (e) {
        if (e.message === 'not_found') {
            res.status(200).json();
            return;
        }
        if (e.message === 'already_added')
            e.status = 409;
        next(e);
    }
}
exports.getAuthRegisterEmail = getAuthRegisterEmail;
async function getAuthRegisterName(req, res, next) {
    try {
        const { name } = req.options;
        await services_1.UserService.findOne({ name });
        throw new Error('already_added');
    }
    catch (e) {
        if (e.message === 'not_found') {
            res.status(200).json();
            return;
        }
        if (e.message === 'already_added')
            e.status = 409;
        next(e);
    }
}
exports.getAuthRegisterName = getAuthRegisterName;
async function postAuthReset(req, res, next) {
    try {
        const { phone, password, phoneToken } = req.options;
        await services_1.AuthService.userResetPassword(phone, password, phoneToken);
        res.status(204).send();
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        next(e);
    }
}
exports.postAuthReset = postAuthReset;
async function postAuthRefresh(req, res, next) {
    try {
        const { accessToken, refreshToken } = req.options;
        const newAccessToken = await services_1.AuthService.userRefreshToken(accessToken, refreshToken);
        res.status(201).json({ accessToken: newAccessToken });
    }
    catch (e) {
        if (e.message === 'invalid_token')
            e.status = 401;
        next(e);
    }
}
exports.postAuthRefresh = postAuthRefresh;

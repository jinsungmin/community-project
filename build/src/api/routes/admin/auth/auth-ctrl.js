"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRefresh = exports.postAuth = void 0;
const services_1 = require("../../../../services");
async function postAuth(req, res, next) {
    try {
        const { name, password, remember = false } = req.options;
        const { accessToken, refreshToken, admin } = await services_1.AuthService.adminSignIn({
            name,
            password
        });
        res.status(200).json({
            accessToken,
            refreshToken,
            role: admin.role
        });
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        next(e);
    }
}
exports.postAuth = postAuth;
async function postRefresh(req, res, next) {
    try {
        const { accessToken, refreshToken } = req.options;
        const result = await services_1.AuthService.adminRefreshToken({
            accessToken,
            refreshToken
        });
        res.status(201).json({ accessToken: result });
    }
    catch (e) {
        if (e.message === 'invalid_token')
            e.status = 401;
        next(e);
    }
}
exports.postRefresh = postRefresh;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postVerificationsConfirm = exports.postVerifications = void 0;
const services_1 = require("../../../../services");
async function postVerifications(req, res, next) {
    try {
        const { type, email } = req.options;
        const ret = await services_1.VerificationService.create({ email, type });
        res.status(201).json(ret);
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        else if (e.message === 'already_in_use')
            e.status = 409;
        next(e);
    }
}
exports.postVerifications = postVerifications;
async function postVerificationsConfirm(req, res, next) {
    try {
        const { code, codeToken } = req.options;
        const emailToken = await services_1.VerificationService.confirm(code, codeToken);
        res.status(200).json({ emailToken });
    }
    catch (e) {
        if (e.message === 'expired_token')
            e.status = 401;
        else if (e.message === 'wrong_code')
            e.status = 409;
        next(e);
    }
}
exports.postVerificationsConfirm = postVerificationsConfirm;

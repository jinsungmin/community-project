"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.user = void 0;
const libs_1 = require("../../libs");
const models_1 = require("../../models");
function user(verifyToken) {
    return async function (req, res, next) {
        try {
            const { authorization } = req.headers;
            if (authorization && authorization.split(' ')[0] === 'Bearer') {
                const jwtToken = await libs_1.jwt.decodeToken(authorization.split(' ')[1], { algorithms: ['RS256'] });
                if (jwtToken.sub) {
                    req.user = await models_1.User.findOne({ id: jwtToken.sub });
                    next();
                }
            }
            else {
                if (!verifyToken)
                    res.status(401).json({ message: 'invalid_token' });
                else
                    next();
            }
        }
        catch (e) {
            if (e.message === 'forbidden')
                res.status(403).json({ message: 'forbidden' });
            else
                res.status(401).json({ message: 'invalid_token' });
        }
    };
}
exports.user = user;
async function admin(req, res, next) {
    try {
        const { authorization } = req.headers;
        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            const jwtToken = await libs_1.jwt.decodeAdminToken(authorization.split(' ')[1], { algorithms: ['RS256'] });
            if (jwtToken.sub) {
                req.id = jwtToken.sub;
                req.role = jwtToken.role;
                return next();
            }
        }
        res.status(401).json({ message: 'invalid_token' });
    }
    catch (e) {
        res.status(401).json({ message: 'invalid_token' });
    }
}
exports.admin = admin;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsers = exports.putUsers = exports.getUsers = void 0;
const services_1 = require("../../../../services");
async function getUsers(req, res, next) {
    try {
        const user = await services_1.UserService.findOne({ id: req.user.id });
        res.status(200).json(user);
    }
    catch (e) {
        next(e);
    }
}
exports.getUsers = getUsers;
async function putUsers(req, res, next) {
    try {
        const user = await services_1.UserService.update(Object.assign({ id: req.user.id }, req.options));
        res.status(200).json(user);
    }
    catch (e) {
        next(e);
    }
}
exports.putUsers = putUsers;
async function deleteUsers(req, res, next) {
    try {
        await services_1.UserService.deleteOne(req.user.id);
        res.status(204).send();
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        next(e);
    }
}
exports.deleteUsers = deleteUsers;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdminsWithId = exports.putAdminsWithId = exports.getAdminsWithId = exports.getAdmins = exports.postAdmins = void 0;
const services_1 = require("../../../../services");
async function postAdmins(req, res, next) {
    try {
        const { name, password } = req.options;
        const ret = await services_1.AdministratorService.create(name, password);
        res.status(201).json(ret);
    }
    catch (e) {
        if (e.message === 'already_in_use')
            e.status = 409;
        next(e);
    }
}
exports.postAdmins = postAdmins;
async function getAdmins(req, res, next) {
    try {
        const { search, sort, order, start, perPage } = req.options;
        const ret = await services_1.AdministratorService.findAll({ search, sort, order, start, perPage });
        res.status(200).json(ret);
    }
    catch (e) {
        next(e);
    }
}
exports.getAdmins = getAdmins;
async function getAdminsWithId(req, res, next) {
    try {
        const admin = await services_1.AdministratorService.findOne(req.options.id);
        res.status(200).json(admin);
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        next(e);
    }
}
exports.getAdminsWithId = getAdminsWithId;
async function putAdminsWithId(req, res, next) {
    try {
        const { id, name, nickname, password } = req.options;
        const admin = await services_1.AdministratorService.update(id, name, nickname, password);
        res.status(200).json(admin);
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        if (e.message === 'cannot_edit_user')
            e.status = 409;
        next(e);
    }
}
exports.putAdminsWithId = putAdminsWithId;
async function deleteAdminsWithId(req, res, next) {
    try {
        if (req.user.id !== req.options.id) {
            await services_1.AdministratorService.deleteOne({ id: req.options.id });
            res.status(204).send();
        }
        else {
            throw new Error('cannot_delete_master');
        }
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        if (e.message === 'cannot_delete_master')
            e.status = 409;
        if (e.message === 'cannot_edit_user')
            e.status = 409;
        next(e);
    }
}
exports.deleteAdminsWithId = deleteAdminsWithId;

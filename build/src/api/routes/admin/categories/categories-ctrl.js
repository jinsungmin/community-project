"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoriesWithId = exports.putCategoriesWithId = exports.getCategoriesWithId = exports.getCategories = exports.postCategories = void 0;
const services_1 = require("../../../../services");
async function postCategories(req, res, next) {
    try {
        const { name } = req.options;
        const ret = await services_1.CategoryService.create({ name });
        res.status(201).json(ret);
    }
    catch (e) {
        if (e.message === 'already_in_use')
            e.status = 409;
        next(e);
    }
}
exports.postCategories = postCategories;
async function getCategories(req, res, next) {
    try {
        const { search, sort, order } = req.options;
        const ret = await services_1.CategoryService.findAll({ search, sort, order });
        res.status(200).json(ret);
    }
    catch (e) {
        next(e);
    }
}
exports.getCategories = getCategories;
async function getCategoriesWithId(req, res, next) {
    try {
        const { id } = req.options;
        const category = await services_1.CategoryService.findOne(id);
        res.status(200).json(category);
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        next(e);
    }
}
exports.getCategoriesWithId = getCategoriesWithId;
async function putCategoriesWithId(req, res, next) {
    try {
        const { id, name } = req.options;
        const category = await services_1.CategoryService.update({ id, name });
        res.status(200).json(category);
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        if (e.message === 'cannot_edit_user')
            e.status = 409;
        next(e);
    }
}
exports.putCategoriesWithId = putCategoriesWithId;
async function deleteCategoriesWithId(req, res, next) {
    try {
        await services_1.CategoryService.deleteOne({ id: req.options.id });
        res.status(204).send();
    }
    catch (e) {
        if (e.message === 'not_found')
            e.status = 404;
        next(e);
    }
}
exports.deleteCategoriesWithId = deleteCategoriesWithId;

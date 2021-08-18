"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesWithId = exports.getCategories = void 0;
const services_1 = require("../../../../services");
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

import {Response} from 'express'
import {CategoryService} from '../../../../services'

async function postCategories(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        const {name} = req.options
        const ret = await CategoryService.create({name})
        res.status(201).json(ret)
    } catch (e) {
        if (e.message === 'already_in_use') e.status = 409
        next(e)
    }
}

async function getCategories(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        const {search, sort, order} = req.options
        const ret = await CategoryService.findAll({search, sort, order})
        res.status(200).json(ret)
    } catch (e) {
        next(e)
    }
}

async function getCategoriesWithId(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        const {id} = req.options
        const category = await CategoryService.findOne(id)
        res.status(200).json(category)
    } catch (e) {
        if (e.message === 'not_found') e.status = 404
        next(e)
    }
}

async function putCategoriesWithId(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        const {id, name} = req.options
        const category = await CategoryService.update({id, name})
        res.status(200).json(category)
    } catch (e) {
        if (e.message === 'not_found') e.status = 404
        if (e.message === 'cannot_edit_user') e.status = 409
        next(e)
    }
}

async function deleteCategoriesWithId(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        await CategoryService.deleteOne({id: req.options.id})
        res.status(204).send()
    } catch (e) {
        if (e.message === 'not_found') e.status = 404
        next(e)
    }
}

export {postCategories, getCategories, getCategoriesWithId, putCategoriesWithId, deleteCategoriesWithId}

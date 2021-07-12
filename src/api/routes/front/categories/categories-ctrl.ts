import {Response} from 'express'
import {CategoryService} from '../../../../services'

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

export {getCategories, getCategoriesWithId}

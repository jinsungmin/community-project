import {Response} from 'express'
import {PostService} from '../../../../services'

async function postPosts(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        const {userId, title, content} = req.options
        const ret = await PostService.create({userId, title, content})
        res.status(201).json(ret)
    } catch (e) {
        if (e.message === 'already_in_use') e.status = 409
        next(e)
    }
}

async function getPosts(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        const {search, sort, order, start, perPage, userId} = req.options
        const ret = await PostService.findAll({search, sort, order, start, perPage, userId})
        res.status(200).json(ret)
    } catch (e) {
        next(e)
    }
}

async function getPostsWithId(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        const {id} = req.options
        const patient = await PostService.findOne(id)
        res.status(200).json(patient)
    } catch (e) {
        if (e.message === 'not_found') e.status = 404
        next(e)
    }
}

async function putPostsWithId(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        const {id, title, content} = req.options
        const post = await PostService.update({id, title, content})
        res.status(200).json(post)
    } catch (e) {
        if (e.message === 'not_found') e.status = 404
        if (e.message === 'cannot_edit_user') e.status = 409
        next(e)
    }
}

async function deletePostsWithId(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        await PostService.deleteOne({id: req.options.id})
        res.status(204).send()
    } catch (e) {
        if (e.message === 'not_found') e.status = 404
        next(e)
    }
}

export {postPosts, getPosts, getPostsWithId, putPostsWithId, deletePostsWithId}

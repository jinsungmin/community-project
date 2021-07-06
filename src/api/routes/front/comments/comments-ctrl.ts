import {Response} from 'express'
import {CommentService} from '../../../../services'

async function postComments(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        const {userId, postId, parentId, content} = req.options
        const ret = await CommentService.create({userId, postId, parentId, content})
        res.status(201).json(ret)
    } catch (e) {
        if (e.message === 'already_in_use') e.status = 409
        next(e)
    }
}

async function getComments(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        const {search, sort, order, start, perPage, userId, postId, parentId} = req.options
        const ret = await CommentService.findAll({search, sort, order, start, perPage, userId, postId, parentId})
        res.status(200).json(ret)
    } catch (e) {
        next(e)
    }
}

async function getCommentsWithId(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        const {id} = req.options
        const comment = await CommentService.findOne(id)
        res.status(200).json(comment)
    } catch (e) {
        if (e.message === 'not_found') e.status = 404
        next(e)
    }
}

async function putCommentsWithId(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        const {id, content} = req.options
        const post = await CommentService.update({id, content})
        res.status(200).json(post)
    } catch (e) {
        if (e.message === 'not_found') e.status = 404
        if (e.message === 'cannot_edit_user') e.status = 409
        next(e)
    }
}

async function deleteCommentsWithId(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        await CommentService.deleteOne({id: req.options.id})
        res.status(204).send()
    } catch (e) {
        if (e.message === 'not_found') e.status = 404
        next(e)
    }
}

export {postComments, getComments, getCommentsWithId, putCommentsWithId, deleteCommentsWithId}

import {Response} from 'express'
import {RatingService} from '../../../../services'

async function postRatings(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        const {userId, postId, commentId, type} = req.options
        const ret = await RatingService.create({userId, postId, commentId, type})
        res.status(201).json(ret)
    } catch (e) {
        if (e.message === 'already_in_use') e.status = 409
        next(e)
    }
}

async function getRatings(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        const {userId, postId, commentId, type} = req.options
        const ret = await RatingService.findAll({userId, postId, commentId, type})
        res.status(200).json(ret)
    } catch (e) {
        next(e)
    }
}

async function getRatingsWithId(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        const {id} = req.options
        const patient = await RatingService.findOne(id)
        res.status(200).json(patient)
    } catch (e) {
        if (e.message === 'not_found') e.status = 404
        next(e)
    }
}

async function deleteRatingsWithId(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        await RatingService.deleteOne({id: req.options.id})
        res.status(204).send()
    } catch (e) {
        if (e.message === 'not_found') e.status = 404
        next(e)
    }
}

export {postRatings, getRatings, getRatingsWithId, deleteRatingsWithId}

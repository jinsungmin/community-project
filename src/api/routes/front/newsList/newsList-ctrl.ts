import {Response} from 'express'
import {NewsService} from '../../../../services'

async function getNewsList(req: IRequest, res: Response, next: Function): Promise<void> {
    try {
        //console.log('test:', req.options)
        //const {search, sort, order, start, perPage, userId, postId, parentId} = req.options
        const ret = await NewsService.getNews(['실리콘웍스', '텔레칩스'])
        res.status(200).json(ret)
    } catch (e) {
        if (e.message === 'not_found') e.status = 404
        next(e)
    }
}

export {getNewsList}

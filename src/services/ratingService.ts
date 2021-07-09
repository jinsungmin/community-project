import {db} from '../loaders'
import {Rating, Post} from '../models'
import {
    IRating,
    IRatingCreate,
    IRatingFindAll,
    IRatingFindOne,
    IRatingDelete,
    IRatingList,
    IRatingUpdate
} from '../interfaces/rating'

async function create(options: IRatingCreate): Promise<IRating> {
    try {
        const ret: any = await Rating.create(options)
        if (ret) {
            const {postId, type} = ret
            await Post.updateRating(postId, type)
        }
        return ret
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
            throw new Error('already_in_use')
        }
        throw e
    }
}

async function findAll(options: IRatingFindAll): Promise<IRatingList> {
    try {
        return await Rating.findAll(options)
    } catch (e) {
        throw e
    }
}

async function findOne(options: IRatingFindOne): Promise<IRating> {
    try {
        const rating = await Rating.findOne(options)
        if (rating) return rating
        throw new Error('not_found')
    } catch (e) {
        throw e
    }
}

async function update(options: IRatingUpdate): Promise<IRatingUpdate> {
    const connection = await db.beginTransaction()
    try {
        const comment = await Rating.updateOne(options, connection)
        await db.commit(connection)
        if (comment) return comment
        throw new Error('not_found')
    } catch (e) {
        if (connection) await db.rollback(connection)
        throw e
    }
}

async function deleteOne(options: IRatingDelete): Promise<void> {
    try {
        const temp: any = await Rating.findOne({id:options.id})
        const ret: any = await Rating.deleteOne(options.id)
        if (ret) {
            const {postId, type} = temp
            await Post.updateRating(postId, !type)
        }
        if (!ret) throw new Error('not_found')
    } catch (e) {
        throw e
    }
}

export {create, findAll, findOne, update, deleteOne}

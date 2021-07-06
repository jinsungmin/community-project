import {db} from '../loaders'
import {Comment} from '../models'
import {
    IComment,
    ICommentCreate,
    ICommentFindAll,
    ICommentDelete,
    ICommentList,
    ICommentUpdate
} from '../interfaces/comment'

async function create(options: ICommentCreate): Promise<IComment> {
    try {
        return await Comment.create(options)
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
            throw new Error('already_in_use')
        }
        throw e
    }
}

async function findAll(options: ICommentFindAll): Promise<ICommentList> {
    try {
        return await Comment.findAll(options)
    } catch (e) {
        throw e
    }
}

async function findOne(id: number): Promise<IComment> {
    try {
        const comment = await Comment.findOne({id})
        if (comment) return comment
        throw new Error('not_found')
    } catch (e) {
        throw e
    }
}

async function update(options: ICommentUpdate): Promise<ICommentUpdate> {
    const connection = await db.beginTransaction()
    try {
        const comment = await Comment.updateOne(options, connection)
        await db.commit(connection)
        if (comment) return comment
        throw new Error('not_found')
    } catch (e) {
        if (connection) await db.rollback(connection)
        throw e
    }
}

async function deleteOne(options: ICommentDelete): Promise<void> {
    try {
        const ret = await Comment.deleteOne(options.id)
        if (!ret) throw new Error('not_found')
    } catch (e) {
        throw e
    }
}

export {create, findAll, findOne, update, deleteOne}

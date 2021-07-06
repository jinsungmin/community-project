import {db} from '../loaders'
import {Post} from '../models'
import {
    IPost,
    IPostCreate,
    IPostFindAll,
    IPostDelete,
    IPostList,
    IPostUpdate
} from '../interfaces/post'

async function create(options: IPostCreate): Promise<IPost> {
    try {
        return await Post.create(options)
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
            throw new Error('already_in_use')
        }
        throw e
    }
}

async function findAll(options: IPostFindAll): Promise<IPostList> {
    try {
        return await Post.findAll(options)
    } catch (e) {
        throw e
    }
}

async function findOne(id: number): Promise<IPost> {
    try {
        const post = await Post.findOne({id})
        if (post) return post
        throw new Error('not_found')
    } catch (e) {
        throw e
    }
}

async function update(options: IPostUpdate): Promise<IPostUpdate> {
    const connection = await db.beginTransaction()
    try {
        const post = await Post.updateOne(options, connection)
        await db.commit(connection)
        if (post) return post
        throw new Error('not_found')
    } catch (e) {
        if (connection) await db.rollback(connection)
        throw e
    }
}

async function deleteOne(options: IPostDelete): Promise<void> {
    try {
        const ret = await Post.deleteOne(options.id)
        if (!ret) throw new Error('not_found')
    } catch (e) {
        throw e
    }
}

export {create, findAll, findOne, update, deleteOne}

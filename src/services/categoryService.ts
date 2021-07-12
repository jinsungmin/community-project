import {db} from '../loaders'
import {Category} from '../models'
import {
    ICategory,
    ICategoryCreate,
    ICategoryFindAll,
    ICategoryDelete,
    ICategoryList,
    ICategoryUpdate
} from '../interfaces/category'

async function create(options: ICategoryCreate): Promise<ICategory> {
    try {
        return await Category.create(options)
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
            throw new Error('already_in_use')
        }
        throw e
    }
}

async function findAll(options: ICategoryFindAll): Promise<ICategoryList> {
    try {
        return await Category.findAll(options)
    } catch (e) {
        throw e
    }
}

async function findOne(id: number): Promise<ICategory> {
    try {
        const category = await Category.findOne({id})
        if (category) return category
        throw new Error('not_found')
    } catch (e) {
        throw e
    }
}

async function update(options: ICategoryUpdate): Promise<ICategoryUpdate> {
    const connection = await db.beginTransaction()
    try {
        const category = await Category.updateOne(options, connection)
        await db.commit(connection)
        if (category) return category
        throw new Error('not_found')
    } catch (e) {
        if (connection) await db.rollback(connection)
        throw e
    }
}

async function deleteOne(options: ICategoryDelete): Promise<void> {
    try {
        const ret = await Category.deleteOne(options.id)
        if (!ret) throw new Error('not_found')
    } catch (e) {
        throw e
    }
}

export {create, findAll, findOne, update, deleteOne}

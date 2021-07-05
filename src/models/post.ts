import {PoolConnection} from 'mysql'
import {db} from '../loaders'
import {IPost, IPostCreate, IPostFindAll, IPostList, IPostUpdate} from '../interfaces/post'

const tableName = 'Posts'

async function create(options: IPostCreate, connection?: PoolConnection): Promise<IPost> {
    try {
        const {userId, title, content, createdAt = new Date(), updatedAt = new Date()} = options

        const {insertId} = await db.query({
            connection,
            sql: `INSERT INTO ?? SET ?`,
            values: [
                tableName,
                {
                    userId,
                    title,
                    content,
                    createdAt,
                    updatedAt
                }
            ]
        })
        return {id: insertId, userId, title, content, createdAt, updatedAt}
    } catch (e) {
        throw e
    }
}

async function findAll(options: IPostFindAll): Promise<IPostList> {
    try {
        const {search, sort, order, start, perPage} = options
        const where = []
        if (search) where.push(`(p.title like '%${search}%' OR p.content like '%${search}%')`)

        const rows: IPost[] = await db.query({
            sql: `SELECT p.* FROM ?? p
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ${sort && order ? `ORDER BY p.${sort} ${order}` : ``}
      LIMIT ${start}, ${perPage}`,
            values: [tableName]
        })
        const [rowTotal] = await db.query({
            sql: `SELECT COUNT(1) as total FROM ?? p
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}`,
            values: [tableName]
        })
        return {data: rows, total: rowTotal ? rowTotal.total : 0}
    } catch (e) {
        throw e
    }
}


async function findOne(options: { id?: number }): Promise<IPost> {
    try {
        const {id} = options

        const where = []
        if (id) where.push(`p.id = ${id}`)

        const [row] = await db.query({
            sql: `SELECT p.*
      FROM ?? p
      WHERE ${where.join(' AND ')}
      GROUP BY p.id`,
            values: [tableName]
        })
        return row
    } catch (e) {
        throw e
    }
}

async function updateOne(options: IPostUpdate, connection?: PoolConnection): Promise<IPostUpdate> {
    const {id, ...data} = options
    try {
        const {affectedRows} = await db.query({
            connection,
            sql: `UPDATE ?? SET ? WHERE ? `,
            values: [tableName, data, {id}]
        })
        if (affectedRows > 0) return options
    } catch (e) {
        throw e
    }
}

async function deleteOne(id: number, connection?: PoolConnection): Promise<number> {
    try {
        const {affectedRows} = await db.query({
            connection,
            sql: `DELETE FROM ?? WHERE ? `,
            values: [tableName, {id}]
        })
        if (affectedRows > 0) return id
    } catch (e) {
        throw e
    }
}

export {tableName, create, findAll, findOne, updateOne, deleteOne}

import {PoolConnection} from 'mysql'
import {db} from '../loaders'
import {IRating, IRatingCreate, IRatingFindAll, IRatingList, IRatingUpdate} from '../interfaces/rating'
import {generateRandomCode} from '../libs/code'

const tableName = 'Ratings'

async function create(options: IRatingCreate, connection?: PoolConnection): Promise<IRating> {
    try {
        const {id = generateRandomCode(8), userId, postId, commentId, type} = options
        await db.query({
            connection,
            sql: `INSERT INTO ?? SET ?`,
            values: [
                tableName,
                {id, userId, postId, commentId, type}
            ]
        })
        return {id, userId, postId, commentId, type}
    } catch (e) {
        throw e
    }
}

async function findAll(options: IRatingFindAll): Promise<IRatingList> {
    try {
        const {userId, postId, type, commentId} = options
        const where = []
        if (postId) where.push(`(r.postId = ${postId})`)
        if (commentId) where.push(`(r.commentId = ${commentId})`)
        if (type) where.push(`(r.type = ${type})`)
        if (userId) where.push(`(r.userId = ${userId})`)

        const rows: IRating[] = await db.query({
            sql: `SELECT r.* FROM ?? r
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      `,
            values: [tableName]
        })
        const [rowTotal] = await db.query({
            sql: `SELECT COUNT(1) as total FROM ?? r
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}`,
            values: [tableName]
        })
        return {data: rows, total: rowTotal ? rowTotal.total : 0}
    } catch (e) {
        throw e
    }
}


async function findOne(options: { id?: number }): Promise<IRating> {
    try {
        const {id} = options

        const where = []
        if (id) where.push(`r.id = ${id}`)

        const [row] = await db.query({
            sql: `SELECT r.*
      FROM ?? r
      WHERE ${where.join(' AND ')}
      GROUP BY r.id`,
            values: [tableName]
        })
        return row
    } catch (e) {
        throw e
    }
}

async function updateOne(options: IRatingUpdate, connection?: PoolConnection): Promise<IRatingUpdate> {
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

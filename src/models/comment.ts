import {PoolConnection} from 'mysql'
import {db} from '../loaders'
import {IComment, ICommentCreate, ICommentFindAll, ICommentList, ICommentUpdate} from '../interfaces/comment'
import {generateRandomCode} from '../libs/code'
import {User} from "./index";

const tableName = 'Comments'

async function create(options: ICommentCreate, connection?: PoolConnection): Promise<IComment> {
    try {
        const {id = generateRandomCode(8), userId, postId, parentId, content, createdAt = new Date(), updatedAt = new Date()} = options
        await db.query({
            connection,
            sql: `INSERT INTO ?? SET ?`,
            values: [
                tableName,
                {id, userId, postId, parentId, content, createdAt, updatedAt}
            ]
        })
        return {id, userId, postId, parentId, content, createdAt, updatedAt}
    } catch (e) {
        throw e
    }
}

async function findAll(options: ICommentFindAll): Promise<ICommentList> {
    try {
        const {search, userId, postId, parentId, sort, order, start, perPage} = options
        const where = []
        if (search) where.push(`(c.content like '%${search}%')`)
        if (postId) where.push(`(c.postId = ${postId})`)
        if (userId) where.push(`(c.userId = ${userId})`)
        if (parentId) where.push(`(c.parentId = ${parentId})`)
        else where.push(`(c.parentId is null)`)

        const rows: IComment[] = await db.query({
            sql: `SELECT c.*, u.name as userName FROM ?? c JOIN ?? u on u.id = c.userId
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ${sort && order ? `ORDER BY c.${sort} ${order}` : ``}
      LIMIT ${start}, ${perPage}`,
            values: [tableName, User.tableName]
        })
        const [rowTotal] = await db.query({
            sql: `SELECT COUNT(1) as total FROM ?? c
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}`,
            values: [tableName]
        })
        console.log(rows)
        return {data: rows, total: rowTotal ? rowTotal.total : 0}
    } catch (e) {
        throw e
    }
}


async function findOne(options: { id?: number }): Promise<IComment> {
    try {
        const {id} = options

        const where = []
        if (id) where.push(`c.id = ${id}`)

        const [row] = await db.query({
            sql: `SELECT c.*
      FROM ?? c
      WHERE ${where.join(' AND ')}
      GROUP BY c.id`,
            values: [tableName]
        })
        return row
    } catch (e) {
        throw e
    }
}

async function updateOne(options: ICommentUpdate, connection?: PoolConnection): Promise<ICommentUpdate> {
    const {id, ...data} = options
    data.updatedAt = new Date()
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
        const parentId = id
        const {affectedRows} = await db.query({
            connection,
            sql: `DELETE FROM ?? as c WHERE ? or ? `,
            values: [tableName, {id}, {parentId}]
        })
        if (affectedRows > 0) return id
    } catch (e) {
        throw e
    }
}

export {tableName, create, findAll, findOne, updateOne, deleteOne}

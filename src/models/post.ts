import {PoolConnection} from 'mysql'
import {db} from '../loaders'
import {IPost, IPostCreate, IPostFindAll, IPostList, IPostUpdate} from '../interfaces/post'
import {generateRandomCode} from "../libs/code";
import {User} from './index'

const tableName = 'Posts'
const tableRating = 'Ratings'

async function create(options: IPostCreate, connection?: PoolConnection): Promise<IPost> {
    try {
        const {id = generateRandomCode(8), userId, title, content, createdAt = new Date(), updatedAt = new Date()} = options
        await db.query({
            connection,
            sql: `INSERT INTO ?? SET ?`,
            values: [
                tableName,
                {id, userId, title, content, createdAt, updatedAt}
            ]
        })
        return {id, userId, title, content, ratings: 0, createdAt, updatedAt}
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
            sql: `SELECT p.*, u.name as userName
                  FROM ?? p
                  JOIN ?? u on u.id = p.userId
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ${sort && order ? `ORDER BY p.${sort} ${order}` : ``}
      LIMIT ${start}, ${perPage}`,
            values: [tableName, User.tableName]
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
            sql: `SELECT p.*, (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', r.id, 'userId', r.userId, 'type', r.type)) 
                  FROM ?? as r WHERE r.postId = ${id}) as ratingList
      FROM ?? p
      WHERE ${where.join(' AND ')}
      GROUP BY p.id`,
            values: [tableRating, tableName]
        })
        return row
    } catch (e) {
        throw e
    }
}

async function updateOne(options: IPostUpdate, connection?: PoolConnection): Promise<IPostUpdate> {
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

async function updateRating(id:number, type: string, connection?: PoolConnection): Promise<IPostUpdate> {
    try {
        const {affectedRows} = await db.query({
            connection,
            sql: `UPDATE ?? as p SET p.ratings = p.ratings + ${type === 'up' ? 1 : -1}  WHERE ? `,
            values: [tableName, {id}]
        })
        if (affectedRows > 0) return {id}
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

export {tableName, create, findAll, findOne, updateOne, updateRating, deleteOne}

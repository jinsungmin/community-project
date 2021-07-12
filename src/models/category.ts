import {PoolConnection} from 'mysql'
import {db} from '../loaders'
import {ICategory, ICategoryCreate, ICategoryFindAll, ICategoryList, ICategoryUpdate} from '../interfaces/category'
import {generateRandomCode} from '../libs/code'

const tableName = 'Categories'

async function create(options: ICategoryCreate, connection?: PoolConnection): Promise<ICategory> {
    try {
        const {id = generateRandomCode(8), name} = options
        await db.query({
            connection,
            sql: `INSERT INTO ?? SET ?`,
            values: [tableName, {id, name}]
        })
        return {id, name}
    } catch (e) {
        throw e
    }
}

async function findAll(options: ICategoryFindAll): Promise<ICategoryList> {
    try {
        const {search, sort, order} = options
        const where = []
        if (search) where.push(`(c.name like '%${search}%' OR c.name like '%${search}%')`)

        const rows: ICategory[] = await db.query({
            sql: `SELECT c.* FROM ?? c
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
       ${sort && order ? `ORDER BY c.${sort} ${order}` : ``}
      `,
            values: [tableName]
        })
        const [rowTotal] = await db.query({
            sql: `SELECT COUNT(1) as total FROM ?? c
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}`,
            values: [tableName]
        })
        return {data: rows, total: rowTotal ? rowTotal.total : 0}
    } catch (e) {
        throw e
    }
}

async function findOne(options: { id?: number }): Promise<ICategory> {
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

async function updateOne(options: ICategoryUpdate, connection?: PoolConnection): Promise<ICategoryUpdate> {
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

import {PoolConnection} from 'mysql'
import {db} from '../loaders'
import {
  IAdministrator,
  IAdministratorCreate,
  IAdministratorDelete,
  IAdministratorFindAll,
  IAdministratorList,
  IAdministratorSecret,
  IAdministratorUpdate,
  IAdministratorUpdatePassword
} from '../interfaces/administrator'

const tableName = 'Administrators'

async function create(options: IAdministratorCreate, connection?: PoolConnection): Promise<IAdministrator> {
  try {
    const {name, salt, password, createdAt} = options

    const {insertId} = await db.query({
      connection,
      sql: `INSERT INTO ?? SET ?`,
      values: [
        tableName,
        {
          name,
          password,
          salt,
          createdAt
        }
      ]
    })
    return {id: insertId, name, createdAt}
  } catch (e) {
    throw e
  }
}

async function findAll(options: IAdministratorFindAll): Promise<IAdministratorList> {
  try {
    const {search, sort = 'id', order = 'DESC', start, perPage} = options
    const where = []
    if (search) where.push(`(t.name like '%${search}%' OR t.nickname like '%${search}%')`)

    const rows: IAdministrator[] = await db.query({
      sql: `SELECT t.id, t.name, t.createdAt, t.updatedAt FROM ?? t
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY t.${sort} ${order}
      LIMIT ${start}, ${perPage}`,
      values: [tableName]
    })
    const [rowTotal] = await db.query({
      sql: `SELECT COUNT(1) as total FROM ?? t
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}`,
      values: [tableName]
    })
    return {data: rows, total: rowTotal ? rowTotal.total : 0}
  } catch (e) {
    throw e
  }
}

async function findOne(id: number): Promise<IAdministrator> {
  try {
    const [row] = await db.query({
      sql: `SELECT t.id, t.name, t.createdAt, t.updatedAt
      FROM ?? t
      WHERE ?`,
      values: [tableName, {id}]
    })
    return row
  } catch (e) {
    throw e
  }
}

async function findOneSecret(id?: number, name?: string): Promise<IAdministratorSecret> {
  try {
    const options: any = {}
    if (id) options.id = id
    if (name) options.name = name

    const [row] = await db.query({
      sql: `SELECT * FROM ?? WHERE ?`,
      values: [tableName, options]
    })
    return row
  } catch (e) {
    throw e
  }
}

async function updatePassword(options: IAdministratorUpdatePassword, connection?: PoolConnection): Promise<void> {
  try {
    const {id, password, salt} = options
    await db.query({
      connection,
      sql: `UPDATE ?? SET ? WHERE ?`,
      values: [
        tableName,
        {
          password,
          salt
        },
        {id}
      ]
    })
  } catch (e) {
    throw e
  }
}

async function updateOne(options: IAdministratorUpdate, connection?: PoolConnection): Promise<IAdministratorUpdate> {
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

async function deleteOne(options: IAdministratorDelete, connection?: PoolConnection): Promise<IAdministratorDelete> {
  const {id} = options
  try {
    const {affectedRows} = await db.query({
      connection,
      sql: `DELETE FROM ?? WHERE ? `,
      values: [tableName, {id}]
    })
    if (affectedRows > 0) return options
  } catch (e) {
    throw e
  }
}

export {tableName, create, findAll, findOne, findOneSecret, updatePassword, updateOne, deleteOne}

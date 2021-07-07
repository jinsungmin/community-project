import {PoolConnection} from 'mysql'
import {db} from '../loaders'
import {IUser, IUserCreate, IUserFindAll, IUserList, IUserUpdate, IUserUpdatePassword} from '../interfaces/user'
import {Account} from './index'

const tableName = 'Users'

async function create(options: IUserCreate, connection?: PoolConnection): Promise<IUser> {
  try {
    const {name, email, profileUrl, createdAt = new Date()} = options

    const {insertId} = await db.query({
      connection,
      sql: `INSERT INTO ?? SET ?`,
      values: [
        tableName,
        {
          name,
          email,
          profileUrl,
          createdAt
        }
      ]
    })
    return {id: insertId, name, email, profileUrl, createdAt}
  } catch (e) {
    throw e
  }
}

async function findOne(options: {id?: number, name?: string, accountId?: string}): Promise<IUser> {
  try {
    const {id, name, accountId} = options

    const where = []
    if (id) where.push(`u.id = ${id}`)
    if (name) where.push(`u.name = '${name}'`)
    if (accountId) where.push(`a.accountId = '${accountId}'`)

    const [row] = await db.query({
      sql: `SELECT u.*, a.accountId as email
      FROM ?? u
        JOIN ?? a ON a.userId = u.id
      WHERE ${where.join(' AND ')}
      GROUP BY u.id`,
      values: [tableName, Account.tableName]
    })
    return row
  } catch (e) {
    throw e
  }
}

async function updatePassword(options: IUserUpdatePassword, connection?: PoolConnection): Promise<void> {
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

async function updateOne(options: IUserUpdate, connection?: PoolConnection): Promise<IUserUpdate> {
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

export {tableName, create, findOne, updatePassword, updateOne, deleteOne}

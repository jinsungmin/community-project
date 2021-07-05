import {PoolConnection} from 'mysql'
import {IAccount, IAccountCreate, IAccountUpdate} from '../interfaces/account'
import {db} from '../loaders'
import {createPasswordHash, generateRandomHash, passwordIterations} from '../libs/code'

const tableName = 'Accounts'

async function create(
  options: IAccountCreate & {password?: string},
  connection?: PoolConnection
): Promise<{accountInfo?: Dictionary}> {
  try {
    const {userId, type, accountId, password} = options
    let accountInfo = null
    let insertType
    if (type === 'email') {
      if (!password) throw new Error('password_is_required')
      insertType = type
      const passwordHash = await createPasswordHash(password, passwordIterations.user)
      accountInfo = JSON.stringify({
        password: passwordHash.password,
        salt: passwordHash.salt
      })
    } else {
      insertType = `${type.charAt(0)}_${accountId}`
      const refreshHash = generateRandomHash(64)
      accountInfo = {refreshHash}
    }
    await db.query({
      connection,
      sql: `INSERT INTO ?? SET ?`,
      values: [
        tableName,
        {
          userId,
          type: insertType,
          accountId,
          accountInfo
        }
      ]
    })
    return accountInfo
  } catch (e) {
    throw e
  }
}

async function findOne(options: {type?: string; userId?: number; accountId?: string}): Promise<IAccount> {
  try {
    const {type, userId, accountId} = options

    const where = []
    if (userId) where.push(`userId = ${userId}`)
    if (type) where.push(`type = '${type}'`)
    if (accountId) where.push(`accountId = '${accountId}'`)

    const [row] = await db.query({
      sql: `SELECT * FROM ?? WHERE ${where.join(' AND ')}`,
      values: [tableName]
    })
    return row
  } catch (e) {
    throw e
  }
}

async function updateOne(options: IAccountUpdate, connection?: PoolConnection) {
  const {type, userId, accountInfo} = options
  try {
    await db.query({
        connection,
        sql: `UPDATE ?? SET ? WHERE ? AND ?`,
        values: [
          tableName,
          {
            accountInfo: accountInfo ? JSON.stringify(options.accountInfo) : null
          },
          {userId},
          {type}
        ]
      }
    )
  } catch (e) {
    throw e
  }
}

async function updatePassword(
  options: {userId: number; password: string},
  connection?: PoolConnection
): Promise<string> {
  try {
    const {password, userId} = options
    const passwordHash = await createPasswordHash(password, passwordIterations.user)
    await db.query({
      connection,
      sql: `UPDATE ?? SET ? WHERE ? AND ?`,
      values: [
        tableName,
        {
          accountInfo: JSON.stringify({
            password: passwordHash.password,
            salt: passwordHash.salt
          })
        },
        {userId},
        {type: 'email'}
      ]
    })
    return passwordHash.salt
  } catch (e) {
    throw e
  }
}

export {tableName, create, findOne, updateOne, updatePassword}

import {PoolConnection} from 'mysql'
import {IVerification, IVerificationCreate, IVerificationUpdate} from '../interfaces/verification'
import {db} from '../loaders'
import {createPasswordHash, generateRandomCode, passwordIterations} from '../libs/code'

const tableName = 'Verifications'

async function create(options: IVerificationCreate, connection?: PoolConnection): Promise<IVerification> {
  const {email, type} = options
  try {
    const code = generateRandomCode(6)
    const {insertId} = await db.query({
      connection,
      sql: `INSERT INTO ?? SET ?
        ON DUPLICATE KEY UPDATE code = VALUES(code), confirmed = false, used = false, createdAt = NOW()`,
      values: [tableName, {email, code, type}]
    })
    return {id: insertId, email, code: code.toString(), type, confirmed: false, used: false}
  } catch (e) {
    throw e
  }
}

async function findOne({
  id,
  type,
  email,
  confirmed,
  used
}: {
  id?: number
  type?: string
  email?: string
  confirmed?: boolean
  used?: boolean
}): Promise<IVerification> {
  try {
    const where = []
    if (type) where.push(`type = '${type}'`)
    if (id) where.push(`id = ${id}`)
    if (email) where.push(`email = '${email}'`)
    if (confirmed) where.push(`confirmed = ${confirmed}`)
    if (typeof used !== 'undefined') where.push(`used = ${used}`)
    const [row] = await db.query({
      sql: `SELECT * FROM ?? WHERE ${where.join(' AND ')}`,
      values: [tableName]
    })
    return row
  } catch (e) {
    throw e
  }
}

async function update(options: IVerificationUpdate, connection?: PoolConnection) {
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

export {tableName, create, findOne, update}

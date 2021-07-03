import {db} from '../loaders'
import {Administrator} from '../models'
import {
  IAdministrator,
  IAdministratorDelete,
  IAdministratorFindAll,
  IAdministratorList,
  IAdministratorUpdate
} from '../interfaces/administrator'
import {createPasswordHash, passwordIterations} from '../libs/code'

async function create(name: string, password: string): Promise<IAdministrator> {
  try {
    const passwordHash = createPasswordHash(password, passwordIterations.admin)
    return await Administrator.create({name, ...passwordHash, createdAt: new Date()})
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      throw new Error('already_in_use')
    }
    throw e
  }
}

async function findAll(options: IAdministratorFindAll): Promise<IAdministratorList> {
  try {
    return await Administrator.findAll(options)
  } catch (e) {
    throw e
  }
}

async function findOne(id: number): Promise<IAdministrator> {
  try {
    const admin = await Administrator.findOne(id)
    if (admin) return admin
    throw new Error('not_found')
  } catch (e) {
    throw e
  }
}

async function update(id: number, name: string, nickname: string, password?: string): Promise<IAdministratorUpdate> {
  const connection = await db.beginTransaction()
  try {
    if (password) {
      const passwordHash = createPasswordHash(password, passwordIterations.admin)
      await Administrator.updatePassword({id, ...passwordHash}, connection)
    }
    const admin = await Administrator.updateOne({id, name, nickname}, connection)
    await db.commit(connection)
    if (admin) return admin
    throw new Error('not_found')
  } catch (e) {
    if (connection) await db.rollback(connection)
    throw e
  }
}

async function deleteOne(options: IAdministratorDelete): Promise<void> {
  try {
    const ret = await Administrator.deleteOne(options)
    if (!ret) throw new Error('not_found')
  } catch (e) {
    throw e
  }
}

export {create, findAll, findOne, update, deleteOne}

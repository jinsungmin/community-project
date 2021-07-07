import {User} from '../models'
import {IUser, IUserUpdate} from '../interfaces/user'
import {createPasswordHash, passwordIterations} from '../libs/code'

async function findOne(options: {id?: number; name?: string; email?: string; phone?: string}): Promise<IUser> {
  try {
    const {id, name, email} = options
    const user = await User.findOne({id, name, accountId: email})
    if (user) return user
    throw new Error('not_found')
  } catch (e) {
    throw e
  }
}

async function update(options: IUserUpdate): Promise<IUserUpdate> {
  try {
    const user = await User.updateOne(options)
    if (user) return user
    throw new Error('not_found')
  } catch (e) {
    throw e
  }
}

async function deleteOne(id: number): Promise<void> {
  try {
    const ret = await User.deleteOne(id)
    if (!ret) throw new Error('not_found')
  } catch (e) {
    throw e
  }
}

export {findOne, update, deleteOne}

import {User} from '../models'
import {IUser, IUserUpdate} from '../interfaces/user'
import {createPasswordHash, passwordIterations} from '../libs/code'
import {copyTempObject} from '../loaders/aws'

async function findOne(options: {id?: number; name?: string; email?: string; phone?: string}): Promise<IUser> {
  try {
    const {id, name, phone, email} = options
    const user = await User.findOne({id, name, phone, accountId: email})
    if (user) return user
    throw new Error('not_found')
  } catch (e) {
    throw e
  }
}

async function update(options: IUserUpdate): Promise<IUserUpdate> {
  try {
    /*
    if (options.profileUrl) {
      options.profileUrl = await copyTempObject(options.profileUrl, `images/users/${options.id}`)
    } */
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

import {Account} from '../models'
import {IAccount} from '../interfaces/account'

async function findOne(accountId: string): Promise<IAccount> {
  try {
    const account = await Account.findOne({accountId})
    if (account) return account
    throw new Error('not_found')
  } catch (e) {
    throw e
  }
}

export {findOne}

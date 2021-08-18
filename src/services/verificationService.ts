import {User, Verification, Account} from '../models'
import {IVerification, IVerificationCreate} from '../interfaces/verification'
import {createToken, decodeToken} from '../libs/jwt'
import {mailer} from '../loaders'
import {sendVerifyEmail} from "../loaders/mailer";

async function create(options: IVerificationCreate): Promise<Dictionary> {
  try {
    const {type, email} = options
    if (type === 'reset') {
      const user = await User.findOne({accountId: email})
      if (!user) {
        throw new Error('not_found')
      }
    } else {
      const user = await User.findOne({accountId: email})
      if (user) throw new Error('already_in_use')
    }
    const {id, code} = await Verification.create(options)
    const exp = Math.floor(Date.now() / 1000) + 3 * 60
    const expireAt = new Date(exp * 1000)
    const codeToken = await createToken({sub: id.toString(), exp}, {algorithm: 'RS256'})
    const ret: Dictionary = {codeToken, expireAt}
    if (process.env.NODE_ENV !== 'production') {
      ret.code = code
    }
    return ret
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      throw new Error('already_in_use')
    }
    throw e
  }
}

async function findOne(id: number, used = false): Promise<IVerification> {
  try {
    const admin = await Verification.findOne({id, used})
    if (admin) return admin
    throw new Error('not_found')
  } catch (e) {
    throw e
  }
}

async function confirm(code: string, codeToken: string): Promise<string> {
  try {
    const {sub: id} = await decodeToken(codeToken, {algorithms: ['RS256']})
    const verification = await Verification.findOne({id, used: false})
    if (verification) {
      const {code: savedCode} = verification
      if (code === savedCode) {
        await Verification.update({id, confirmed: true})
        const exp = Math.floor(Date.now() / 1000) + 30 * 60
        return await createToken({sub: id, exp}, {algorithm: 'RS256'})
      }
      throw new Error('wrong_code')
    }
    throw new Error('expired_token')
  } catch (e) {
    throw e
  }
}

async function createEmail(options: IVerificationCreate): Promise<any> {
  try {
    const {type, email} = options
    if (type === 'reset') {
      const account = await Account.findOne({accountId: email})
      const user = await User.findOne({id: account.userId})
      if (!user) throw new Error('not_found')
    }
    if (type === 'register') {
      const verification = await Verification.findOne({type, email})
      if (verification && verification.confirmed && verification.used) {
        throw new Error('already_in_use')
      }
    }
    const {id, code} = await Verification.create(options)
    const exp = Math.floor(Date.now() / 1000) + 3 * 60
    const expireAt = new Date(exp * 1000)
    const codeToken = await createToken({sub: id.toString(), exp}, {algorithm: 'RS256'})
    const ret: any = {email, code, codeToken, expireAt}

    await sendVerifyEmail(email, code)  // 인증 코드 발송
    /*
    if (process.env.NODE_ENV !== 'production') {
      ret.code = code
    } */
    return ret
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      throw new Error('already_in_use')
    }
    throw e
  }
}

export {create, findOne, confirm, createEmail}

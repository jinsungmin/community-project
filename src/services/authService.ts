import {code as Code, jwt as JWT} from '../libs'
import {Account, Administrator, User, Verification} from '../models'
import {passwordIterations} from '../libs/code'
import {decodeToken} from '../libs/jwt'
import {IUser} from '../interfaces/user'
import {db} from '../loaders'

async function userSignUp(options: {
  email: string
  name: string
  password: string
  phone: string
  phoneToken: string
  profileUrl?: string
}): Promise<{accessToken: string; refreshToken: string; user: IUser & {email: string}}> {
  const connection = await db.beginTransaction()
  try {
    const {password, email, profileUrl, phoneToken, ...data} = options

    const verification = await Verification.findOne({
      phone: options.phone,
      type: 'register',
      confirmed: true,
      used: false
    })
    if (!verification) throw {status: 401, message: 'expired_token'}
    await decodeToken(phoneToken, {subject: verification.id.toString(), algorithms: ['RS256']})
    await Verification.update({id: verification.id, used: true}, connection)

    const user = await User.create({...data}, connection)
    const accountInfo: Dictionary = await Account.create(
      {userId: user.id, type: 'email', accountId: email, password},
      connection
    )
    /*
    if (profileUrl) {
      user.profileUrl = await copyTempObject(options.profileUrl, `images/users/${user.id}`)
      await User.updateOne({id: user.id, profileUrl: user.profileUrl}, connection)
    } */
    await db.commit(connection)
    const accessToken = await JWT.createAccessToken({userId: user.id})
    const refreshToken = await JWT.createRefreshToken({userId: user.id}, accountInfo.salt)
    return {user: {...user, email}, accessToken, refreshToken}
  } catch (e) {
    if (connection) await db.rollback(connection)
    throw e
  }
}

async function userSignIn(email: string, password: string): Promise<{accessToken: string; refreshToken: string}> {
  try {
    const account = await Account.findOne({type: 'email', accountId: email})
    const accountObj = JSON.parse(account.accountInfo.toString())
    if (
      account &&
      Code.verifyPassword(password, accountObj.password, accountObj.salt, passwordIterations.user)
    ) {
      const accessToken = await JWT.createAccessToken({userId: account.userId})
      const refreshToken = await JWT.createRefreshToken({userId: account.userId}, account.accountInfo.salt)
      return {accessToken, refreshToken}
    }
    throw new Error('not_found')
  } catch (e) {
    throw e
  }
}

async function userUpdatePassword(
  id: number,
  password: string,
  newPassword: string
): Promise<{accessToken: string; refreshToken: string}> {
  try {
    const account = await Account.findOne({userId: id, type: 'email'})
    if (
      account &&
      Code.verifyPassword(password, account.accountInfo.password, account.accountInfo.salt, passwordIterations.user)
    ) {
      await Account.updatePassword({
        userId: id,
        password: newPassword
      })
      const accessToken = await JWT.createAccessToken({userId: account.userId})
      const refreshToken = await JWT.createRefreshToken({userId: account.userId}, account.accountInfo.salt)
      return {accessToken, refreshToken}
    }
    throw new Error('not_found')
  } catch (e) {
    throw e
  }
}

async function userResetPassword(phone: string, password: string, phoneToken: string): Promise<void> {
  const connection = await db.beginTransaction()
  try {
    const verification = await Verification.findOne({
      phone,
      type: 'reset',
      confirmed: true,
      used: false
    })
    if (!verification) throw {status: 401, message: 'expired_token'}

    await JWT.decodeToken(phoneToken, {subject: verification.id.toString(), algorithms: ['RS256']})
    await Verification.update({id: verification.id, used: true}, connection)

    const user = await User.findOne({phone})
    if (user) {
      await Account.updatePassword({userId: user.id, password})
      await db.commit(connection)
    } else {
      throw new Error('not_found')
    }
  } catch (e) {
    if (connection) await db.rollback(connection)
    throw e
  }
}

async function userRefreshToken(accessToken: string, refreshToken: string): Promise<string> {
  try {
    const payload = await JWT.decodeToken(accessToken, {algorithms: ['RS256'], ignoreExpiration: true})
    const {
      accountInfo: {salt: refreshHash}
    } = await Account.findOne({userId: payload.sub})
    await JWT.decodeToken(refreshToken, {algorithms: ['HS256']}, refreshHash)
    delete payload.iat
    delete payload.exp
    delete payload.nbf
    delete payload.jti
    return await JWT.createAccessToken({userId: payload.sub})
  } catch (e) {
    throw e
  }
}

async function adminSignIn(options: {name: string; password: string;}): Promise<Dictionary> {
  try {
    const admin: any = await Administrator.findOneSecret(null, options.name)
    if (admin && Code.verifyPassword(options.password, admin.password, admin.salt, passwordIterations.admin)) {
      const accessToken = await JWT.createAdminAccessToken({
        id: admin.id,
        role: admin.role
      })
      const refreshToken = await JWT.createAdminRefreshToken({id: admin.id, role: admin.role}, admin.salt)
      return {accessToken, refreshToken, admin}
    }
    throw new Error('not_found')
  } catch (e) {
    throw e
  }
}

async function adminRefreshToken({accessToken, refreshToken}) {
  try {
    const payload = await JWT.decodeAdminToken(accessToken, {algorithms: ['RS256'], ignoreExpiration: true})
    const {salt: refreshHash} = await Administrator.findOneSecret(payload.sub)
    await JWT.decodeAdminToken(refreshToken, {algorithms: ['HS256']}, refreshHash)
    delete payload.iat
    delete payload.exp
    delete payload.nbf
    delete payload.jti
    return await JWT.createAdminAccessToken({id: payload.sub, role: payload.role})
  } catch (e) {
    throw e
  }
}

export {userSignUp, userSignIn, userUpdatePassword, userResetPassword, userRefreshToken, adminSignIn, adminRefreshToken}

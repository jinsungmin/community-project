import jwt, {Secret, SignOptions, VerifyOptions} from 'jsonwebtoken'
import fs from 'fs'

const privateKey = fs.readFileSync(`${__dirname}/private.pem`)
const publicKey = fs.readFileSync(`${__dirname}/public.pem`)

interface IUserPayload {
  userId: number
}

interface IAdminPayload {
  id: number,
  role: string
}

async function createToken(payload: Dictionary, options: SignOptions, secret: Secret = privateKey): Promise<string> {
  try {
    return await jwt.sign(payload, secret, options)
  } catch (e) {
    throw e
  }
}

async function decodeToken(token: string, options: VerifyOptions, secret: Secret = publicKey): Promise<any> {
  try {
    return await jwt.verify(token, secret, options)
  } catch (e) {
    throw new Error('invalid_token')
  }
}

async function createAccessToken(data: IUserPayload): Promise<string> {
  try {
    const {userId} = data
    const payload: Dictionary = {sub: userId}
    return await createToken(payload, {
      algorithm: 'RS256',
      expiresIn: 60 * 60 * 2
    })
  } catch (e) {
    throw e
  }
}

async function createRefreshToken(data: IUserPayload, tokenSecret: Secret): Promise<string> {
  try {
    const payload = {
      sub: data.userId
    }
    return await createToken(payload, {algorithm: 'HS256'}, tokenSecret)
  } catch (e) {
    throw e
  }
}

async function createAdminToken(payload: Dictionary, options: SignOptions, secret: Secret = privateKey): Promise<string> {
  try {
    return await jwt.sign(payload, secret, options)
  } catch (e) {
    throw e
  }
}

async function decodeAdminToken(token: string, options: VerifyOptions, secret: Secret = publicKey): Promise<any> {
  try {
    return await jwt.verify(token, secret, options)
  } catch (e) {
    throw new Error('invalid_token')
  }
}

async function createAdminAccessToken(data: IAdminPayload): Promise<string> {
  try {
    const {id, role} = data
    const payload = {sub: id, role}
    return await createAdminToken(payload, {
      algorithm: 'RS256',
      expiresIn: 60 * 60
    })
  } catch (err) {
    throw err
  }
}

async function createAdminRefreshToken(data: IAdminPayload, tokenSecret: Secret): Promise<string> {
  try {
    const {id, ...rest} = data
    const payload = {
      sub: id,
      ...rest
    }
    return await createAdminToken(
      payload,
      {
        algorithm: 'HS256',
        expiresIn: 60 * 60 * 24
      },
      tokenSecret
    )
  } catch (e) {
    throw e
  }
}

export {
  createToken,
  decodeToken,
  createAccessToken,
  createRefreshToken,
  createAdminToken,
  decodeAdminToken,
  createAdminAccessToken,
  createAdminRefreshToken
}

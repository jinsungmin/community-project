import {Response} from 'express'
import {AccountService, AuthService, UserService} from '../../../../services'

async function postAuth(req: IRequest, res: Response, next: Function): Promise<void> {
  try {
    const {email, password} = req.options
    const {accessToken, refreshToken} = await AuthService.userSignIn(email, password)
    const user = await UserService.findOne({email})
    res.status(200).json({accessToken, refreshToken, user})
  } catch (e) {
    if (e.message === 'not_found') e.status = 404
    next(e)
  }
}

async function getAuth(req: IRequest, res: Response, next: Function): Promise<void> {
  try {
    const user = await UserService.findOne({id: req.user.id})
    res.status(200).json({user})
  } catch (e) {
    if (e.message === 'not_found') e.status = 404
    next(e)
  }
}

async function putAuth(req: IRequest, res: Response, next: Function): Promise<void> {
  try {
    const {password, newPassword} = req.options
    const {accessToken, refreshToken} = await AuthService.userUpdatePassword(req.user.id, password, newPassword)
    if (password === newPassword) {
      throw new Error('same_password')
    }
    res.status(200).json({accessToken, refreshToken})
  } catch (e) {
    if (e.message === 'same_password') e.status = 409
    next(e)
  }
}

async function postAuthRegister(req: IRequest, res: Response, next: Function): Promise<void> {
  try {
    const {email, name, phone, phoneToken, profileUrl, password} = req.options
    const ret = await AuthService.userSignUp({email, name, phone, phoneToken, profileUrl, password})
    res.status(201).json(ret)
  } catch (e) {
    if (e.message === 'expired_token') e.status = 401
    if (e.message === 'not_found_verification_code') e.status = 404
    else if (e.message === 'already_in_use') e.status = 409
    next(e)
  }
}

async function getAuthRegisterEmail(req: IRequest, res: Response, next: Function): Promise<void> {
  try {
    const {email} = req.options
    await AccountService.findOne(email)
    throw new Error('already_added')
  } catch (e) {
    if (e.message === 'not_found') {
      res.status(200).json()
      return
    }
    if (e.message === 'already_added') e.status = 409
    next(e)
  }
}

async function getAuthRegisterName(req: IRequest, res: Response, next: Function): Promise<void> {
  try {
    const {name} = req.options
    await UserService.findOne({name})
    throw new Error('already_added')
  } catch (e) {
    if (e.message === 'not_found') {
      res.status(200).json()
      return
    }
    if (e.message === 'already_added') e.status = 409
    next(e)
  }
}

async function postAuthReset(req: IRequest, res: Response, next: Function): Promise<void> {
  try {
    const {phone, password, phoneToken} = req.options
    await AuthService.userResetPassword(phone, password, phoneToken)
    res.status(204).send()
  } catch (e) {
    if (e.message === 'not_found') e.status = 404
    next(e)
  }
}

async function postAuthRefresh(req: IRequest, res: Response, next: Function): Promise<void> {
  try {
    const {accessToken, refreshToken} = req.options
    const newAccessToken = await AuthService.userRefreshToken(accessToken, refreshToken)
    res.status(201).json({accessToken: newAccessToken})
  } catch (e) {
    if (e.message === 'invalid_token') e.status = 401
    next(e)
  }
}

export {postAuth, getAuth, putAuth, postAuthRegister, getAuthRegisterEmail, getAuthRegisterName, postAuthReset, postAuthRefresh}

import {VerificationService} from '../../../../services'
import {Response} from 'express'

async function postVerifications(req: IRequest, res: Response, next: Function) {
  try {
    const {type, email} = req.options
    const ret = await VerificationService.create({email, type})
    res.status(201).json(ret)
  } catch (e) {
    if (e.message === 'not_found') e.status = 404
    else if (e.message === 'already_in_use') e.status = 409
    next(e)
  }
}

async function postVerificationsConfirm(req: IRequest, res: Response, next: Function) {
  try {
    const {code, codeToken} = req.options
    const emailToken = await VerificationService.confirm(code, codeToken)
    res.status(200).json({emailToken})
  } catch (e) {
    if (e.message === 'expired_token') e.status = 401
    else if (e.message === 'wrong_code') e.status = 409
    next(e)
  }
}

async function postVerificationsEmail(req: IRequest, res: Response, next: Function) {
  try {
    const {email, type} = req.options
    const result = await VerificationService.createEmail({email, type})
    res
        .status(200)
        .json({email: result.email, code: result.code, codeToken: result.codeToken, expireAt: result.expireAt})
  } catch (e) {
    if (e.message === 'already_in_use') e.status = 401
    else if (e.message === 'wrong_code') e.status = 409
    next(e)
  }
}

export {postVerifications, postVerificationsConfirm, postVerificationsEmail}

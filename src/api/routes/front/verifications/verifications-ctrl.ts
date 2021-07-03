import {VerificationService} from '../../../../services'
import {Response} from 'express'

async function postVerifications(req: IRequest, res: Response, next: Function) {
  try {
    const {type, phone} = req.options
    const ret = await VerificationService.create({phone, type})
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
    const phoneToken = await VerificationService.confirm(code, codeToken)
    res.status(200).json({phoneToken})
  } catch (e) {
    if (e.message === 'expired_token') e.status = 401
    else if (e.message === 'wrong_code') e.status = 409
    next(e)
  }
}

export {postVerifications, postVerificationsConfirm}

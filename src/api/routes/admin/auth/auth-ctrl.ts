import {Response} from 'express'
import {AdministratorService, AuthService} from '../../../../services'

async function postAuth(req: IRequest, res: Response, next: Function): Promise<void> {
  try {
    const {name, password, remember = false} = req.options

    const {accessToken, refreshToken, admin} = await AuthService.adminSignIn({
      name,
      password
    })
    res.status(200).json({
      accessToken,
      refreshToken,
      role: admin.role
    })
  } catch (e) {
    if (e.message === 'not_found') e.status = 404
    next(e)
  }
}

async function postRefresh(req, res: Response, next) {
  try {
    const {accessToken, refreshToken} = req.options
    const result = await AuthService.adminRefreshToken({
      accessToken,
      refreshToken
    })
    res.status(201).json({accessToken: result})
  } catch (e) {
    if (e.message === 'invalid_token') e.status = 401
    next(e)
  }
}

export {postAuth, postRefresh}

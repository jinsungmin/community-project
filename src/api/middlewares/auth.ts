import {Response} from 'express'
import {jwt as JWT} from '../../libs'
import {User} from '../../models'

function user(verifyToken?: boolean) {
  return async function (req: IRequest, res: Response, next?: Function): Promise<void> {
    try {
      const {authorization} = req.headers
      if (authorization && authorization.split(' ')[0] === 'Bearer') {
        const jwtToken = await JWT.decodeToken(authorization.split(' ')[1], {algorithms: ['RS256']})
        if (jwtToken.sub) {
          req.user = await User.findOne({id: jwtToken.sub})
          next()
        }
      } else {
        if (!verifyToken) res.status(401).json({message: 'invalid_token'})
        else next()
      }
    } catch (e) {
      if (e.message === 'forbidden') res.status(403).json({message: 'forbidden'})
      else res.status(401).json({message: 'invalid_token'})
    }
  }
}

async function admin(req: IRequest, res: Response, next?: Function): Promise<void> {
  try {
    const {authorization} = req.headers
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
      const jwtToken = await JWT.decodeAdminToken(authorization.split(' ')[1], {algorithms: ['RS256']})
      if (jwtToken.sub) {
        req.id = jwtToken.sub
        req.role = jwtToken.role
        return next()
      }
    }
    res.status(401).json({message: 'invalid_token'})
  } catch (e) {
    res.status(401).json({message: 'invalid_token'})
  }
}

export {user, admin}

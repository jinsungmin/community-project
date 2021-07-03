import {v4 as uuidV4} from 'uuid'
import {Response} from 'express'

export default (req: IRequest, res: Response, next: Function): void => {
  try {
    req.id = uuidV4()
    next()
  } catch (e) {
    next(e)
  }
}

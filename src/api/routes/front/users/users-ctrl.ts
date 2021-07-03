import {Response} from 'express'
import {UserService} from '../../../../services'
import {IUserUpdate} from '../../../../interfaces/user'

async function getUsers(req: IRequest, res: Response, next: Function): Promise<any> {
  try {
    const user = await UserService.findOne({id: req.user.id})
    res.status(200).json(user)
  } catch (e) {
    next(e)
  }
}

async function putUsers(req: IRequest, res: Response, next: Function): Promise<any> {
  try {
    const user = await UserService.update({id: req.user.id, ...req.options} as IUserUpdate)
    res.status(200).json(user)
  } catch (e) {
    next(e)
  }
}

async function deleteUsers(req: IRequest, res: Response, next: Function): Promise<any> {
  try {
    await UserService.deleteOne(req.user.id)
    res.status(204).send()
  } catch (e) {
    if (e.message === 'not_found') e.status = 404
    next(e)
  }
}

export {getUsers, putUsers, deleteUsers}

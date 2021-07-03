import {Response} from 'express'
import {AdministratorService} from '../../../../services'

async function postAdmins(req: IRequest, res: Response, next: Function): Promise<void> {
  try {
    const {name, password} = req.options
    const ret = await AdministratorService.create(name, password)
    res.status(201).json(ret)
  } catch (e) {
    if (e.message === 'already_in_use') e.status = 409
    next(e)
  }
}

async function getAdmins(req: IRequest, res: Response, next: Function): Promise<void> {
  try {
    const {search, sort, order, start, perPage} = req.options
    const ret = await AdministratorService.findAll({search, sort, order, start, perPage})
    res.status(200).json(ret)
  } catch (e) {
    next(e)
  }
}

async function getAdminsWithId(req: IRequest, res: Response, next: Function): Promise<void> {
  try {
    const admin = await AdministratorService.findOne(req.options.id)
    res.status(200).json(admin)
  } catch (e) {
    if (e.message === 'not_found') e.status = 404
    next(e)
  }
}

async function putAdminsWithId(req: IRequest, res: Response, next: Function): Promise<void> {
  try {
    const {id, name, nickname, password} = req.options
    const admin = await AdministratorService.update(id, name, nickname, password)
    res.status(200).json(admin)
  } catch (e) {
    if (e.message === 'not_found') e.status = 404
    if (e.message === 'cannot_edit_user') e.status = 409
    next(e)
  }
}

async function deleteAdminsWithId(req: IRequest, res: Response, next: Function): Promise<void> {
  try {
    if (req.user.id !== req.options.id) {
      await AdministratorService.deleteOne({id: req.options.id})
      res.status(204).send()
    } else {
      throw new Error('cannot_delete_master')
    }
  } catch (e) {
    if (e.message === 'not_found') e.status = 404
    if (e.message === 'cannot_delete_master') e.status = 409
    if (e.message === 'cannot_edit_user') e.status = 409
    next(e)
  }
}

export {postAdmins, getAdmins, getAdminsWithId, putAdminsWithId, deleteAdminsWithId}

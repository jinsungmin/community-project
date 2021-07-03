import {Response} from 'express'
import * as Schemas from '../schemas'

function verifyOptions(req, paths: string[], schema?: string, coerceTypes?: string): any {
  const options = {...req.query, ...req.body, ...req.file}
  try {
    if (paths) {
      paths.forEach((path) => Schemas.validate(req.params, path))
    }
    if (schema) Schemas.validate(options, schema, {coerceTypes})
  } catch (e) {
    throw new Error(e)
  }
  return {...req.params, ...options}
}

export default (
  paths: string[],
  schema?: string,
  coerceTypes?: string
): ((req: IRequest, res: Response, next: Function) => void) => {
  return (req: IRequest, res: Response, next: Function) => {
    try {
      req.options = verifyOptions(req, paths, schema, coerceTypes)
      next()
    } catch (e) {
      e.status = 400
      next(e)
    }
  }
}

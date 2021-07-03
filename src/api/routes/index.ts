import fs from 'fs'
import path from 'path'
import {Application, Router} from 'express'
import {ApiRouter} from './default'
import {error as errorMiddleware, auth as authMiddleware, request as requestMiddleware} from '../middlewares'
import {validate} from '../schemas'
import {logger} from '../../loaders'

const {errorHandler, notFound} = errorMiddleware
const excluded = ['/']

function validateResponse(ctrl) {
  return function (req, res, next) {
    const json = res.json

    res.json = function (body) {
      if (res.headersSent) {
        next()
        return
      }
      let ret = body
      if (res.statusCode >= 200 && res.statusCode < 300) {
        if (ctrl.responses && ctrl.responses[res.statusCode]) {
          const response = ctrl.responses[res.statusCode]
          if (response.schema) {
            try {
              ret = JSON.parse(JSON.stringify(ret))
              validate(ret, response.schema)
            } catch (e) {
              if (process.env.NODE_ENV === 'production') logger.fatal(e)
              else next(e)
            }
          }
        }
      }
      json.call(res, ret)
    }
    next()
  }
}

function getController(path: string, obj: any, router: Router): void {
  if (typeof obj === 'function') {
    router.use(path, obj)
  } else {
    Object.keys(obj).forEach((key) => {
      const ctrl = obj[key]
      if (ctrl instanceof ApiRouter) {
        let url
        if (typeof ctrl.name === 'string') {
          url = ctrl.name.length > 0 ? `${path}/${ctrl.name}` : path
        } else {
          url = `${path}/${key}`
        }
        if (!ctrl.handler) throw new Error(`${url} handler is required`)
        const args = [requestMiddleware(ctrl.paths, ctrl.schema, ctrl.coerceTypes), ...ctrl.middlewares, ctrl.handler]

        if (path.startsWith('/admin') && !ctrl.isPublic) args.unshift(authMiddleware.admin)
        else if (!ctrl.isPublic) args.unshift(authMiddleware.user(ctrl.protected))

        args.unshift(validateResponse(ctrl))
        router[ctrl.method](url, args)
      }
    })
  }
}

function loadRoutes(dir: string, currentDir: string, router: Router): void {
  fs.readdirSync(dir)
    .sort((a, b) => {
      return (
        Number(fs.lstatSync(path.join(dir, b)).isDirectory()) - Number(fs.lstatSync(path.join(dir, a)).isDirectory())
      )
    })
    .forEach((target) => {
      const targetDir = path.join(dir, target)
      const routePath = path.dirname(`/${path.relative(currentDir, targetDir)}`)
      if (fs.lstatSync(targetDir).isDirectory()) {
        loadRoutes(targetDir, currentDir, router)
      } else if (target.startsWith('index.') && !excluded.includes(routePath)) {
        const importPath = path.relative(__dirname, targetDir)
        const file = require(`./${importPath}`)
        getController(routePath, file.default || file, router)
      }
    })
}

export default (app: Application): void => {
  const router = Router()
  loadRoutes(__dirname, __dirname, router)
  app.use('/', router)
  app.use(notFound)
  app.use(errorHandler)
}

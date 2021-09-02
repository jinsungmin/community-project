import fs from 'fs'
import path from 'path'
import {ApiRouter} from '../default'
import {getSchema, getSchemas} from '../../schemas'
import pkg from '../../../../package.json'
import {logger} from '../../../loaders'

function escapeRefString(str: string) {
  return str.replace(/~/g, '~0').replace(/\//g, '~1')
}

function generatePath(path: string, obj: any, swaggerPaths: Dictionary): void {
  Object.keys(obj).forEach((key) => {
    const ctrl = obj[key]
    if (ctrl instanceof ApiRouter) {
      let url
      if (typeof ctrl.name === 'string') {
        if (ctrl.name.length > 0) {
          const sub = ctrl.name
            .split('/')
            .map((str) => {
              if (str.indexOf(':') === 0) {
                str = str.replace(':', '')
                return `{${str}}`
              }
              return str
            })
            .join('/')
          url = `${path}/${sub}`
        } else {
          url = path
        }
      } else {
        url = `${path}/${key}`
      }
      if (ctrl.method) {
        if (!swaggerPaths.hasOwnProperty(url)) {
          swaggerPaths[url] = {}
        }
        const path: Dictionary = {
          tags: ctrl.tags,
          summary: ctrl.summary,
          description: ctrl.description,
          parameters: [...ctrl.parameters],
          responses: {}
        }
        if (ctrl.paths) {
          ctrl.paths.forEach((aPath) => {
            const schema: any = getSchema(aPath)
            if (typeof schema === 'object') {
              Object.entries(schema.properties).forEach(([key]) => {
                path.parameters.push({
                  in: 'path',
                  name: key,
                  required: true,
                  schema: schema.properties[key]
                })
              })
            }
          })
        }
        if (ctrl.schema) {
          const schema: any = getSchema(ctrl.schema)
          if (['post', 'put'].includes(ctrl.method)) {
            const contentType = ctrl.contentType ? ctrl.contentType : 'application/json'
            path.requestBody = {content: {}}
            path.requestBody.content[contentType] = {
              schema: {$ref: `#/components/schemas/${escapeRefString(ctrl.schema)}`}
            }
          } else if (schema && schema.properties) {
            Object.entries(schema.properties).forEach(([key]) => {
              const required = schema.required.indexOf(key) > -1
              path.parameters.push({
                in: 'query',
                name: key,
                required,
                schema: schema.properties[key]
              })
            })
          }
        }
        if (ctrl.responses) {
          Object.entries(ctrl.responses).forEach(([k, v]) => {
            const {schema, ...rest} = v
            if (schema) {
              path.responses[k] = {
                ...rest,
                content: {
                  'application/json': {schema: {$ref: `#/components/schemas/${escapeRefString(schema)}`}}
                }
              }
            } else {
              path.responses[k] = v
            }
          })
        }
        if (!ctrl.isPublic) {
          path.security = [{bearerAuth: []}]
        }
        swaggerPaths[url][ctrl.method] = path
      }
    }
  })
}

function loadRoutes(dir: string, currentDir: string, swaggerPaths: Dictionary): any {
  try {
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
          loadRoutes(targetDir, currentDir, swaggerPaths)
        } else if (target.startsWith('index.')) {
          const importPath = path.relative(__dirname, targetDir)
          const middleware = require(`./${importPath}`)
          generatePath(routePath, middleware.default || middleware, swaggerPaths)
        }
      })
  } catch (e) {
    logger.fatal(e)
  }
  return swaggerPaths
}

export default (source: string): Dictionary => {
  try {
    const securitySchemes = {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }

    const swagger: Dictionary = {
      openapi: '3.0.3',
      info: {
        title: `${pkg.name} ${process.env.NODE_ENV}`,
        description: `API Document for ${pkg.name} ${process.env.NODE_ENV}`,
        contact: {
          name: 'Jinsungmin'
        },
        version: '0.1.0'
      },
      components: {
        securitySchemes
      }
    }
    swagger.servers = [{url: source}]
    swagger.paths = loadRoutes(
      path.join(__dirname, `../../routes`, source),
      path.join(__dirname, `../../routes`, source),
      {}
    )
    swagger.components.schemas = getSchemas('/').reduce((prev, curr) => {
      const {$id, ...rest} = curr
      prev[$id] = rest
      return prev
    }, {})
    return swagger
  } catch (e) {
    throw e
  }
}

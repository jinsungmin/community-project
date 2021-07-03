import {Response} from 'express'

interface IApiRouter {
  coerceTypes?: string
  contentType?: string
  description?: string
  fileNames?: string[]
  handler: Function
  isPublic?: boolean
  protected?: boolean
  method?: string
  middlewares?: Function[]
  name: string
  parameters?: any[]
  paths?: string[]
  responses: Dictionary
  roles?: string[]
  schema?: string
  summary?: string
  tags?: string[]
}

export class ApiRouter {
  coerceTypes: string
  contentType: string
  description: string
  fileNames: string[]
  handler: Function
  isPublic: boolean
  protected: boolean
  method: string
  middlewares: Function[]
  name: string
  parameters: any[]
  paths: string[]
  responses: Dictionary
  roles: string[]
  schema: string
  summary: string
  tags: string[]

  constructor(object: IApiRouter) {
    this.name = object.name
    this.method = object.method || 'get'
    this.summary = object.summary || ''
    this.description = object.description || ''
    this.tags = object.tags || []
    this.paths = object.paths
    this.schema = object.schema
    this.handler = object.handler
    this.parameters = object.parameters || []
    this.responses = object.responses || {200: {description: 'Success'}}
    this.contentType = object.contentType || 'application/json'
    this.middlewares = object.middlewares || []
    this.isPublic = object.isPublic || false
    this.protected = object.protected || false
    this.roles = object.roles || []
    this.fileNames = object.fileNames || []
    this.coerceTypes = object.coerceTypes ? object.coerceTypes : 'array'
  }
}

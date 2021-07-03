import {Request} from 'express'

declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'

declare global {
  declare interface IRequest extends Request {
    id?: string
    user: any
    role: string
    clientIp: string
    useragent: string
    session?: {[p: string]: any}
    options: {[p: string]: any}
  }

  declare interface Dictionary {
    [p: string]: any
  }

  declare interface IResponseList<T> {
    data: T[]
    total: number
  }
}

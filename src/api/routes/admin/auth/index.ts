import {ApiRouter} from '../../default'
import * as ctrl from './auth-ctrl'

const postAuth = new ApiRouter({
  name: '',
  method: 'post',
  summary: '로그인',
  schema: 'requests/admin/auth/PostAuth',
  tags: ['Auth'],
  isPublic: true,
  responses: {
    200: {schema: 'responses/admin/auth/PostAuth'},
    404: {description: 'Not found'}
  },
  handler: ctrl.postAuth
})

const postRefresh = new ApiRouter({
  name: 'refresh',
  method: 'post',
  summary: 'Refresh Token',
  schema: 'requests/admin/auth/PostAuthRefresh',
  tags: ['Auth'],
  isPublic: true,
  responses: {
    200: {schema: 'responses/admin/auth/PostAuth'},
    401: {description: 'Expired token'}
  },
  handler: ctrl.postRefresh
})

export {postAuth, postRefresh}

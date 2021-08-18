import {ApiRouter} from '../../default'
import * as ctrl from './auth-ctrl'

const postAuth = new ApiRouter({
  name: '',
  method: 'post',
  summary: '유저 로그인@',
  schema: 'requests/front/auth/PostAuth',
  tags: ['Auth'],
  isPublic: true,
  responses: {
    200: {schema: 'responses/front/auth/PostAuth'},
    404: {description: 'Not found'}
  },
  handler: ctrl.postAuth
})

const getAuth = new ApiRouter({
  name: '',
  method: 'get',
  summary: '유저 정보 조회',
  tags: ['Auth'],
  roles: ['owner'],
  responses: {
    201: {schema: 'responses/front/auth/getAuth'},
    401: {description: '만료된 토큰'},
    409: {description: 'already_added'}
  },
  handler: ctrl.getAuth
})

const putAuth = new ApiRouter({
  name: '',
  method: 'put',
  summary: '패스워드 변경',
  schema: 'requests/front/auth/PutAuth',
  tags: ['Auth'],
  roles: ['owner'],
  responses: {
    200: {schema: 'responses/front/auth/PutAuth'},
    404: {description: 'Not found'}
  },
  handler: ctrl.putAuth
})

const postAuthRegister = new ApiRouter({
  name: 'register',
  method: 'post',
  summary: '유저가입',
  description: '/verifications -> /verifications/confirm -> /auth/register',
  schema: 'requests/front/auth/PostAuthRegister',
  tags: ['Auth'],
  isPublic: true,
  responses: {
    201: {schema: 'responses/front/auth/PostAuth'},
    401: {description: '만료된 토큰'},
    409: {description: 'already_added'}
  },
  handler: ctrl.postAuthRegister
})

const getAuthRegisterEmail = new ApiRouter({
  name: 'register/email',
  method: 'get',
  summary: '유저가입 이메일 중복확인',
  schema: 'requests/front/auth/GetAuthRegisterEmail',
  tags: ['Auth'],
  isPublic: true,
  responses: {
    204: {description: 'Success!'},
    409: {description: 'already_added'}
  },
  handler: ctrl.getAuthRegisterEmail
})

const getAuthRegisterName = new ApiRouter({
  name: 'register/name',
  method: 'get',
  summary: '유저가입 닉네임 중복확인',
  schema: 'requests/front/auth/GetAuthRegisterName',
  tags: ['Auth'],
  isPublic: true,
  responses: {
    204: {description: 'Success!'},
    409: {description: 'already_added'}
  },
  handler: ctrl.getAuthRegisterName
})

const postAuthReset = new ApiRouter({
  name: 'reset',
  method: 'put',
  summary: '패스워드 재설정',
  schema: 'requests/front/auth/PostAuthReset',
  tags: ['Auth'],
  isPublic: true,
  responses: {
    204: {description: '이메일 발송 성공'},
    401: {description: '만료된 토큰'},
    404: {description: 'not_found'}
  },
  handler: ctrl.postAuthReset
})

const postAuthRefresh = new ApiRouter({
  name: 'refresh',
  method: 'post',
  summary: '토큰 갱신',
  schema: 'requests/front/auth/PostAuthRefresh',
  tags: ['Auth'],
  isPublic: true,
  responses: {
    201: {schema: 'responses/front/auth/PostAuthRefresh'},
    401: {description: '만료된 토큰'},
  },
  handler: ctrl.postAuthRefresh
})

export {
  postAuth,
  getAuth,
  putAuth,
  postAuthRegister,
  getAuthRegisterEmail,
  getAuthRegisterName,
  postAuthReset,
  postAuthRefresh
}

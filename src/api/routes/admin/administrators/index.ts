import {ApiRouter} from '../../default'
import * as ctrl from './administrators-ctrl'

const postAdmins = new ApiRouter({
  name: '',
  method: 'post',
  summary: '관리자 추가',
  schema: 'requests/admin/administrators/PostAdministrators',
  tags: ['Admins'],
  responses: {
    201: {schema: 'responses/admin/administrators/PostAdministrators'},
    409: {description: 'already added'}
  },
  handler: ctrl.postAdmins
})

const getAdmins = new ApiRouter({
  name: '',
  method: 'get',
  summary: '관리자 목록 조회',
  schema: 'requests/admin/administrators/GetAdministrators',
  tags: ['Admins'],
  responses: {
    200: {schema: 'responses/admin/administrators/GetAdministrators'}
  },
  handler: ctrl.getAdmins
})

const getAdminsWithId = new ApiRouter({
  name: ':id',
  method: 'get',
  paths: ['common/IdPath'],
  summary: '관리자 상세 조회',
  tags: ['Admins'],
  responses: {
    200: {schema: 'responses/admin/administrators/GetAdministratorsWithId'},
    404: {description: 'Not found'}
  },
  handler: ctrl.getAdminsWithId
})

const putAdminsWithId = new ApiRouter({
  name: ':id',
  method: 'put',
  paths: ['common/IdPath'],
  summary: '관리자 수정',
  schema: 'requests/admin/administrators/PutAdministrators',
  tags: ['Admins'],
  responses: {
    200: {schema: 'responses/admin/administrators/PutAdministratorsWithId'},
    404: {description: 'Not found'}
  },
  handler: ctrl.putAdminsWithId
})

const deleteAdminsWithId = new ApiRouter({
  name: ':id',
  method: 'delete',
  paths: ['common/IdPath'],
  summary: '관리자 삭제',
  tags: ['Admins'],
  responses: {
    204: {description: 'Success'},
    404: {description: 'Not found'}
  },
  handler: ctrl.deleteAdminsWithId
})

export {postAdmins, getAdmins, getAdminsWithId, putAdminsWithId, deleteAdminsWithId}

import {ApiRouter} from '../../default'
import * as ctrl from './users-ctrl'

const getUsers = new ApiRouter({
  name: '',
  method: 'get',
  summary: '유저 정보 조회',
  tags: ['Users'],
  responses: {
    200: {schema: 'responses/front/GetUsers'}
  },
  handler: ctrl.getUsers
})

const putUsers = new ApiRouter({
  name: '',
  method: 'put',
  summary: '유저 정보 수정',
  schema: 'requests/front/users/PutUsers',
  tags: ['Users'],
  responses: {
    200: {schema: 'common/IdPath'}
  },
  handler: ctrl.putUsers
})

const deleteUsers = new ApiRouter({
  name: '',
  method: 'delete',
  summary: '유저 탈퇴',
  tags: ['Users'],
  responses: {
    204: {description: 'Success!'}
  },
  handler: ctrl.deleteUsers
})

export {getUsers, putUsers}

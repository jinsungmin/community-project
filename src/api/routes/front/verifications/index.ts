import {ApiRouter} from '../../default'
import * as ctrl from './verifications-ctrl'

const postVerifications = new ApiRouter({
  name: '',
  method: 'post',
  summary: 'OTP 생성 및 SMS 전송. 개발 서버에서는 Response에서 확인 가능',
  schema: 'requests/front/verifications/PostVerifications',
  tags: ['Verifications'],
  isPublic: true,
  responses: {
    200: {schema: 'responses/front/verifications/PostVerifications'},
    404: {description: '해당 전화번호로 가입한 유저가 없음'},
    409: {
      description: `사용중인 전화번호\n
    already_in_use - 이미 가입된 유저의 전화번호`
    }
  },
  handler: ctrl.postVerifications
})

const postVerificationsConfirm = new ApiRouter({
  name: 'confirm',
  method: 'post',
  summary: 'OTP 인증',
  schema: 'requests/front/verifications/PostVerificationsConfirm',
  tags: ['Verifications'],
  isPublic: true,
  responses: {
    200: {schema: 'responses/front/verifications/PostVerificationsConfirm'},
    401: {description: '만료된 토큰'},
    409: {description: '잘못된 OTP'}
  },
  handler: ctrl.postVerificationsConfirm
})

const postVerificationsEmail = new ApiRouter({
  name: 'email',
  method: 'post',
  summary: '이메일 인증',
  schema: 'requests/front/verifications/PostVerificationsEmail',
  tags: ['Verifications'],
  isPublic: true,
  responses: {
    200: {schema: 'responses/front/verifications/PostVerificationsEmail'},
    401: {description: 'not_found'},
    409: {description: 'not_found'}
  },
  handler: ctrl.postVerificationsEmail
})

export {postVerifications, postVerificationsConfirm, postVerificationsEmail}

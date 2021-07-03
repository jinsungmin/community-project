import {ApiRouter} from '../../default'
import * as ctrl from './files-ctrl'

const getFilesUpload = new ApiRouter({
  name: 'upload',
  method: 'get',
  summary: 'S3 pre-signed url',
  schema: 'common/files/GetFilesUploadRequest',
  description: `
  url => PUT Method를 이용해 업로드할 경로\n
  path => 서버로 보내는 데이터`,
  tags: ['Files'],
  isPublic: true,
  responses: {
    200: {schema: 'common/files/GetFilesUploadResponse'}
  },
  handler: ctrl.getFilesUpload
})

export {getFilesUpload}

import {v4 as uuid} from 'uuid'
import mime from 'mime-types'
import {Response} from 'express'
import {aws} from '../../../../loaders'

async function getFilesUpload(req: IRequest, res: Response, next: Function): Promise<void> {
  try {
    const {mimeType, type} = req.options
    const extensions = mime.extensions[mimeType]
    if (type === 'image' && !mimeType.startsWith('image/')) {
      throw new Error('bad_mimeType')
    }
    const key = `${uuid()}.${extensions[0]}`
    const ret = await aws.generatePreSignedUrl(key, mimeType)
    res.status(200).json(ret)
  } catch (e) {
    if (e.message === 'bad_mimeType') e.status = 400
    next(e)
  }
}

export {getFilesUpload}

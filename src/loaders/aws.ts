import AWS from 'aws-sdk'
import config from 'config'

const awsConfig: Dictionary = config.get('aws')
AWS.config.update({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region,
  apiVersions: {
    s3: '2006-03-01'
  }
})
const s3 = new AWS.S3()

async function copyTempObject(path: string, prefix = ''): Promise<string> {
  try {
    if (!path) return path
    const url = new URL(path)
    return url.href
  } catch (e) {
    try {
      const targetKey = `${prefix}/${path}`
      const params = {
        Bucket: awsConfig.bucket,
        CopySource: `${awsConfig.tempBucket}/${path}`,
        Key: `${targetKey}`,
        CacheControl: 'max-age=31536000'
      }
      await s3.copyObject(params).promise()
      return `${awsConfig.cloudfront}/${targetKey}`
    } catch (e) {
      e.status = e.statusCode
      throw e
    }
  }
}

function generatePreSignedUrl(key: string, mimeType: string): Dictionary {
  try {
    const params = {
      Bucket: awsConfig.tempBucket,
      Key: key,
      ContentType: mimeType,
      Expires: 60
    }
    return {
      path: key,
      url: s3.getSignedUrl('putObject', params)
    }
  } catch (e) {
    throw e
  }
}

export {copyTempObject, generatePreSignedUrl}

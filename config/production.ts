export = {
  host: 'https://api.itdda.com',
  database: {
    connectionLimit: 100,
    timezone: 'utc',
    charset: 'utf8mb4',
    debug: []
  },
  redis: {
    host: 'redis',
    port: 6379
  },
  aws: {
    secrets: {
      mysql: 'prod/mysql'
    },
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    tempBucket: 'itdda-temp',
    cloudfront: 'https://dzkqp93gmun1s.cloudfront.net',
    bucket: 'itdda-prod'
  }
}

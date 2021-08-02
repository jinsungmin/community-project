export = {
  host: 'https://54.180.143.210:80',
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
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    tempBucket: 'jinjin-bucket',
    cloudfront: 'https://darj2zud5au9j.cloudfront.net',
    bucket: 'jinjin-bucket',
    social: {
      clientId: '406813698983-btoquhiheu24g2gdagolhdg2snn260q6.apps.googleusercontent.com',
      clientSecret: 'SCHRcvCU3zXXKsqhFuRsHXS9'
    }
  }
}

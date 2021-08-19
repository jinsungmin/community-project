import * as dotenv from 'dotenv'

dotenv.config()

export = {
  host: 'https://backend.dev-jinjin.com',
  database: {
    database: 'TEST',
    connectionLimit: 20,
    timezone: 'utc',
    charset: 'utf8mb4',
    debug: []
  },
  redis: {
    host: 'localhost',
    port: 6379
  },
  swagger: {
    id: process.env.SWAGGER_ID,
    password: process.env.SWAGGER_PW
  },
  mail: {
    account: {
      service: 'gmail',
      host: "smtp.gmail.com",
      secureConnection: false,
      port: 587,
      tls: {
        ciphers: 'SSLv3'
      },
      requireTLS: true,
      auth: {
        user: process.env.MAILER_ID,
        pass: process.env.MAILER_PW
      }
    },
    sender: ['jinsm404@gmail.com']
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    tempBucket: 'jinjin-bucket',
    cloudfront: 'https://darj2zud5au9j.cloudfront.net',
    bucket: 'jinjin-bucket',
    social: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }
  }
}

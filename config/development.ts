export = {
  host: 'https://backend.dev-jinjin.com',
  redis: {
    host: 'redis',
    port: 6379
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    redirectUrl: 'https://frontend.dev-jinjin.com/auth/sign-in'
  },
  kakao: {
    clientId: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_SECRET,
    redirectUrl: 'https://frontend.dev-jinjin.com/auth/sign-in'
  }
}

export default {
  meEndpoint: 'https://api.knori.or.kr/auth/me',
  loginEndpoint: 'https://api.knori.or.kr/auth/login',

  // registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

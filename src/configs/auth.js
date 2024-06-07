export default {
  meEndpoint: 'https://api.knori.or.kr/auth/me',
  loginEndpoint: 'https://api.knori.or.kr/auth/login',
  refreshTokenEndpoint: 'https://api.knori.or.kr/auth/refreshtoken',

  // registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  refreshTokenKeyName: 'refreshToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

const envConfig = {
  development: require('../config/config.dev'),
  production: require('../config/config.prod')
}
const host = 'http://10.150.62.213:8001'
const config = {
  host,
  loginHost: `${host}/auth/user/`,
  userHost: `${host}/ucenter/user/`,
  baseUrl: '/entrance',
  authKey: 'Authorization',
  cdnHost: 'http://183.230.174.110:11110'
}
const env = process.env.NODE_ENV
export default Object.assign({}, config, envConfig[env] || {})

import request from '@/utils/request'
import sysConfig from '@/config'

const { loginHost, userHost } = sysConfig

// 登录
const login = (param: object) =>
  request(`${loginHost}login`, {
    method: 'post',
    body: param
  })

// 获取登录令牌
const getJwt = () => request(`${loginHost}jwt`)

// 退出登录
const loginOut = () =>
  request(`${loginHost}logout`, {
    method: 'post'
  })

// 注册
const registerU = (param: object) =>
  request(`${loginHost}userRegistered`, {
    method: 'post',
    body: param
  })

// 修改密码
const changePassword = (param: object) =>
  request(`${userHost}changePassword`, {
    method: 'post',
    body: param
  })

export { login, getJwt, loginOut, registerU, changePassword }

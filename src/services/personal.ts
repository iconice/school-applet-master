import request from '@/utils/request'
import sysConfig from '@/config'

const { userHost } = sysConfig

//  更新用户头像
const updateAvatar = (param: { fileId: string; id: string }) =>
  request(`${userHost}updateUserHead?fileId=${param.fileId}&id=${param.id}`)

// 获取用户信息
const getUserInfo = param =>
  request(`${userHost}getUserInfoByUserNameSimple?userName=${param.userName}`)

export { updateAvatar, getUserInfo }

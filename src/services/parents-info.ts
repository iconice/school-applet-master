/**
 * 家长信息
 */
import request from '../utils/request'

// 获取家长信息
const getParentInfo = (param: { id: string }) =>
  request(`/parentInformation/getParentInformation?userId=${param.id}`, {
    method: 'post'
  })

// 新增/修改家长信息
const updateParentInfo = (param: object) =>
  request(`/parentInformation/updateParentInformation`, {
    method: 'post',
    body: param
  })

export { getParentInfo, updateParentInfo }

/**
 * 疫苗接种查验
 */
import request from '../utils/request'

// 创建接种查验
const createPrevention = (param: object) =>
  request(`/entrancePrevention/createPrevention`, {
    method: 'post',
    body: param
  })

// 获取接种查验数据
const getPreventionInfo = (param: { id: string }) =>
  request(`/entrancePrevention/getEntrancePreventionInfo/${param.id}`, {
    method: 'post'
  })

// 修改接种查验
const updatePrevention = (param: object) =>
  request(`/entrancePrevention/updateEntrancePrevention`, {
    method: 'post',
    body: param
  })

// 删除接种查验图片
const delPreventionFile = (param: { id: string }) =>
  request(`/entrancePrevention/deleteEntrancePreventionFile/${param.id}`, {
    method: 'post'
  })

export {
  createPrevention,
  getPreventionInfo,
  updatePrevention,
  delPreventionFile
}

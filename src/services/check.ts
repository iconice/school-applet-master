/**
 * 审核
 */
import request from '@/utils/request'

// 获取入学申请列表
const getEntranceApplicationList = (param: { fileId: string }) =>
  request(`/entranceApplication/getEntranceApplicationList`, {
    method: 'post',
    body: param
  })

// 修改申请状态
const updateStatus = (param: { id: string; status: number }) =>
  request(`/entranceApplication/updateStatus/${param.id}/${param.status}`, {
    method: 'post'
  })

// 删除申请
const delApply = (param: { id: string }) =>
  request(`/entranceApplication/deleteEntranceApplication/${param.id}`, {
    method: 'post'
  })

// 获取儿童户籍信息审核状态
const getEntranceBaseStatus = (param: { id: string }) =>
  request(`/entranceApplication/getEntranceBaseStatus/${param.id}`, {
    method: 'post'
  })

// 获取房产信息审核状态
const getEntranceHouseStatus = (param: { id: string }) =>
  request(`/entranceHouse/getEntranceHouseStatus/${param.id}`, {
    method: 'post'
  })

// 获取查验证明审核状态
const getEntrancePreventionStatus = (param: { id: string }) =>
  request(`/entrancePrevention/getEntrancePreventionStatus/${param.id}`, {
    method: 'post'
  })

// 获取转学信息审核状态
const getTransferStatus = (param: { id: string }) =>
  request(`/entranceStudent/queryStatus/${param.id}`, {
    method: 'post'
  })

export {
  getEntranceApplicationList,
  updateStatus,
  delApply,
  getEntranceBaseStatus,
  getEntranceHouseStatus,
  getEntrancePreventionStatus,
  getTransferStatus
}

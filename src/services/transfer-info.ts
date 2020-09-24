/**
 * 转学儿童信息
 */
import request from '../utils/request'

// 创建转学申请
const createTrans = (param: object) =>
  request(`/entranceStudent/apply`, {
    method: 'post',
    body: param
  })

// 获取转学数据
const getTransInfo = (param: { id: string }) =>
  request(`/entranceStudent/queryApply?studentId=${param.id}`, {
    method: 'post'
  })

// 修改转学申请
const updateTrans = (param: object) =>
  request(`/entranceStudent/updateApply`, {
    method: 'post',
    body: param
  })

export { createTrans, getTransInfo, updateTrans }

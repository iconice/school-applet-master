/**
 * 儿童户籍信息页
 */
import request from '@/utils/request'

// 创建儿童户籍信息
const createEntranceBase = (param: object) =>
  request(`/entranceApplication/createEntranceBase`, {
    method: 'post',
    body: param
  })

// 编辑时获取儿童户籍信息
const getEntranceBaseInfo = (param: { id: string }) =>
  request(`/entranceApplication/getEntranceBaseInfo?appliId=${param.id}`, {
    method: 'post',
    body: param
  })

// 编辑儿童户籍信息
const updateEntranceBase = (param: object) =>
  request(`/entranceApplication/updateEntranceBaseInfo`, {
    method: 'post',
    body: param
  })

// 修改申请标题
const updateTitle = (param: { id: string; title: string }) =>
  request(`/entranceApplication/updateTitle/${param.id}/${param.title}`, {
    method: 'post'
  })

export {
  createEntranceBase,
  getEntranceBaseInfo,
  updateEntranceBase,
  updateTitle
}

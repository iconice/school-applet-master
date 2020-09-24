/**
 * 房产信息
 */
import request from '@/utils/request'

// 获取小区列表
const getRegionAddList = () => request(`/region/getRegionAddList`)

// 创建房产信息
const createEntranceHouse = (param: object) =>
  request(`/entranceHouse/createEntranceHouse`, {
    method: 'post',
    body: param
  })

// 获取房产信息
const getEntranceHouseInfo = (param: { id: string }) =>
  request(`/entranceHouse/getEntranceHouseInfo?appliId=${param.id}`, {
    method: 'post'
  })

// 更新房产信息
const updateEntranceHouse = (param: object) =>
  request(`/entranceHouse/updateEntranceHouse`, {
    method: 'post',
    body: param
  })

// 删除已有的房产权利人
const delEntranceHousePeople = (param: { id: string }) =>
  request(`/entranceHouse/deleteEntranceHousePeople?id=${param.id}`, {
    method: 'post'
  })

// 删除已有的房产图片
const delHouseFile = (param: { id: string }) =>
  request(`/entranceHouse/deleteHouseFile?id=${param.id}`, {
    method: 'post'
  })

export {
  getRegionAddList,
  createEntranceHouse,
  getEntranceHouseInfo,
  updateEntranceHouse,
  delEntranceHousePeople,
  delHouseFile
}

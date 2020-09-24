import request from '@/utils/request'

// 创建一个新的申请
const createEntrance = (param: { fileId: string }) =>
  request(`/entranceApplication/createEntranceApplication`, {
    method: 'post',
    body: param
  })

export { createEntrance }

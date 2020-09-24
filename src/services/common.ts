/**
 * 公共接口
 */
import request from '@/utils/request'

// 文件删除
const delFile = (param: { fileId: string }) =>
  request(`/file/deleFile`, {
    method: 'post',
    body: param
  })

export { delFile }

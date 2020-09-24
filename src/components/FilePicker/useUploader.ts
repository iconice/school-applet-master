import Taro, { useState } from '@tarojs/taro'
import sysConfig from '@/config'
import { errorHandle } from '@/utils/request'

const { host, baseUrl, authKey } = sysConfig

export interface IFile {
  id?: string
  source: string
  percent: number
  finish: boolean
}

export interface IState {
  files: IFile[] // 要显示的图片资源数组
  count: number // 最多张数
  size: number
  beforeUpload: (f: any) => boolean
}

export default (
  data: IState
): [IState, { add: () => any; remove: (id: string) => any }] => {
  const [state, setState] = useState<IState>({
    files: data.files || [],
    count: data.count || 1,
    size: data.size || 0,
    beforeUpload: data.beforeUpload || (() => true)
  })

  const chooseImage = () => {
    return Taro.chooseImage({
      // count: state.count - state.files.length,
      count: 1, // 接口不支持多张上传，每次只能上传一张
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    }).then(res => {
      return res.tempFiles.map(f => ({
        path: f.path,
        size: f.size
      }))
    })
  }

  const add = async () => {
    const files = await chooseImage()
    const rFiles = files.filter(f => (state.size ? f.size < state.size : true))

    if (files.length > rFiles.length) {
      Taro.showToast({ title: '文件大小超过限制', icon: 'none' })
    }

    rFiles
      .filter(state.beforeUpload)
      .slice(0, state.count - state.files.length)
      .forEach(upload)
  }

  const upload = (file: { path: string; size: number }) => {
    // 文件上传
    Taro.uploadFile({
      url: `${host}${baseUrl}/file/upload`,
      filePath: file.path,
      name: 'file',
      header: {
        Authorization: 'Bearer ' + Taro.getStorageSync(authKey),
        uid: Taro.getStorageSync('uid')
      },
      success: res => {
        res.data = JSON.parse(res.data)
        const { statusCode } = res
        if (statusCode >= 200 && statusCode <= 300) {
          const crtSuc = {
            // @ts-ignore
            source: res.data.data.fileId,
            percent: 100,
            finish: true
          }
          setState(prevState => ({
            ...prevState,
            files: [...prevState.files, crtSuc]
          }))
        } else {
          errorHandle(res, '')
        }
      },
      fail: () => {
        Taro.showToast({
          title: '上传失败，请重试',
          icon: 'none'
        })
      }
    })
  }
  // 文件删除
  const remove = async (source: string) => {
    setState(prevState => ({
      ...prevState,
      files: prevState.files.filter(f => f.source !== source)
    }))
  }

  return [state, { add, remove }]
}

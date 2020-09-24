import Taro from '@tarojs/taro'
import sysConfig from '@/config'
import {
  handleCommonError,
  handleNoCommontError,
  errorMsg,
  handleWorkError
} from './errorHandle'

const { baseUrl, host, authKey } = sysConfig
/**
 * @param url
 * @param options (noLoading表示接口请求不需要loading，noErrorTip表示接口出错时不要提示错误信息)
 */
export default async function request(url: string, options?: any) {
  const hasApi = url.indexOf('http://') === -1 && url.indexOf('https://') === -1
  const uid = Taro.getStorageSync('uid')
  const defaultOptions = {
    header:
      options && options.headers
        ? {
            ...options.headers,
            [authKey]: 'Bearer ' + Taro.getStorageSync(authKey),
            uid
          }
        : {
            [authKey]: 'Bearer ' + Taro.getStorageSync(authKey),
            uid
          }
  }
  const newOptions = { ...defaultOptions, ...options }
  newOptions.data = newOptions.body
  delete newOptions.body
  if (!newOptions.noLoading) {
    Taro.showLoading({
      title: '加载中'
    })
  }
  // console.log('URL:' + host + baseUrl + url)
  return Taro.request({
    url: encodeURI(!hasApi ? url : host + baseUrl + url),
    ...newOptions
  })
    .then(response => {
      Taro.hideLoading()
      const { statusCode, data } = response
      if (statusCode >= 200 && statusCode <= 300) {
        return data
      } else {
        errorHandle(response, options)
      }
    })
    .catch(error => {
      Taro.hideLoading()
      throw error
    })
}

const errorHandle = (response, options) => {
  // 请求有响应
  if (response) {
    const { statusCode, data } = response
    data.msg = data.msg || errorMsg
    const { code, msg } = data
    if (statusCode === 400) {
      handleCommonError(data, options)
      throw { code, msg }
    }
    if (statusCode === 401) {
      handleWorkError(data, options)
      throw { code, msg }
    }
    // 404 502 ..
    const message = errorMsg
    handleNoCommontError(msg)
    throw message
    // throw message;
  }
}

export { errorHandle }

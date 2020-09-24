import config from '@/config'
/**
 * 公共方法
 */

/**
 * 图片链接完整url拼接
 * @halfUrl 为接口返回的url
 */
const completeUrl = (halfUrl: string): string => {
  if (!halfUrl) {
    return ''
  }
  if (halfUrl.indexOf('http') === 0 || halfUrl.indexOf('https') === 0) {
    return encodeURI(halfUrl)
  }
  return encodeURI(`${config.cdnHost}/${halfUrl}`)
}

export { completeUrl }

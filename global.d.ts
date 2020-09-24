declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.styl'

// @ts-ignore
declare const process: {
  env: {
    TARO_ENV:
      | 'weapp'
      | 'swan'
      | 'alipay'
      | 'h5'
      | 'rn'
      | 'tt'
      | 'quickapp'
      | 'qq'
    [key: string]: any
  }
}

// @ts-ignore
declare let global: {
  registered?: boolean
  top: number
}

/**
 * 全局状态
 */
interface IStore {
  loading: {
    effects: string[]
  }
  // common: ICommonStore
  // home: IHomeStore
  // find: IFindStore
}

/**
 * dva异步方法调用
 */
type IDispatch = (object: {
  type: string
  payload?: object
  callback?: (res) => void
}) => void

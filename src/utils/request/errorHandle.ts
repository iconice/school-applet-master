import Taro from '@tarojs/taro'
import { stringify } from 'qs'

const errorCode = {
  c10003: 10003 // 未登陆
}
const errorMsg = '报告！服务器出了点小问题，稍后再试试...'

function handleNoCommontError(message) {
  Taro.showToast({
    title: message,
    icon: 'none'
  })
}

function handleWorkError(err, outOptions?) {
  // console.log(err, options)
  const { code } = err
  switch (code) {
    case errorCode.c10003: {
      try {
        const routes = Taro.getCurrentPages()
        const len = routes.length
        //获取当前路由栈最后一个
        const currentRoute = routes[len - 1]
        const { options, route } = currentRoute
        const option = Object.assign(options, { isShare: true })
        const redirectUrl = `/${route}?${stringify(option)}`
        Taro.setStorageSync('redirectUrl', redirectUrl)
        Taro.redirectTo({
          url: `/pages/login/index`
        })
        break
      } catch (e) {}
    }
    default: {
      if (!outOptions.noErrorTip) {
        handleNoCommontError(err.msg)
      }
    }
  }
}
function handleCommonError(err, options) {
  const { code } = err
  switch (code) {
    default: {
      if (!options.noErrorTip) {
        handleNoCommontError(err.msg)
      }
    }
  }
}

export {
  handleWorkError,
  handleCommonError,
  handleNoCommontError,
  errorMsg,
  errorCode
}

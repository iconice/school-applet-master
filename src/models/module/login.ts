import Taro from '@tarojs/taro'
import { EffectsCommandMap } from 'dva-core'
import {
  login,
  getJwt,
  loginOut,
  registerU,
  changePassword
} from '@/services/login'
import jwtDecode from 'jwt-decode'
import systemConfig from '@/config'

const namespace = 'login'
export { namespace }
export default {
  namespace,
  state: {},
  effects: {
    *login({ payload }: { payload: any }, { call, put }: EffectsCommandMap) {
      try {
        const res = yield call(login, { ...payload })
        const { code, message, data } = res
        if (code === 10000) {
          // 登录成功
          // 获取登陆令牌
          yield put({
            type: 'getJwt'
          })
          Taro.setStorageSync('uid', data.token)
        } else {
          Taro.showToast({
            title: message,
            icon: 'none'
          })
        }
      } catch (e) {}
    },
    // 获取用户公共信息
    *getJwt({ payload }: { payload: any }, { call }: EffectsCommandMap) {
      try {
        const data = yield call(getJwt)
        Taro.setStorageSync(systemConfig.authKey, data.data.jwp)
        const userData = jwtDecode(data.data.jwp)
        Taro.setStorageSync(
          'userData',
          userData ? JSON.stringify(userData) : '{}'
        )
        if (payload && payload.isUpdate) return
        const currentUrl = Taro.getStorageSync('currentUrl')
        Taro.reLaunch({
          url: currentUrl || '/pages/home/index'
        })
      } catch (e) {}
    },
    *loginOut({}, { call }: EffectsCommandMap) {
      try {
        yield call(loginOut)
        // 退出登录成功
        Taro.reLaunch({
          url: '/pages/home/index'
        })
        Taro.clearStorageSync()
      } catch (e) {}
    },
    *registerU({ payload }: { payload: any }, { call }: EffectsCommandMap) {
      try {
        const res = yield call(registerU, { ...payload })
        // 注册成功
        const { code, message } = res
        if (code === 10000) {
          Taro.showToast({
            title: '注册成功～',
            icon: 'none'
          })
          setTimeout(() => {
            // 注册成功
            Taro.reLaunch({
              url: '/pages/login/index'
            })
          }, 2000)
        } else {
          Taro.showToast({
            title: message,
            icon: 'none'
          })
        }
      } catch (e) {}
    },
    *changePassword(
      { payload }: { payload: any },
      { call }: EffectsCommandMap
    ) {
      try {
        const res = yield call(changePassword, { ...payload })
        const { code, message } = res
        if (code === 10000) {
          // 密码修改成功
          Taro.reLaunch({
            url: '/pages/login/index'
          })
          Taro.clearStorageSync()
        } else {
          Taro.showToast({
            title: message,
            icon: 'none'
          })
        }
      } catch (e) {}
    }
  },
  reducers: {
    setState(state: any, { payload }: { payload: any }) {
      return { ...state, ...payload }
    }
  }
}

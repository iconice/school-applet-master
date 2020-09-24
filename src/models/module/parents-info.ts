import Taro from '@tarojs/taro'
import { EffectsCommandMap } from 'dva-core'
import { getParentInfo, updateParentInfo } from '@/services/parents-info'

const namespace = 'parents-info'
export { namespace }
export default {
  namespace,
  state: {},

  effects: {
    *getParentInfo(
      { payload, callback }: { payload: any; callback: any },
      { call }: EffectsCommandMap
    ) {
      try {
        const res = yield call(getParentInfo, { ...payload })
        const { code, message, data } = res
        if (code === 10000) {
          callback && callback(data)
        } else {
          Taro.showToast({
            title: message,
            icon: 'none'
          })
        }
      } catch (e) {}
    },
    *updateParentInfo(
      { payload }: { payload: any },
      { call }: EffectsCommandMap
    ) {
      try {
        const res = yield call(updateParentInfo, { ...payload })
        const { code, message } = res
        if (code === 10000) {
          Taro.navigateBack()
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
    setState(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}

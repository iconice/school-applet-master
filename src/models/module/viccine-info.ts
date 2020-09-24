import Taro from '@tarojs/taro'
import { EffectsCommandMap } from 'dva-core'
import {
  createPrevention,
  getPreventionInfo,
  updatePrevention,
  delPreventionFile
} from '@/services/viccine-info'

const namespace = 'viccine-info'
export { namespace }
export default {
  namespace,
  state: {
    editData: {} // 编辑时初始数据
  },

  effects: {
    *createPrevention(
      { payload, callback }: { payload: any; callback: any },
      { call }: EffectsCommandMap
    ) {
      try {
        const res = yield call(createPrevention, { ...payload })
        const { code, message } = res
        if (code === 10000) {
          callback && callback()
        } else {
          Taro.showToast({
            title: message,
            icon: 'none'
          })
        }
      } catch (e) {}
    },
    *getPreventionInfo(
      { payload }: { payload: any },
      { call, put }: EffectsCommandMap
    ) {
      try {
        const res = yield call(getPreventionInfo, { ...payload })
        const { code, message, data } = res
        if (code === 10000) {
          yield put({
            type: 'setState',
            payload: {
              editData: data
            }
          })
        } else {
          Taro.showToast({
            title: message,
            icon: 'none'
          })
        }
      } catch (e) {}
    },
    *updatePrevention(
      { payload }: { payload: any },
      { call }: EffectsCommandMap
    ) {
      try {
        const res = yield call(updatePrevention, { ...payload })
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
    },
    *delPreventionFile(
      { payload, callback }: { payload: any; callback: any },
      { call }: EffectsCommandMap
    ) {
      try {
        const res = yield call(delPreventionFile, { ...payload })
        const { message, code } = res
        if (code === 10000) {
          callback && callback()
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

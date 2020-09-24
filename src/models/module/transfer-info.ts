import Taro from '@tarojs/taro'
import { EffectsCommandMap } from 'dva-core'
import {
  createTrans,
  getTransInfo,
  updateTrans
} from '@/services/transfer-info'

const namespace = 'transfer-info'
export { namespace }
export default {
  namespace,
  state: {
    editData: {} // 编辑时初始数据
  },

  effects: {
    *createTrans(
      { payload, callback }: { payload: any; callback: any },
      { call }: EffectsCommandMap
    ) {
      try {
        const res = yield call(createTrans, { ...payload })
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
    *getTransInfo(
      { payload }: { payload: any },
      { call, put }: EffectsCommandMap
    ) {
      try {
        const res = yield call(getTransInfo, { ...payload })
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
    *updateTrans(
      { payload, callback }: { payload: any; callback: any },
      { call }: EffectsCommandMap
    ) {
      try {
        const res = yield call(updateTrans, { ...payload })
        const { code, message } = res
        if (code === 10000) {
          Taro.navigateBack()
          callback()
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

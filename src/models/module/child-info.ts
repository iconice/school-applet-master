import Taro from '@tarojs/taro'
import { EffectsCommandMap } from 'dva-core'
import {
  createEntranceBase,
  updateTitle,
  getEntranceBaseInfo,
  updateEntranceBase
} from '@/services/child-info'

const namespace = 'child-info'
export { namespace }
export default {
  namespace,
  state: {
    editData: {} // 编辑时初始数据
  },

  effects: {
    *createEntranceBase(
      { payload, callback }: { payload: any; callback: any },
      { call, put }: EffectsCommandMap
    ) {
      try {
        const res = yield call(createEntranceBase, { ...payload })
        const { code, message } = res
        if (code === 10000) {
          // 修改申请标题
          yield put({
            type: 'updateTitle',
            payload: {
              id: payload.appliId,
              title: `${payload.childName}${
                payload.isTrans ? '转学' : '入学'
              }审核`
            }
          })
          callback && callback()
        } else {
          Taro.showToast({
            title: message,
            icon: 'none'
          })
        }
      } catch (e) {}
    },
    *updateTitle({ payload }: { payload: any }, { call }: EffectsCommandMap) {
      try {
        yield call(updateTitle, { ...payload })
      } catch (e) {}
    },
    *getEntranceBaseInfo(
      { payload }: { payload: any },
      { call, put }: EffectsCommandMap
    ) {
      try {
        const res = yield call(getEntranceBaseInfo, { ...payload })
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
    *updateEntranceBase(
      { payload, callback }: { payload: any; callback: any },
      { call, put }: EffectsCommandMap
    ) {
      try {
        const res = yield call(updateEntranceBase, { ...payload })
        const { code, message } = res
        if (code === 10000) {
          // 修改申请标题
          yield put({
            type: 'updateTitle',
            payload: {
              id: payload.id,
              title: `${payload.childName}${
                payload.isTrans ? '转学' : '入学'
              }审核`
            }
          })
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

import Taro from '@tarojs/taro'
import { EffectsCommandMap } from 'dva-core'
import {
  getRegionAddList,
  createEntranceHouse,
  getEntranceHouseInfo,
  updateEntranceHouse,
  delEntranceHousePeople,
  delHouseFile
} from '@/services/house-info'

const namespace = 'house-info'
export { namespace }
export default {
  namespace,
  state: {
    regionAddList: [], // 小区列表
    editData: {} // 编辑时初始数据
  },

  effects: {
    *getRegionAddList({}, { call, put }: EffectsCommandMap) {
      try {
        const res = yield call(getRegionAddList)
        const { code, message, data } = res
        if (code === 10000) {
          yield put({
            type: 'setState',
            payload: {
              regionAddList: data
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
    *createEntranceHouse(
      { payload, callback }: { payload: any; callback: any },
      { call }: EffectsCommandMap
    ) {
      try {
        const res = yield call(createEntranceHouse, { ...payload })
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
    *getEntranceHouseInfo(
      { payload }: { payload: any },
      { call, put }: EffectsCommandMap
    ) {
      try {
        const res = yield call(getEntranceHouseInfo, { ...payload })
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
    *updateEntranceHouse(
      { payload, callback }: { payload: any; callback: any },
      { call }: EffectsCommandMap
    ) {
      try {
        const res = yield call(updateEntranceHouse, { ...payload })
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
    },
    *delEntranceHousePeople(
      { payload, callback }: { payload: any; callback: any },
      { call }: EffectsCommandMap
    ) {
      try {
        const res = yield call(delEntranceHousePeople, { ...payload })
        const { message, code } = res
        Taro.showToast({
          title: message,
          icon: 'none'
        })
        if (code === 10000) {
          callback && callback()
        }
      } catch (e) {}
    },
    *delHouseFile(
      { payload, callback }: { payload: any; callback: any },
      { call }: EffectsCommandMap
    ) {
      try {
        const res = yield call(delHouseFile, { ...payload })
        const { message, code } = res
        Taro.showToast({
          title: message,
          icon: 'none'
        })
        if (code === 10000) {
          callback && callback()
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

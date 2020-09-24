import Taro from '@tarojs/taro'
import { EffectsCommandMap } from 'dva-core'
import {
  getEntranceApplicationList,
  delApply,
  getEntranceBaseStatus,
  getEntranceHouseStatus,
  getEntrancePreventionStatus,
  getTransferStatus,
  updateStatus
} from '@/services/check'
import { namespace as commonSpace } from './common'

const namespace = 'check-result'
export { namespace }
export default {
  namespace,
  state: {
    applyList: [], // 用户入学申请列表
    applyStatus: {}, // 审核详情申请状态
    baseStatus: 1, // 儿童户籍信息审核状态
    houseStatus: 1, // 房产信息审核状态
    preventionStatus: 1, // 疫苗接种信息审核状态
    transferStatus: 1 // 转学信息审核状态
  },

  effects: {
    *getEntranceApplicationList(
      { payload }: { payload: any },
      { call, put }: EffectsCommandMap
    ) {
      try {
        const res = yield call(getEntranceApplicationList, { ...payload })
        yield put({
          type: 'setState',
          payload: {
            applyList: res.data
          }
        })
      } catch (e) {
        yield put({
          type: 'setState',
          payload: {
            applyList: []
          }
        })
      }
    },
    *delApply({ payload }: { payload: any }, { call }: EffectsCommandMap) {
      try {
        const res = yield call(delApply, { ...payload })
        const { code, message } = res
        if (code === 10000) {
          Taro.showToast({
            title: '删除成功～',
            icon: 'none'
          })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1500)
        } else {
          Taro.showToast({
            title: message,
            icon: 'none'
          })
        }
      } catch (e) {}
    },
    *getItemStatus(
      { payload }: { payload: any },
      { call, put, select }: EffectsCommandMap
    ) {
      try {
        const isTrans = yield select(state => {
          return state[commonSpace].isTrans
        })
        const res1 = yield call(getEntranceBaseStatus, { ...payload })
        const res2 = yield call(getEntranceHouseStatus, { ...payload })
        const res3 = yield call(getEntrancePreventionStatus, { ...payload })
        if (isTrans) {
          const res4 = yield call(getTransferStatus, { ...payload })
          yield put({
            type: 'setState',
            payload: {
              baseStatus: res1.data.status,
              houseStatus: res2.data.status,
              preventionStatus: res3.data.status,
              transferStatus: res4.data.status
            }
          })
        } else {
          yield put({
            type: 'setState',
            payload: {
              baseStatus: res1.data.status,
              houseStatus: res2.data.status,
              preventionStatus: res3.data.status
            }
          })
        }
      } catch (e) {}
    },
    *updateStatus({ payload }: { payload: any }, { call }: EffectsCommandMap) {
      try {
        const res = yield call(updateStatus, { ...payload })
        const { code, message } = res
        if (code === 10000) {
          Taro.showToast({
            title: '提交成功～',
            icon: 'none'
          })
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

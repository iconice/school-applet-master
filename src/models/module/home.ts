import Taro from '@tarojs/taro'
import { EffectsCommandMap } from 'dva-core'
import { createEntrance } from '@/services/home'
import { updateTitle } from '@/services/child-info'

const namespace = 'home'
export { namespace }
export default {
  namespace,
  state: {},

  effects: {
    *createEntrance(
      { payload, callback }: { payload: any; callback: any },
      { call, put }: EffectsCommandMap
    ) {
      try {
        const res = yield call(createEntrance, { ...payload })
        yield put({
          type: 'updateTitle',
          payload: {
            id: res.data.id,
            title: `${payload.type === 2 ? '转学' : '入学'}审核`
          }
        })
        Taro.navigateTo({ url: '/pages/child-info/index' })
        callback(res.data)
      } catch (e) {}
    },
    *updateTitle({ payload }: { payload: any }, { call }: EffectsCommandMap) {
      try {
        yield call(updateTitle, { ...payload })
      } catch (e) {}
    }
  },

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}

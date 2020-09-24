import { EffectsCommandMap } from 'dva-core'
import { updateAvatar, getUserInfo } from '@/services/personal'

const namespace = 'personal'
export { namespace }
export default {
  namespace,
  state: {
    userInfo: {}
  },

  effects: {
    *updateAvatar({ payload }: { payload: any }, { call }: EffectsCommandMap) {
      try {
        yield call(updateAvatar, { ...payload })
      } catch (e) {}
    },
    *getUserInfo(
      { payload }: { payload: any },
      { call, put }: EffectsCommandMap
    ) {
      try {
        const { data } = yield call(getUserInfo, { ...payload })
        yield put({
          type: 'setState',
          payload: {
            userInfo: data
          }
        })
      } catch (e) {}
    }
  },

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}

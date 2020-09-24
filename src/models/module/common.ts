const namespace = 'common'
export { namespace }
export default {
  namespace,
  state: {
    currentId: '', // 当前编辑儿童id
    isTrans: false // 当前编辑儿童是否为转学生
  },

  effects: {},

  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}

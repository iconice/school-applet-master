import Taro from '@tarojs/taro'
import { create } from 'dva-core'
import createLoading from 'dva-loading'
import models from '../models'

const opt = {
  initialState: {},
  models: models
}
const app = create(opt)
app.use(createLoading({}))

// 适配支付宝小程序
if (Taro.getEnv() === Taro.ENV_TYPE.ALIPAY) {
}

if (!global.registered) opt.models.forEach(model => app.model(model))
global.registered = true
app.start()
const store = app._store

export default store

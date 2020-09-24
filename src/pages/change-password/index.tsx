import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { namespace } from '@/models/module/login'
import './index.less'

interface IProps {
  dispatch: IDispatch
}
interface IState {
  oldPw: string
  newPw1: string
  newPw2: string
}

@connect((models: IStore) => {
  return {
    ...models[namespace]
  } as IProps
})
export default class Index extends Component<IProps, IState> {
  config: Config = {
    navigationBarTitleText: '修改密码'
  }

  state = {
    oldPw: '',
    newPw1: '',
    newPw2: ''
  }

  confirm = () => {
    const { oldPw, newPw1, newPw2 } = this.state
    if (newPw1 != newPw2) {
      Taro.showToast({
        title: '两次输入的新密码不一致，请确认～',
        icon: 'none'
      })
      return
    }
    const userData = JSON.parse(Taro.getStorageSync('userData') || '{}')
    this.props.dispatch({
      type: `${namespace}/changePassword`,
      payload: {
        id: userData.id,
        oldpw: oldPw,
        newpw: newPw1
      }
    })
  }

  render() {
    const { oldPw, newPw1, newPw2 } = this.state
    return (
      <View className='change-password'>
        <View className='input-item'>
          <View className='label'>
            <Text>旧密码</Text>
          </View>
          <Input
            className='input'
            placeholder='请输入旧密码'
            placeholderClass='placeholder'
            value={oldPw}
            onInput={e => {
              this.setState({
                oldPw: e.detail.value
              })
            }}
          />
        </View>
        <View className='input-item'>
          <View className='label'>
            <Text>新密码</Text>
          </View>
          <Input
            className='input'
            placeholder='请输入新密码'
            placeholderClass='placeholder'
            value={newPw1}
            onInput={e => {
              this.setState({
                newPw1: e.detail.value
              })
            }}
          />
        </View>
        <View className='input-item'>
          <View className='label'>
            <Text>确认新密码</Text>
          </View>
          <Input
            className='input'
            placeholder='请再次确认新密码'
            placeholderClass='placeholder'
            value={newPw2}
            onInput={e => {
              this.setState({
                newPw2: e.detail.value
              })
            }}
          />
        </View>
        <Button className='pramary-buttom btn' onClick={this.confirm}>
          确定
        </Button>
      </View>
    )
  }
}

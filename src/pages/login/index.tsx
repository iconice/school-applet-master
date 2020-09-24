import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Image, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { namespace } from '@/models/module/login'
import { LoginHeader } from '@/components'
import { eyeClose, eyeOpen } from '@/asset/images'
import './index.less'

interface IProps {
  dispatch: IDispatch
}

interface IState {
  mobile: string
  password: string
  isShow: boolean // 是否显示密码
  isRight: boolean // 密码是否正确
}

@connect((models: IStore) => {
  return {
    ...models[namespace]
  } as IProps
})
export default class Login extends Component<IProps, IState> {
  state = {
    mobile: '',
    password: '',
    isShow: false,
    isRight: true
  }
  config: Taro.PageConfig = {
    navigationStyle: 'custom',
    navigationBarTitleText: '登陆',
    enablePullDownRefresh: false,
    navigationBarTextStyle: 'white'
  }

  changeShow = () => {
    const { isShow } = this.state
    this.setState({
      isShow: !isShow
    })
  }

  login = () => {
    const { mobile, password } = this.state
    this.props.dispatch({
      type: `${namespace}/login`,
      payload: {
        password,
        userName: mobile
      }
    })
  }

  render() {
    const { mobile, password, isShow, isRight } = this.state
    return (
      <View className='login'>
        <LoginHeader />
        <View className='content'>
          <View className='input-box'>
            <Input
              className='input'
              maxLength={11}
              // type='number'
              placeholder='请输入手机号'
              placeholderClass='placeholder'
              value={mobile}
              onInput={e =>
                this.setState({
                  mobile: e.detail.value
                })
              }
            />
            <View className='input'>
              <Input
                style={{ flex: 1 }}
                password={!isShow}
                placeholder='请输入密码'
                placeholderClass='placeholder'
                value={password}
                onInput={e =>
                  this.setState({
                    password: e.detail.value
                  })
                }
              />
              <Image
                src={isShow ? eyeOpen : eyeClose}
                className='eye-ic'
                onClick={this.changeShow}
              />
            </View>
            <View className='info'>
              <Text className='err-info'>
                {isRight ? '' : '密码错误请重新输入'}
              </Text>
              <Text
                className='forgot'
                onClick={() => {
                  Taro.navigateTo({
                    url: '/pages/register/index?isForgot=true'
                  })
                }}
              >
                忘记密码？
              </Text>
            </View>
          </View>
          <Button className='pramary-buttom btn' onClick={this.login}>
            登录
          </Button>
          <View className='buttom-txt'>
            <Text className='txt1'>没有账号？</Text>
            <Text
              className='txt2'
              onClick={() => {
                Taro.reLaunch({ url: '/pages/register/index' })
              }}
            >
              立即注册
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

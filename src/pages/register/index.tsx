import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { namespace } from '@/models/module/login'
import { LoginHeader } from '@/components'
import { eyeClose, eyeOpen } from '@/asset/images'
import './index.less'

interface IProps {
  dispatch: IDispatch
}

interface IState {
  tell: string
  password: string
  passCheck: string
  isSame: boolean
  isShow1: boolean
  isShow2: boolean
}

@connect((models: IStore) => {
  return {
    ...models[namespace]
  } as IProps
})
export default class Index extends Component<IProps, IState> {
  config: Taro.PageConfig = {
    navigationStyle: 'custom',
    navigationBarTitleText: '注册',
    enablePullDownRefresh: false,
    navigationBarTextStyle: 'white'
  }

  state = {
    tell: '',
    password: '',
    passCheck: '',
    isSame: true,
    isShow1: false,
    isShow2: false
  }

  checkSame = () => {
    const { password, passCheck } = this.state
    if (!password.length || !passCheck.length) return
    this.setState({
      isSame: password === passCheck
    })
  }

  confirm = () => {
    const { isForgot } = this.$router.params
    const { tell, password, passCheck, isSame } = this.state
    if (!isSame) return
    if (!tell.length || !password.length || !passCheck.length) {
      Taro.showToast({
        title: '请填写完整的注册信息～',
        icon: 'none'
      })
      return
    }
    if (isForgot) {
      // 找回密码
    } else {
      // 注册
      this.props.dispatch({
        type: `${namespace}/registerU`,
        payload: {
          tell,
          password,
          type: 2
        }
      })
    }
  }

  render() {
    const { isForgot } = this.$router.params
    const { tell, password, passCheck, isSame, isShow1, isShow2 } = this.state
    return (
      <View className='register-page'>
        <LoginHeader />
        <View className='content'>
          <View className='input-box'>
            <View className='input'>
              <Text>+86</Text>
              <View className='line'></View>
              <Input
                style={{ flex: 1 }}
                type='number'
                maxLength={11}
                placeholder='请输入手机号'
                placeholderClass='placeholder'
                value={tell}
                onInput={e =>
                  this.setState({
                    tell: e.detail.value
                  })
                }
              />
            </View>
            {/* <View className='input'>
              <Input
                style={{ flex: 1 }}
                type='number'
                placeholder='请输入验证码'
                placeholderClass='placeholder'
              />
              <View>
                <Text className='txt1'>获取验证码</Text>
              </View>
            </View> */}
            <View className='input'>
              <Input
                style={{ flex: 1 }}
                placeholder='请输入密码'
                password={!isShow1}
                placeholderClass='placeholder'
                value={password}
                onInput={e =>
                  this.setState(
                    {
                      password: e.detail.value
                    },
                    () => {
                      this.checkSame()
                    }
                  )
                }
              />
              <Image
                src={isShow1 ? eyeOpen : eyeClose}
                className='eye-ic'
                onClick={() => {
                  this.setState({
                    isShow1: !isShow1
                  })
                }}
              />
            </View>
            <View className='input'>
              <Input
                style={{ flex: 1 }}
                placeholder='请再次输入密码'
                password={!isShow2}
                placeholderClass='placeholder'
                value={passCheck}
                onInput={e =>
                  this.setState(
                    {
                      passCheck: e.detail.value
                    },
                    () => {
                      this.checkSame()
                    }
                  )
                }
              />
              <Image
                src={isShow2 ? eyeOpen : eyeClose}
                className='eye-ic'
                onClick={() => {
                  this.setState({
                    isShow2: !isShow2
                  })
                }}
              />
            </View>
            {!isSame && (
              <View className='err-info'>
                <Text>两次密码不一致，请重新输入</Text>
              </View>
            )}
            <Button className='pramary-buttom btn' onClick={this.confirm}>
              {isForgot ? '确定' : '注册'}
            </Button>
          </View>
          <View className='buttom-txt'>
            <Text className='txt1'>已有账号？</Text>
            <Text
              className='txt2'
              onClick={() => {
                Taro.reLaunch({ url: '/pages/login/index' })
              }}
            >
              去登录
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

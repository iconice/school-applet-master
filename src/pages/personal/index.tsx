import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Avatar, TriIc, editIc } from '@/asset/images'
import { connect } from '@tarojs/redux'
import { namespace } from '@/models/module/personal'
import { namespace as loginSpace } from '@/models/module/login'
import { completeUrl } from '@/utils/tools'
import sysConfig from '@/config'
import { errorHandle } from '@/utils/request'
import './index.less'

const { host, baseUrl, authKey } = sysConfig
interface IProps {
  userInfo: { [key: string]: any }
  dispatch: IDispatch
}
interface IState {
  avatar: string
}

@connect((models: IStore) => {
  return {
    ...models[namespace]
  } as IProps
})
export default class Login extends Component<IProps, IState> {
  config: Taro.PageConfig = {
    navigationStyle: 'custom',
    navigationBarTitleText: '个人中心',
    enablePullDownRefresh: false
  }

  state = {
    avatar: ''
  }

  componentDidMount() {
    const userData = JSON.parse(Taro.getStorageSync('userData') || '{}')
    this.props.dispatch({
      type: `${namespace}/getUserInfo`,
      payload: {
        userName: userData.id
      }
    })
  }

  // 修改头像
  changeAvatar = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: res => {
        // 文件上传
        Taro.uploadFile({
          url: `${host}${baseUrl}/file/upload`,
          filePath: res.tempFiles[0].path,
          name: 'file',
          header: {
            Authorization: 'Bearer ' + Taro.getStorageSync(authKey),
            uid: Taro.getStorageSync('uid')
          },
          success: res2 => {
            res2.data = JSON.parse(res2.data)
            const { statusCode } = res2
            if (statusCode >= 200 && statusCode <= 300) {
              const userData = JSON.parse(
                Taro.getStorageSync('userData') || '{}'
              )
              this.props.dispatch({
                type: `${namespace}/updateAvatar`,
                payload: {
                  // @ts-ignore
                  fileId: res2.data.data.fileId,
                  id: userData.id
                }
              })
              this.setState({
                // @ts-ignore
                avatar: res2.data.data.fileId
              })
            } else {
              errorHandle(res2, '')
            }
          },
          fail: () => {
            Taro.showToast({
              title: '上传失败，请重试',
              icon: 'none'
            })
          }
        })
      }
    })
  }

  // 退出登录
  logout = () => {
    this.props.dispatch({
      type: `${loginSpace}/loginOut`
    })
  }

  render() {
    const { avatar } = this.state
    const { userInfo } = this.props
    return (
      <View className='personal'>
        <View className='header'>
          <Image
            src={completeUrl(avatar || userInfo.headUrl) || Avatar}
            className='avatar'
          />
          <View className='desc'>
            <Text>{userInfo.userName}</Text>
            <View className='edit' onClick={this.changeAvatar}>
              <Image src={editIc} className='edit-ic' />
              <Text className='txt'>修改个人头像</Text>
            </View>
          </View>
        </View>
        <View className='content'>
          <View className='con'>
            <View
              className='line'
              onClick={() =>
                Taro.navigateTo({ url: '/pages/change-password/index' })
              }
            >
              <Text className='txt'>密码修改</Text>
              <Image className='tri-ic' src={TriIc} />
            </View>
            <View
              className='line'
              onClick={() => {
                Taro.navigateTo({
                  url: '/pages/parents-info/index'
                })
              }}
            >
              <Text className='txt'>家长信息变更</Text>
              <Image className='tri-ic' src={TriIc} />
            </View>
          </View>
          <View className='login-out' onClick={this.logout}>
            <Text className='txt'>退出登录</Text>
          </View>
        </View>
      </View>
    )
  }
}

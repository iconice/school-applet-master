import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { namespace as commonSpace } from '@/models/module/common'
import { namespace as pageSpace } from '@/models/module/home'
import { homeBtn1, homeBtn2, homeBtn3 } from '@/asset/images'
import './index.less'

interface IProps {
  dispatch: IDispatch
}

@connect((models: IStore) => {
  return {
    ...models[commonSpace],
    ...models[pageSpace]
  } as IProps
})
export default class Index extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '首页'
  }

  // 新增
  addApply = (isTrans: boolean) => {
    this.props.dispatch({
      type: `${commonSpace}/setState`,
      payload: {
        isTrans
      }
    })
    const userData = JSON.parse(Taro.getStorageSync('userData') || '{}')
    this.props.dispatch({
      type: `${pageSpace}/createEntrance`,
      payload: {
        type: isTrans ? 2 : 1, // 2为转学 1为入学
        userId: userData.id
      },
      callback: data => {
        this.props.dispatch({
          type: `${commonSpace}/setState`,
          payload: {
            currentId: data.id
          }
        })
      }
    })
  }

  render() {
    return (
      <View className='home'>
        <View className='banner'>
          <Image
            src={require('./banner.png')}
            className='banner-img'
            onClick={() =>
              Taro.navigateTo({
                url: '/pages/enrollment-guide/index'
              })
            }
          />
        </View>
        <View className='content'>
          <View className='sign-line'>
            <View className='sigh-item' onClick={() => this.addApply(false)}>
              <View className='item-left'>
                <Text className='txt1'>新生入学</Text>
                <Text className='txt2'>线上审批快速入学</Text>
              </View>
              <View className='item-right'>
                <Image className='img' src={homeBtn2} />
              </View>
            </View>
            <View className='sigh-item' onClick={() => this.addApply(true)}>
              <View className='item-left'>
                <Text className='txt1'>新生转学</Text>
                <Text className='txt2'>线上审核一步到位</Text>
              </View>
              <View className='item-right'>
                <Image className='img' src={homeBtn3} />
              </View>
            </View>
          </View>
          <View className='sign-line'>
            <View
              className='sigh-item'
              onClick={() =>
                Taro.navigateTo({ url: '/pages/parents-info/index' })
              }
            >
              <View className='item-left'>
                <Text className='txt1'>家长信息</Text>
                <Text className='txt2'>家校沟通便捷联系</Text>
              </View>
              <View className='item-right'>
                <Image className='img' src={homeBtn1} />
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

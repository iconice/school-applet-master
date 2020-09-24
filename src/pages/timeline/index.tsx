import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { CommonHeader } from '@/components'
import { lines } from '@/asset/commonData'
import { connect } from '@tarojs/redux'
import { namespace } from '@/models/module/common'
import './index.less'

interface IProps {
  isTrans: boolean
}

@connect((models: IStore) => {
  return {
    ...models[namespace]
  } as IProps
})
export default class Login extends Component<IProps> {
  config: Taro.PageConfig = {
    navigationStyle: 'custom',
    enablePullDownRefresh: false,
    navigationBarTextStyle: 'white'
  }

  confirm = () => {
    const { step } = this.$router.params
    const { isTrans } = this.props
    if (parseInt(step) < 3) {
      const url =
        step === '1' ? '/pages/house-info/index' : '/pages/viccine-info/index'
      Taro.redirectTo({
        url
      })
      return
    }
    if (parseInt(step) === 3) {
      if (isTrans) {
        Taro.redirectTo({
          url: '/pages/transfer-info/index'
        })
      } else {
        Taro.switchTab({
          url: '/pages/check-result/index'
        })
      }
      return
    }
    if (parseInt(step) === 4) {
      Taro.switchTab({
        url: '/pages/check-result/index'
      })
    }
  }

  render() {
    const { step } = this.$router.params
    const { isTrans } = this.props
    const btnTxt = isTrans
      ? step === '4'
        ? '完成'
        : '下一步'
      : step === '3'
      ? '完成'
      : '下一步'
    return (
      <View className='timeline'>
        <CommonHeader />
        <View className='content'>
          <View className='card'>
            {(isTrans ? lines : lines.slice(0, 3)).map(item => (
              <View
                key={item.id}
                className={item.id <= parseInt(step) ? 'item item-ac' : 'item'}
              >
                <View
                  className='line'
                  style={{ height: isTrans ? '80rpx' : '116rpx' }}
                />
                <View className='con'>
                  <View className='circle'>
                    {item.id <= parseInt(step) ? (
                      <View className='circle-in' />
                    ) : null}
                  </View>
                  <Text className='txt'>{item.name}</Text>
                </View>
              </View>
            ))}
            <Button className='pramary-buttom btn' onClick={this.confirm}>
              {btnTxt}
            </Button>
          </View>
        </View>
      </View>
    )
  }
}

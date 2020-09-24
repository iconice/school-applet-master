import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.less'

export default class Index extends PureComponent {
  render() {
    return (
      <View className='common-header'>
        <Image
          src={require('./tri_back.png')}
          className='back-ic'
          onClick={() => Taro.reLaunch({ url: '/pages/check-result/index' })}
        />
        <View className='txt'>Complete</View>
      </View>
    )
  }
}

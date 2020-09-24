import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { waveImg } from '@/asset/images'
import './index.less'

export default class Index extends PureComponent {
  render() {
    return (
      <View className='login-header'>
        <View className='word'>
          <View className='txt1'>
            <Text>珊瑚鲁能小学</Text>
          </View>
          <View className='txt2'>
            <Text>招生报名系统</Text>
          </View>
        </View>
        <Image src={waveImg} className='wave-img' />
      </View>
    )
  }
}

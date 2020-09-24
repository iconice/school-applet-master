import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { namespace } from '@/models/module/common'
import { TriIc, ApplyAdd } from '@/asset/images'
import './index.less'

interface IProps {
  dispatch: IDispatch
}

interface IState {
  entranceArr: any[]
  transferArr: any[]
}

@connect((models: IStore) => {
  return {
    ...models[namespace]
  } as IProps
})
export default class Index extends Component<IProps, IState> {
  state = {
    entranceArr: ['1'],
    transferArr: ['1']
  }
  config: Config = {
    navigationBarTitleText: '新生入学'
  }

  // 新增入学儿童
  addEntrance = () => {
    const { entranceArr } = this.state
    const newArr = [...entranceArr, entranceArr.length.toString()]
    this.setState({
      entranceArr: newArr
    })
  }

  // 新增转学儿童
  addTransfer = () => {
    const { transferArr } = this.state
    const newArr = [...transferArr, transferArr.length.toString()]
    this.setState({
      transferArr: newArr
    })
  }

  // 信息编辑
  editInfo = (isTrans: boolean) => {
    this.props.dispatch({
      type: `${namespace}/setState`,
      payload: {
        isTrans
      }
    })
    Taro.navigateTo({ url: '/pages/child-info/index' })
  }

  render() {
    const { entranceArr, transferArr } = this.state
    return (
      <View className='entrance'>
        <View className='content'>
          <View className='info-block'>
            {entranceArr.map(item => (
              <View
                className='item'
                key={item}
                onClick={() => this.editInfo(false)}
              >
                <Text>申请入学</Text>
                <Image src={TriIc} className='tri-ic' />
              </View>
            ))}
            <View className='info-line' onClick={this.addEntrance}>
              <Text className='txt'>多个入学儿童请点击</Text>
              <Image src={ApplyAdd} className='add-ic' />
            </View>
          </View>
          <View className='info-block'>
            {transferArr.map(item => (
              <View
                className='item'
                key={item}
                onClick={() => this.editInfo(true)}
              >
                <Text>申请转学</Text>
                <Image src={TriIc} className='tri-ic' />
              </View>
            ))}
            <View className='info-line' onClick={this.addTransfer}>
              <Text className='txt'>多个转学儿童请点击</Text>
              <Image src={ApplyAdd} className='add-ic' />
            </View>
          </View>
        </View>
      </View>
    )
  }
}

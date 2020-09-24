import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { namespace } from '@/models/module/check'
import { studentIc, TriIc, noData } from '@/asset/images'
import './index.less'

interface IProps {
  applyList: any[]
  dispatch: IDispatch
}
@connect((models: IStore) => {
  return {
    ...models[namespace]
  } as IProps
})
export default class Index extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '审核'
  }

  componentDidShow() {
    const userData = JSON.parse(Taro.getStorageSync('userData') || '{}')
    this.props.dispatch({
      type: `${namespace}/getEntranceApplicationList`,
      payload: {
        userId: userData.id
      }
    })
  }

  render() {
    // status状态：1-草稿、2-待审核、3-审核不通过、4-审核通过、5-入学完成
    // type类型: 1-入学、2-转学
    const { applyList } = this.props
    return (
      <View className='check-page'>
        {applyList.length ? (
          <View className='content'>
            {applyList.map((item: any) => (
              <View
                key={item.id}
                className='line'
                onClick={() =>
                  Taro.navigateTo({
                    url: `/pages/check-detail/index?id=${item.id}&status=${item.status}&type=${item.type}`
                  })
                }
              >
                <View className='line-left'>
                  <Image className='student-ic' src={studentIc} />
                  <Text className='txt'>{item.title}</Text>
                </View>
                <View className='line-right'>
                  <Text
                    className={
                      item.status === 1
                        ? 'check-txt wait-txt'
                        : item.status === 3
                        ? 'check-txt err-txt'
                        : 'check-txt'
                    }
                  >
                    {item.status === 1
                      ? '待提交'
                      : item.status === 2
                      ? '审核中'
                      : item.status === 3
                      ? '不通过'
                      : item.status === 4
                      ? '通过'
                      : '完成'}
                  </Text>
                  <Image className='tri-ic' src={TriIc} />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className='no-data'>
            <Image src={noData} className='img' />
            <Text className='txt'>暂无相关数据！</Text>
            <Text className='txt'>请到首页申请入/转学</Text>
          </View>
        )}
      </View>
    )
  }
}

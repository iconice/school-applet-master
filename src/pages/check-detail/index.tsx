import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { namespace } from '@/models/module/check'
import { namespace as commonSpace } from '@/models/module/common'
import { TriIc, delIc } from '@/asset/images'
import './index.less'

interface IProps {
  baseStatus: number
  houseStatus: number
  preventionStatus: number
  transferStatus: number
  dispatch: IDispatch
}

@connect((models: IStore) => {
  return {
    ...models[namespace],
    ...models[commonSpace]
  } as IProps
})
export default class Index extends Component<IProps> {
  config: Config = {
    navigationBarTitleText: '审核详情'
  }

  componentWillMount() {
    this.init()
  }

  init = async () => {
    const { id, type } = this.$router.params
    await this.props.dispatch({
      type: `${commonSpace}/setState`,
      payload: {
        isTrans: type === '2' ? true : false
      }
    })
    await this.props.dispatch({
      type: `${namespace}/getItemStatus`,
      payload: {
        id
      }
    })
  }

  // 删除申请(只有草稿状态的可以删除)
  delApply = () => {
    Taro.showModal({
      title: '',
      content: '确认删除该条审核信息吗',
      confirmColor: '#EB6655'
    }).then(res => {
      if (res.confirm) {
        const { id } = this.$router.params
        this.props.dispatch({
          type: `${namespace}/delApply`,
          payload: {
            id
          }
        })
      }
    })
  }

  // 提交审核
  submitCheck = () => {
    Taro.showModal({
      title: '',
      content: '提交后信息将无法更改，确认信息无误提交审核吗？',
      confirmColor: '#EB6655'
    }).then(res => {
      if (res.confirm) {
        const { id } = this.$router.params
        this.props.dispatch({
          type: `${namespace}/updateStatus`,
          payload: {
            id,
            status: 2
          }
        })
      }
    })
  }

  render() {
    const {
      baseStatus,
      houseStatus,
      preventionStatus,
      transferStatus
    } = this.props
    const { id, status, type } = this.$router.params // 状态：1-草稿、2-待审核、3-审核不通过、4-审核通过、5-入学完成
    return (
      <View className='check-detail'>
        <View className='content'>
          <View
            className='line'
            onClick={() => {
              if (baseStatus === 2) {
                Taro.showToast({
                  title: '审核中不能修改信息哦～',
                  icon: 'none'
                })
                return
              }
              Taro.navigateTo({
                url: `/pages/child-info/index?id=${id}&isEdit=true`
              })
            }}
          >
            <View className='line-left'>
              <Text className='txt'>儿童户籍信息</Text>
            </View>
            <View className='line-right'>
              <Text
                className={
                  baseStatus === 1
                    ? 'wait-txt'
                    : baseStatus === 3
                    ? 'err-txt'
                    : 'txt'
                }
              >
                {baseStatus === 1
                  ? '待提交'
                  : baseStatus === 2
                  ? '审核中'
                  : baseStatus === 3
                  ? '不通过'
                  : baseStatus === 4
                  ? '通过'
                  : '已完成'}
              </Text>
              <Image className='tri-ic' src={TriIc} />
            </View>
          </View>
          <View
            className='line'
            onClick={() => {
              if (houseStatus === 2) {
                Taro.showToast({
                  title: '审核中不能修改信息哦～',
                  icon: 'none'
                })
                return
              }
              Taro.navigateTo({
                url: `/pages/house-info/index?id=${id}&isEdit=true`
              })
            }}
          >
            <View className='line-left'>
              <Text className='txt'>房产情况</Text>
            </View>
            <View className='line-right'>
              <Text
                className={
                  houseStatus === 1
                    ? 'wait-txt'
                    : houseStatus === 3
                    ? 'err-txt'
                    : 'txt'
                }
              >
                {houseStatus === 1
                  ? '待提交'
                  : houseStatus === 2
                  ? '审核中'
                  : houseStatus === 3
                  ? '不通过'
                  : houseStatus === 4
                  ? '通过'
                  : '已完成'}
              </Text>
              <Image className='tri-ic' src={TriIc} />
            </View>
          </View>
          <View
            className='line'
            onClick={() => {
              if (preventionStatus === 2) {
                Taro.showToast({
                  title: '审核中不能修改信息哦～',
                  icon: 'none'
                })
                return
              }
              Taro.navigateTo({
                url: `/pages/viccine-info/index?id=${id}&isEdit=true`
              })
            }}
          >
            <View className='line-left'>
              <Text className='txt'>儿童接种查验</Text>
            </View>
            <View className='line-right'>
              <Text
                className={
                  preventionStatus === 1
                    ? 'wait-txt'
                    : preventionStatus === 3
                    ? 'err-txt'
                    : 'txt'
                }
              >
                {preventionStatus === 1
                  ? '待提交'
                  : preventionStatus === 2
                  ? '审核中'
                  : preventionStatus === 3
                  ? '不通过'
                  : preventionStatus === 4
                  ? '通过'
                  : '已完成'}
              </Text>
              <Image className='tri-ic' src={TriIc} />
            </View>
          </View>
          {type === '2' && (
            <View
              className='line'
              onClick={() => {
                if (transferStatus === 2) {
                  Taro.showToast({
                    title: '审核中不能修改信息哦～',
                    icon: 'none'
                  })
                  return
                }
                Taro.navigateTo({
                  url: `/pages/transfer-info/index?id=${id}&isEdit=true`
                })
              }}
            >
              <View className='line-left'>
                <Text className='txt'>转学儿童信息</Text>
              </View>
              <View className='line-right'>
                <Text
                  className={
                    transferStatus === 1
                      ? 'wait-txt'
                      : transferStatus === 3
                      ? 'err-txt'
                      : 'txt'
                  }
                >
                  {transferStatus === 1
                    ? '待提交'
                    : transferStatus === 2
                    ? '审核中'
                    : transferStatus === 3
                    ? '不通过'
                    : transferStatus === 4
                    ? '通过'
                    : '已完成'}
                </Text>
                <Image className='tri-ic' src={TriIc} />
              </View>
            </View>
          )}
        </View>
        <View className='operate-box'>
          <View className='operate-line'>
            {status === '1' && (
              <View className='del-btn' onClick={this.delApply}>
                <Image src={delIc} className='del-ic' />
              </View>
            )}
            {parseInt(status) === 1 || parseInt(status) === 3 ? (
              <Button className='pramary-buttom btn' onClick={this.submitCheck}>
                {parseInt(status) === 1 ? '提交审核' : '重新提交'}
              </Button>
            ) : (
              <Button className='forbidden-buttom btn'>
                {parseInt(status) === 2
                  ? '审核中'
                  : parseInt(status) === 4
                  ? '审核通过'
                  : '已完成'}
              </Button>
            )}
          </View>
        </View>
      </View>
    )
  }
}

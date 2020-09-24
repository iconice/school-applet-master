import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Input, Button, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { namespace } from '@/models/module/parents-info'
import { namespace as commonSpace } from '@/models/module/common'
import { InfoAdd, TriDown } from '@/asset/images'
import { relations } from '@/asset/commonData'
import './index.less'

const newrRelations = relations.slice(1, relations.length - 1)
interface ParentItem {
  id?: string
  dep?: string // 部门
  name: string
  relations: number // 关系 父亲为1，母亲为2
  tell: string
  userId?: string
  workUnits?: string
  workUnitsTell?: string
}
interface IProps {
  dispatch: IDispatch
}
interface IState {
  parentInfoList: ParentItem[]
  relatives: ParentItem[]
  canSubmit: boolean
}

@connect((models: IStore) => {
  return {
    ...models[namespace],
    ...models[commonSpace]
  } as IProps
})
export default class Index extends Component<IProps, IState> {
  state = {
    parentInfoList: [
      {
        dep: '',
        name: '',
        relations: 1,
        tell: '',
        workUnits: '',
        workUnitsTell: ''
      },
      {
        dep: '',
        name: '',
        relations: 2,
        tell: '',
        workUnits: '',
        workUnitsTell: ''
      }
    ],
    relatives: [
      {
        name: '',
        relations: newrRelations[0].value,
        tell: '',
        isUp: false,
        relationName: newrRelations[0].name
      }
    ],
    canSubmit: false
  }
  config: Config = {
    navigationBarTitleText: '家长信息'
  }

  componentDidMount() {
    const userData = JSON.parse(Taro.getStorageSync('userData') || '{}')
    this.props.dispatch({
      type: `${namespace}/getParentInfo`,
      payload: {
        id: userData.id
      },
      callback: res => {
        if (!res.length) return
        const parentInfoList: ParentItem[] = []
        const relatives: ParentItem[] = []
        // 先按照关系relations排序，确保父母信息在前面
        res.sort((a, b) => {
          if (a.relations < b.relations) {
            return -1
          } else if (a.relations < b.relations) {
            return 0
          } else {
            return 1
          }
        })
        res.map((it: ParentItem) => {
          if (it.relations === 1 || it.relations === 2) {
            parentInfoList.push(it)
          } else {
            relatives.push(it)
          }
        })
        this.setState({
          parentInfoList: parentInfoList.length
            ? parentInfoList
            : this.state.parentInfoList,
          relatives,
          canSubmit: true
        })
      }
    })
  }

  // 父母信息修改
  changParents = (index: number, key: string, val: string) => {
    const { parentInfoList } = this.state
    const newArr = [...parentInfoList]
    newArr[index][key] = val
    this.setState(
      {
        parentInfoList: newArr
      },
      () => {
        if (key === 'name' || key === 'tell') {
          this.changeSubmit()
        }
      }
    )
  }

  // 增加其他亲属
  addRelation = () => {
    const { relatives } = this.state
    const newArr = [
      ...relatives,
      {
        name: '',
        relations: newrRelations[0].value,
        tell: '',
        isUp: false
      }
    ]
    this.setState({
      relatives: newArr,
      canSubmit: false
    })
  }

  // 删除其他亲属
  delRelation = (index: number) => {
    const { relatives } = this.state
    Taro.showModal({
      title: '',
      content: '确定删除该房产权利人吗？',
      confirmColor: '#EB6655'
    }).then(res => {
      if (res.confirm) {
        const newArr = [...relatives]
        newArr.splice(index, 1)
        this.setState(
          {
            relatives: newArr
          },
          () => {
            this.changeSubmit()
          }
        )
      }
    })
  }

  delMethod = (index: number) => {
    const { relatives } = this.state
    const newArr = [...relatives]
    newArr.splice(index, 1)
    this.setState(
      {
        relatives: newArr
      },
      () => {
        this.changeSubmit()
      }
    )
  }

  // 更改亲属关系
  changeRelation = (e: any, index: number) => {
    const { relatives } = this.state
    const newArr = [...relatives]
    newArr[index].relations = newrRelations[parseInt(e.detail.value)].value
    newArr[index].relationName = newrRelations[parseInt(e.detail.value)].name
    newArr[index].isUp = false
    this.setState({
      relatives: newArr
    })
  }

  // 打开亲属关系选择面板
  openPan = (index: number) => {
    const { relatives } = this.state
    const newArr = [...relatives]
    newArr[index].isUp = true
    this.setState({
      relatives: newArr
    })
  }

  // 关闭亲属关系选择面板
  closePan = (index: number) => {
    const { relatives } = this.state
    const newArr = [...relatives]
    newArr[index].isUp = false
    this.setState({
      relatives: newArr
    })
  }

  // 父母亲以外input输入框值更改
  otherChange = (key: string, val: string, index: number) => {
    const { relatives } = this.state
    const newArr = [...relatives]
    newArr[index][key] = val
    this.setState(
      {
        relatives: newArr
      },
      () => {
        this.changeSubmit()
      }
    )
  }

  // 确认
  confirm = () => {
    if (!this.state.canSubmit) return
    const { parentInfoList, relatives } = this.state
    const userData = JSON.parse(Taro.getStorageSync('userData') || '{}')
    const arr = [...parentInfoList, ...relatives].filter(
      (it: ParentItem) => it.name && it.tell
    )
    this.props.dispatch({
      type: `${namespace}/updateParentInfo`,
      payload: {
        userId: userData.id,
        parentInfoList: arr
      }
    })
  }

  // 判断是否可以提交
  changeSubmit = () => {
    const { parentInfoList, relatives } = this.state
    let hasFather = false
    let hasMother = false
    let hasOther = false
    if (parentInfoList[0] && parentInfoList[0].name && parentInfoList[0].tell) {
      hasFather = true
    }
    if (parentInfoList[1] && parentInfoList[1].name && parentInfoList[1].tell) {
      hasMother = true
    }
    for (const item of relatives) {
      if (!item.name || !item.tell) {
        hasOther = false
        break
      } else {
        hasOther = true
      }
    }
    if (hasFather || hasMother || hasOther) {
      this.setState({
        canSubmit: true
      })
    }
  }

  render() {
    const { parentInfoList, relatives, canSubmit } = this.state
    return (
      <View className='parents-info'>
        <View className='content'>
          {/* 父亲信息 */}
          <View className='info-block'>
            <View className='title-line'>
              <View className='icon' />
              <Text className='title'>父亲信息</Text>
            </View>
            <View className='item'>
              <View className='label'>父亲姓名</View>
              <Input
                className='input'
                placeholder='请输入父亲姓名'
                placeholderClass='placeholder'
                value={parentInfoList[0].name}
                onInput={(e: any) =>
                  this.changParents(0, 'name', e.detail.value)
                }
              />
            </View>
            <View className='item'>
              <View className='label'>电话</View>
              <Input
                className='input'
                type='number'
                maxLength={11}
                placeholder='请输入父亲电话'
                placeholderClass='placeholder'
                value={parentInfoList[0].tell}
                onInput={(e: any) =>
                  this.changParents(0, 'tell', e.detail.value)
                }
              />
            </View>
            <View className='item'>
              <View className='label'>工作单位</View>
              <Input
                className='input'
                placeholder='请输入父亲工作单位（没有填“无”）'
                placeholderClass='placeholder'
                value={parentInfoList[0].workUnits}
                onInput={(e: any) =>
                  this.changParents(0, 'workUnits', e.detail.value)
                }
              />
            </View>
            <View className='item'>
              <View className='label'>部门</View>
              <Input
                className='input'
                placeholder='请输入父亲部门（没有填“无”）'
                placeholderClass='placeholder'
                value={parentInfoList[0].dep}
                onInput={(e: any) =>
                  this.changParents(0, 'dep', e.detail.value)
                }
              />
            </View>
            <View className='item'>
              <View className='label'>座机电话</View>
              <Input
                className='input'
                type='number'
                maxLength={12}
                placeholder='请输入父亲座机电话（没有填“无”）'
                placeholderClass='placeholder'
                value={parentInfoList[0].workUnitsTell}
                onInput={(e: any) =>
                  this.changParents(0, 'workUnitsTell', e.detail.value)
                }
              />
            </View>
          </View>
          {/* 母亲信息 */}
          <View className='info-block'>
            <View className='title-line'>
              <View className='icon' />
              <Text className='title'>母亲信息</Text>
            </View>
            <View className='item'>
              <View className='label'>母亲姓名</View>
              <Input
                className='input'
                placeholder='请输入母亲姓名'
                placeholderClass='placeholder'
                value={parentInfoList[1].name}
                onInput={(e: any) =>
                  this.changParents(1, 'name', e.detail.value)
                }
              />
            </View>
            <View className='item'>
              <View className='label'>电话</View>
              <Input
                className='input'
                type='number'
                maxLength={11}
                placeholder='请输入母亲电话'
                placeholderClass='placeholder'
                value={parentInfoList[1].tell}
                onInput={(e: any) =>
                  this.changParents(1, 'tell', e.detail.value)
                }
              />
            </View>
            <View className='item'>
              <View className='label'>工作单位</View>
              <Input
                className='input'
                placeholder='请输入母亲工作单位（没有填“无”）'
                placeholderClass='placeholder'
                value={parentInfoList[1].workUnits}
                onInput={(e: any) =>
                  this.changParents(1, 'workUnits', e.detail.value)
                }
              />
            </View>
            <View className='item'>
              <View className='label'>部门</View>
              <Input
                className='input'
                placeholder='请输入母亲部门（没有填“无”）'
                placeholderClass='placeholder'
                value={parentInfoList[1].dep}
                onInput={(e: any) =>
                  this.changParents(1, 'dep', e.detail.value)
                }
              />
            </View>
            <View className='item'>
              <View className='label'>座机电话</View>
              <Input
                className='input'
                type='number'
                maxLength={12}
                placeholder='请输入母亲座机电话（没有填“无”）'
                placeholderClass='placeholder'
                value={parentInfoList[1].workUnitsTell}
                onInput={(e: any) =>
                  this.changParents(1, 'workUnitsTell', e.detail.value)
                }
              />
            </View>
          </View>
          {/* 其他 */}
          <View className='info-block'>
            <View className='title-line'>
              <View className='icon' />
              <Text className='title'>其他</Text>
              <View className='add-box' onClick={this.addRelation}>
                <Image src={InfoAdd} className='add-ic' />
              </View>
            </View>
            {relatives.map((item, index) => (
              <View className='relative-block' key={`relative${index}`}>
                <View className='sub-title'>
                  <Text className='title'>亲属{index + 1}</Text>
                  <View
                    className='del-box'
                    onClick={() => this.delRelation(index)}
                  >
                    <Text className='txt'>删除</Text>
                  </View>
                </View>
                <View className='item'>
                  <View className='label'>与儿童关系</View>
                  <Picker
                    mode='selector'
                    range={newrRelations}
                    value={item.relations}
                    rangeKey='name'
                    onChange={e => this.changeRelation(e, index)}
                    onCancel={() => {
                      this.closePan(index)
                    }}
                  >
                    <View
                      className='picker'
                      onClick={() => this.openPan(index)}
                    >
                      <Text>
                        {item.relationName ||
                          (newrRelations.filter(
                            it => it.value === item.relations
                          ).length &&
                            newrRelations.filter(
                              it => it.value === item.relations
                            )[0].name)}
                      </Text>
                      <Image
                        src={TriDown}
                        className={item.isUp ? 'tri-ic tri-up' : 'tri-ic'}
                      />
                    </View>
                  </Picker>
                </View>
                <View className='item'>
                  <View className='label'>姓名</View>
                  <Input
                    className='input'
                    placeholder='请输入姓名'
                    placeholderClass='placeholder'
                    value={item.name}
                    onInput={e =>
                      this.otherChange('name', e.detail.value, index)
                    }
                  />
                </View>
                <View className='item'>
                  <View className='label'>电话</View>
                  <Input
                    className='input'
                    type='number'
                    maxLength={11}
                    placeholder='请输入电话'
                    placeholderClass='placeholder'
                    value={item.tell}
                    onInput={e =>
                      this.otherChange('tell', e.detail.value, index)
                    }
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
        <Button
          className={canSubmit ? 'btn pramary-buttom' : 'btn forbidden-buttom'}
          onClick={this.confirm}
        >
          确定
        </Button>
      </View>
    )
  }
}

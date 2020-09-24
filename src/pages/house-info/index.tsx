import Taro, { Component, Config } from '@tarojs/taro'
import {
  View,
  Text,
  Image,
  Picker,
  Input,
  RadioGroup,
  Radio,
  Button
} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { namespace } from '@/models/module/house-info'
import { namespace as commonSpace } from '@/models/module/common'
import { namespace as checkSpace } from '@/models/module/check'
import { houseRelations, hasInfo } from '@/asset/commonData'
import { TriDown, InfoAdd } from '@/asset/images'
import { FilePicker } from '@/components'
import './index.less'

interface IFile {
  id?: string
  fileId: string
  sortNum: number
  childType: number
  subType: number
  type: number
}
interface IPeople {
  id?: string
  name: string // 名称
  value: string // 值
  peopleName: string // 名字
  isUp: boolean // 面板是否展开
}
interface IProps {
  regionAddList: any[]
  currentId: string
  editData: { [key: string]: any }
  dispatch: IDispatch
}
interface IState {
  isUp1: boolean
  isUp2: boolean
  region: { [key: string]: any } // 小区
  address: string // 房产详细地址
  inTime: string // 入住时间
  hasProof: string // 是否有房产证
  houseHoner: IPeople[] // 房产权利人
  relation: number // 房产权利人与儿童的关系:1为包含其他关系，需去学校面对面审核 2为只包含父亲或母亲，上传儿童出生证明 3为父母双方，上传出生证明和结婚证原件
  fileList: IFile[] // 所有图片数组
  canSubmit: boolean
}
@connect((models: IStore) => {
  return {
    ...models[namespace],
    ...models[commonSpace],
    ...models[checkSpace]
  } as IProps
})
export default class Index extends Component<IProps, IState> {
  state = {
    isUp1: false,
    isUp2: false,
    region: {
      name: '',
      id: ''
    },
    inTime: '',
    address: '',
    hasProof: '1', // 默认有房产证
    houseHoner: [
      {
        name: houseRelations[0].name,
        value: houseRelations[0].value,
        peopleName: '',
        isUp: false
      }
    ],
    relation: 2,
    fileList: [],
    canSubmit: false
  }
  config: Config = {
    navigationBarTitleText: '房产信息'
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    const { id, isEdit } = this.$router.params
    await this.props.dispatch({
      type: `${namespace}/getRegionAddList`
    })
    if (isEdit) {
      await this.props.dispatch({
        type: `${namespace}/getEntranceHouseInfo`,
        payload: {
          id
        }
      })
      // 编辑时数据初始化
      const { editData, regionAddList } = this.props
      const {
        address,
        communityId,
        houseFileList,
        housePeopleList,
        inTime,
        type
      } = editData
      // 房产权利人
      const housePeople: IPeople[] = []
      housePeopleList.map(item => {
        const relationItem = houseRelations.find(
          it => it.value === item.relation
        )
        housePeople.push({
          id: item.id,
          name: relationItem ? relationItem.name : '',
          value: relationItem ? relationItem.value : '',
          peopleName: item.name,
          isUp: false
        })
      })
      // 房产权利人与儿童的关系
      this.checkRelation(housePeople)
      this.setState({
        address,
        inTime: inTime.split(' ')[0],
        region: regionAddList.find(it => it.id === communityId),
        hasProof: type === 1 ? '1' : '2',
        fileList: houseFileList,
        houseHoner: housePeople
      })
    }
  }

  /**
   * 图片上传
   * type 类型：1-房产证、2-没有房产证、3-结婚证、4-出生证明
   * subType 子类型：5-购房合同、6-贷款抵押合同、7-房屋登记证明（在type=2时使用,其他默认传8）
   * childType subType为5时的子类型：1-封面、2-甲乙双反页面、3-坐落地址、4-结房日、5合同鲜页、6-签字页 （其他默认为0）
   */
  fileChange = (type: number, subType = 8, childType = 0) => (fstate: any) => {
    const { fileList } = this.state
    const oldArr = fileList.filter((it: IFile) => it.id)
    const nowArr = fileList.filter((it: IFile) => !it.id)
    let newArr: IFile[] = []
    if (childType === 0 && subType === 8) {
      newArr = nowArr.filter((it: IFile) => it.type != type)
    } else if (childType === 0 && subType !== 8) {
      newArr = nowArr.filter((it: IFile) => it.subType != subType)
    } else {
      newArr = nowArr.filter((it: IFile) => it.childType != childType)
    }
    if (fstate.files.length) {
      fstate.files.map(it =>
        newArr.push({
          childType,
          subType,
          type,
          fileId: it.source,
          sortNum: 0
        })
      )
    }
    this.setState(
      // @ts-ignore
      {
        fileList: [...newArr, ...oldArr]
      },
      () => {
        this.changeSubmit()
      }
    )
  }

  //  编辑时删除已有图片
  delFile = (id: string) => {
    const { fileList } = this.state
    let newArr = [...fileList]
    newArr = newArr.filter((it: IFile) => it.id != id)
    if (newArr.length < fileList.length) {
      this.props.dispatch({
        type: `${namespace}/delHouseFile`,
        payload: {
          id
        },
        callback: () => {
          this.setState(
            {
              fileList: newArr
            },
            () => {
              this.changeSubmit()
            }
          )
        }
      })
    }
  }

  // 增加房产权利人
  addPeople = () => {
    const { houseHoner } = this.state
    const newArr = [
      ...houseHoner,
      {
        name: houseRelations[0].name,
        value: houseRelations[0].value,
        peopleName: '',
        isUp: false
      }
    ]
    this.setState(
      {
        houseHoner: newArr,
        canSubmit: false
      },
      () => {
        this.checkRelation()
      }
    )
  }

  // 删除房产权利人
  delPeople = (index: number) => {
    const { houseHoner } = this.state
    if (houseHoner.length === 1) {
      Taro.showToast({
        title: '必须至少有一个房产权利人！',
        icon: 'none'
      })
      return
    }
    Taro.showModal({
      title: '',
      content: '确定删除该房产权利人吗？',
      confirmColor: '#EB6655'
    }).then(res => {
      if (res.confirm) {
        const item: IPeople = houseHoner[index]
        if (item.id) {
          // 如果存在id则是删除库中已有联系人
          this.props.dispatch({
            type: `${namespace}/delEntranceHousePeople`,
            payload: {
              id: item.id
            },
            callback: () => {
              this.delMethod(index)
            }
          })
        } else {
          this.delMethod(index)
        }
      }
    })
  }

  delMethod = (index: number) => {
    const { houseHoner } = this.state
    const newArr = [...houseHoner]
    newArr.splice(index, 1)
    this.setState(
      {
        houseHoner: newArr
      },
      () => {
        this.checkRelation()
      }
    )
  }

  // 更改房产权利人
  changePeople = (e: any, index: number) => {
    const { houseHoner } = this.state
    const newArr = [...houseHoner]
    newArr[index].value = houseRelations[parseInt(e.detail.value)].value
    newArr[index].name = houseRelations[parseInt(e.detail.value)].name
    this.setState(
      {
        houseHoner: newArr
      },
      () => {
        this.checkRelation()
      }
    )
  }

  // 修改房产权利人姓名
  houseNameChange = (e: any, index: number) => {
    const { houseHoner } = this.state
    const newArr = [...houseHoner]
    newArr[index].peopleName = e.detail.value
    newArr[index].isUp = false
    this.setState(
      {
        houseHoner: newArr
      },
      () => {
        this.changeSubmit()
      }
    )
  }

  // 关闭房产权利人选择面板
  closePan = (index: number) => {
    const { houseHoner } = this.state
    const newArr = [...houseHoner]
    newArr[index].isUp = false
    this.setState({
      houseHoner: newArr
    })
  }

  // 打开房产权利人面板
  openPan = (index: number) => {
    const { houseHoner } = this.state
    const newArr = [...houseHoner]
    newArr[index].isUp = true
    this.setState({
      houseHoner: newArr
    })
  }

  confirm = () => {
    if (!this.state.canSubmit) return
    const { currentId, editData } = this.props
    const { isEdit, id } = this.$router.params
    const {
      region,
      inTime,
      address,
      hasProof,
      houseHoner,
      fileList,
      relation
    } = this.state
    let houseArr = [...houseHoner]
    let fileArr = [...fileList]
    // 筛选房产情况图片
    if (hasProof === '1') {
      // 有房产证
      fileArr = fileArr.filter((it: IFile) => it.type != 2)
    } else {
      // 无房产证
      fileArr = fileArr.filter((it: IFile) => it.type != 1)
    }
    // 筛选儿童证明信息
    if (relation === 1) {
      // 其他关系，不需要出生证明和结婚证
      fileArr = fileArr.filter((it: IFile) => it.type !== 3)
      fileArr = fileArr.filter((it: IFile) => it.type !== 4)
    } else if (relation === 2) {
      //单亲关系，不需要结婚证明
      fileArr = fileArr.filter((it: IFile) => it.type !== 3)
    }
    if (isEdit) {
      // 编辑时只上传新增的房产权利人，原有的不传
      houseArr = houseHoner.filter((it: IPeople) => !it.id)
      fileArr = fileArr.filter((it: IPeople) => !it.id)
    }
    const housePeopleList = houseArr.map(it => ({
      name: it.peopleName,
      relation: it.value
    }))
    const param = {
      inTime,
      address,
      housePeopleList,
      fileList: fileArr,
      communityId: region.id,
      type: parseInt(hasProof),
      isMulti: houseHoner.length > 1 ? 2 : 1,
      appliId: currentId || id
    }
    if (isEdit && editData && editData.id) {
      this.props.dispatch({
        type: `${namespace}/updateEntranceHouse`,
        payload: {
          ...param,
          status: 1,
          id: editData.id || ''
        },
        callback: () => {
          this.props.dispatch({
            type: `${checkSpace}/getItemStatus`,
            payload: {
              id
            }
          })
        }
      })
    } else {
      this.props.dispatch({
        type: `${namespace}/createEntranceHouse`,
        payload: param,
        callback: () => {
          if (isEdit) {
            Taro.navigateBack()
          } else {
            Taro.redirectTo({
              url: '/pages/timeline/index?step=2'
            })
          }
        }
      })
    }
  }

  // 判断房产权利人与儿童的关系
  checkRelation = (peopleArr: IPeople[] = this.state.houseHoner) => {
    let relation = 1
    const otherArr = peopleArr.filter(it => it.value === '3')
    const fatherrArr = peopleArr.filter(it => it.value === '1')
    const moherrArr = peopleArr.filter(it => it.value === '2')
    if (otherArr.length) {
      // 其他关系，不需要出生证明和结婚证
      relation = 1
    } else {
      if (fatherrArr.length && moherrArr.length) {
        relation = 3
      } else if (fatherrArr.length || moherrArr.length) {
        // 单亲 不需要结婚证
        relation = 2
      }
    }
    this.setState(
      {
        relation
      },
      () => {
        this.changeSubmit()
      }
    )
  }

  // 判断是否可以提交
  changeSubmit = () => {
    const {
      region,
      inTime,
      address,
      hasProof,
      houseHoner,
      fileList,
      relation
    } = this.state
    // debugger
    // 基本信息判断
    if (!region || !inTime || !address) {
      this.setState({
        canSubmit: false
      })
      return
    }
    // 房产权利人判断
    const honerArr: number[] = []
    houseHoner.map((it: IPeople) => {
      const arr: any[] = Object.keys(it).filter(v => !it[v])
      if (arr.length <= 1) {
        // 无空值
        honerArr.push(1)
      } else {
        // 有空值
        honerArr.push(0)
      }
    })
    const honerFlag = honerArr.indexOf(0) > -1 ? false : true
    if (!honerFlag) {
      this.setState({
        canSubmit: false
      })
      return
    }
    // 房产信息判断
    let houseFlag = false
    if (hasProof === '1') {
      // 有房产证
      if (fileList.filter((it: IFile) => it.type === 1).length) {
        houseFlag = true
      }
    } else {
      if (
        fileList.filter((it: IFile) => it.subType === 5).length >= 6 &&
        fileList.filter((it: IFile) => it.subType === 6).length &&
        fileList.filter((it: IFile) => it.subType === 7).length
      ) {
        houseFlag = true
      }
    }
    if (!houseFlag) {
      this.setState({
        canSubmit: false
      })
      return
    }
    // 房产权利人图片判断
    let peopleFlag = false
    if (relation === 2) {
      // 上传出生证明
      if (fileList.filter((it: IFile) => it.type === 4).length) {
        peopleFlag = true
      }
    } else if (relation === 3) {
      if (
        fileList.filter((it: IFile) => it.type === 3).length &&
        fileList.filter((it: IFile) => it.type === 4).length
      ) {
        peopleFlag = true
      }
    }
    this.setState({
      canSubmit: peopleFlag
    })
  }

  render() {
    const { regionAddList, editData } = this.props
    const regionArr = regionAddList.filter(it => it.parentId === '0')
    const {
      isUp1,
      isUp2,
      region,
      inTime,
      address,
      hasProof,
      houseHoner,
      relation,
      fileList,
      canSubmit
    } = this.state
    // const { isEdit } = this.$router.params
    return (
      <View className='house-info'>
        <View className='content'>
          {/* 房产信息 */}
          <View className='info-block'>
            <View className='title-line'>
              <View className='icon' />
              <Text className='title'>房产信息</Text>
            </View>
            <View className='item'>
              <View className='label'>入住小区</View>
              <Picker
                mode='selector'
                range={regionArr}
                value={
                  region && region.id
                    ? regionArr.findIndex(it => (it.id = region.id))
                    : 0
                }
                rangeKey='name'
                onChange={e =>
                  this.setState({
                    region: regionArr[parseInt(e.detail.value)]
                  })
                }
                onCancel={() => {
                  this.setState({
                    isUp1: false
                  })
                }}
              >
                <View
                  className='picker'
                  onClick={() =>
                    this.setState({
                      isUp1: true
                    })
                  }
                >
                  <Text>{region.name}</Text>
                  <Image
                    src={TriDown}
                    className={isUp1 ? 'tri-ic tri-up' : 'tri-ic'}
                  />
                </View>
              </Picker>
            </View>
            <View className='item'>
              <View className='label'>入住时间</View>
              <Picker
                mode='date'
                value={inTime}
                onChange={e =>
                  this.setState({
                    inTime: e.detail.value
                  })
                }
                onCancel={() => {
                  this.setState({
                    isUp2: false
                  })
                }}
              >
                <View
                  className='picker'
                  onClick={() =>
                    this.setState({
                      isUp2: true
                    })
                  }
                >
                  <Text>{inTime}</Text>
                  <Image
                    src={TriDown}
                    className={isUp2 ? 'tri-ic tri-up' : 'tri-ic'}
                  />
                </View>
              </Picker>
            </View>
            <View className='item'>
              <View className='label'>房产坐落地址</View>
              <Input
                className='input'
                placeholder='请输入房产坐落地址'
                placeholderClass='placeholder'
                value={address}
                onInput={e => {
                  this.setState({
                    address: e.detail.value
                  })
                }}
              />
            </View>
          </View>
          {/* 房产情况 */}
          <View className='info-block'>
            <View className='title-line'>
              <View className='icon' />
              <Text className='title'>房产情况</Text>
            </View>
            <View className='item'>
              <View className='label'>有无房产证</View>
              <RadioGroup
                onChange={e =>
                  this.setState({
                    hasProof: e.detail.value
                  })
                }
              >
                {hasInfo.map(item => (
                  <Radio
                    key={item.value}
                    value={item.value}
                    color='#5F89FA'
                    className='radio'
                    checked={hasProof === item.value ? true : false}
                  >
                    {item.name}
                  </Radio>
                ))}
              </RadioGroup>
            </View>
            {hasProof === '1' ? (
              <View className='item'>
                <View className='label'>房产证所有页</View>
                <FilePicker
                  count={99}
                  onChange={this.fileChange(1)}
                  imgs={fileList.filter((it: IFile) => it.id && it.type === 1)}
                  delFile={this.delFile}
                />
              </View>
            ) : (
              <View>
                <View className='title-line' style={{ marginTop: '60rpx' }}>
                  <Text className='title'>购房合同</Text>
                </View>
                <View className='item'>
                  <View className='label'>封面</View>
                  <FilePicker
                    onChange={this.fileChange(2, 5, 1)}
                    imgs={fileList.filter(
                      (it: IFile) => it.id && it.childType === 1
                    )}
                    delFile={this.delFile}
                  />
                </View>
                <View className='item'>
                  <View className='label'>买卖甲乙双方信息页</View>
                  <FilePicker
                    onChange={this.fileChange(2, 5, 2)}
                    imgs={fileList.filter(
                      (it: IFile) => it.id && it.childType === 2
                    )}
                    delFile={this.delFile}
                  />
                </View>
                <View className='item'>
                  <View className='label'>房屋坐落地址信息页</View>
                  <FilePicker
                    onChange={this.fileChange(2, 5, 3)}
                    imgs={fileList.filter(
                      (it: IFile) => it.id && it.childType === 3
                    )}
                    delFile={this.delFile}
                  />
                </View>
                <View className='item'>
                  <View className='label'>结房日期页</View>
                  <FilePicker
                    onChange={this.fileChange(2, 5, 4)}
                    imgs={fileList.filter(
                      (it: IFile) => it.id && it.childType === 4
                    )}
                    delFile={this.delFile}
                  />
                </View>
                <View className='item'>
                  <View className='label'>合同鲜章页</View>
                  <FilePicker
                    onChange={this.fileChange(2, 5, 5)}
                    imgs={fileList.filter(
                      (it: IFile) => it.id && it.childType === 5
                    )}
                    delFile={this.delFile}
                  />
                </View>
                <View className='item'>
                  <View className='label'>购房人签字确认页</View>
                  <FilePicker
                    onChange={this.fileChange(2, 5, 6)}
                    imgs={fileList.filter(
                      (it: IFile) => it.id && it.childType === 6
                    )}
                    delFile={this.delFile}
                  />
                </View>
                <View className='title-line' style={{ marginTop: '60rpx' }}>
                  <Text className='title'>房屋抵押贷款合同 </Text>
                </View>
                <View className='item'>
                  <View className='label'>贷款/抵押合同所有页</View>
                  <FilePicker
                    count={99}
                    onChange={this.fileChange(2, 6)}
                    imgs={fileList.filter(
                      (it: IFile) => it.id && it.subType === 6
                    )}
                    delFile={this.delFile}
                  />
                </View>
                <View className='title-line' style={{ marginTop: '60rpx' }}>
                  <Text className='title'>房屋登记信息查询</Text>
                </View>
                <View className='item'>
                  <View className='label'>房屋登记信息查询证明</View>
                  <FilePicker
                    count={99}
                    onChange={this.fileChange(2, 7)}
                    imgs={fileList.filter(
                      (it: IFile) => it.id && it.subType === 7
                    )}
                    delFile={this.delFile}
                  />
                </View>
              </View>
            )}
          </View>
          {/* 房产权利人信息 */}
          <View className='info-block'>
            <View className='title-line'>
              <View className='icon' />
              <Text className='title'>房产权利人信息</Text>
              <View className='add-box' onClick={this.addPeople}>
                <Image src={InfoAdd} className='add-ic' />
              </View>
            </View>
            {houseHoner.map((item, index) => (
              <View className='item' key={`honer${index}`}>
                <View className='label'>
                  <Text>房产权利人</Text>
                  <Text className='txt' onClick={() => this.delPeople(index)}>
                    删除
                  </Text>
                </View>
                <Input
                  className='input'
                  placeholder='房产权利人姓名'
                  placeholderClass='placeholder'
                  value={item.peopleName}
                  onInput={e => this.houseNameChange(e, index)}
                />
                <Picker
                  mode='selector'
                  range={houseRelations}
                  value={0}
                  rangeKey='name'
                  onChange={e => this.changePeople(e, index)}
                  onCancel={() => {
                    this.closePan(index)
                  }}
                  style={{ marginTop: '40rpx' }}
                >
                  <View className='picker' onClick={() => this.openPan(index)}>
                    <Text>{item.name}</Text>
                    <Image
                      src={TriDown}
                      className={item.isUp ? 'tri-ic tri-up' : 'tri-ic'}
                    />
                  </View>
                </Picker>
              </View>
            ))}
            {relation === 1 && (
              <View className='item'>
                <View className='label'>
                  购房人不是就读儿童直接监护人的，在
                  以上条件的基础上需携带可以佐证就读
                  儿童满足三对口的所有资料原件到学校现场进行面对面审核！
                </View>
              </View>
            )}
            {relation === 3 && (
              <View className='item'>
                <View className='label'>结婚证原件</View>
                <FilePicker
                  count={2}
                  onChange={this.fileChange(3)}
                  imgs={fileList.filter((it: IFile) => it.id && it.type === 3)}
                  delFile={this.delFile}
                />
              </View>
            )}
            {(relation === 2 || relation === 3) && (
              <View className='item'>
                <View className='label'>儿童出生证明</View>
                <FilePicker
                  onChange={this.fileChange(4)}
                  imgs={fileList.filter((it: IFile) => it.id && it.type === 4)}
                  delFile={this.delFile}
                />
              </View>
            )}
          </View>
          {/* 修改提示 */}
          {editData && editData.feedback ? (
            <View className='info-block'>
              <View className='title-line'>
                <View className='icon-err' />
                <Text className='title'>修改提示</Text>
              </View>
              <View className='err-txt'>{editData.feedback}</View>
            </View>
          ) : null}
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

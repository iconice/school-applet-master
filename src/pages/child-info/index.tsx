import Taro, { Component, Config } from '@tarojs/taro'
import {
  View,
  Text,
  Image,
  Input,
  RadioGroup,
  Radio,
  Picker,
  Button
} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { namespace } from '@/models/module/child-info'
import { namespace as commonSpace } from '@/models/module/common'
import { namespace as checkSpace } from '@/models/module/check'
import { TriDown } from '@/asset/images'
import { genders, relations } from '@/asset/commonData'
import { FilePicker } from '@/components'
import './index.less'

interface IProps {
  currentId: string
  isTrans: boolean
  editData: { [ket: string]: any }
  dispatch: IDispatch
}

interface IState {
  childSex: number // 性别
  childName: string // 儿童姓名
  idCard: string // 儿童身份证号
  childHeadFileId: string // 儿童照片id
  masterName: string // 户主姓名
  relation: object // 户主和入学孩子的关系
  isUp: boolean
  tell: string // 联系电话号码
  address: string // 户口地址
  masterFileId: string // 户口地址页
  masterInfoFileId: string // 户口信息页
  childInfoFileId: string // 入学儿童信息页
  modifyFileId: string // 户口增减页
  canSubmit: boolean // 是否可以提交
}

@connect((models: IStore) => {
  return {
    ...models[namespace],
    ...models[commonSpace]
  } as IProps
})
export default class Index extends Component<IProps, IState> {
  state = {
    childSex: 1,
    childName: '',
    idCard: '',
    childHeadFileId: '',
    masterName: '',
    relation: relations[0],
    isUp: false,
    tell: '',
    address: '',
    masterFileId: '',
    masterInfoFileId: '',
    childInfoFileId: '',
    modifyFileId: '',
    canSubmit: false
  }
  config: Config = {
    navigationBarTitleText: '儿童户籍信息'
  }

  componentDidMount() {
    const { isEdit } = this.$router.params
    if (isEdit) {
      this.init()
    }
  }

  init = async () => {
    const { id } = this.$router.params
    await this.props.dispatch({
      type: `${namespace}/getEntranceBaseInfo`,
      payload: {
        id
      }
    })
    const { editData } = this.props
    const {
      childSex,
      childName,
      idCard,
      childHeadFileId,
      masterName,
      relation,
      tell,
      address,
      masterFileId,
      masterInfoFileId,
      childInfoFileId,
      modifyFileId
    } = editData
    this.setState(
      {
        childSex,
        childName,
        idCard,
        childHeadFileId,
        masterName,
        relation: relations.filter(it => it.value === relation)[0],
        tell,
        address,
        masterFileId,
        masterInfoFileId,
        childInfoFileId,
        modifyFileId
      },
      () => {
        this.changeSubmit()
      }
    )
  }

  // 确认
  confirm = () => {
    if (!this.state.canSubmit) return
    const { isTrans, currentId, editData } = this.props
    const { id } = this.$router.params
    const {
      childSex,
      childName,
      idCard,
      childHeadFileId,
      masterName,
      relation,
      tell,
      address,
      masterFileId,
      masterInfoFileId,
      childInfoFileId,
      modifyFileId
    } = this.state
    const param = {
      isTrans,
      childSex,
      childName,
      idCard,
      childHeadFileId,
      masterName,
      relation: relation.value,
      tell,
      address,
      masterFileId,
      masterInfoFileId,
      childInfoFileId,
      modifyFileId,
      appliId: currentId || id
    }
    const { isEdit } = this.$router.params
    if (isEdit && editData && editData.id) {
      // 编辑
      this.props.dispatch({
        type: `${namespace}/updateEntranceBase`,
        payload: {
          ...param,
          isTrans: this.$router.params.isTrans,
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
      // 新增
      this.props.dispatch({
        type: `${namespace}/createEntranceBase`,
        payload: param,
        callback: () => {
          if (isEdit) {
            Taro.navigateBack()
          } else {
            Taro.redirectTo({
              url: '/pages/timeline/index?step=1'
            })
          }
        }
      })
    }
  }

  // 判断是否可以提交
  changeSubmit = () => {
    const {
      childName,
      idCard,
      childHeadFileId,
      masterName,
      tell,
      address,
      masterFileId,
      masterInfoFileId,
      childInfoFileId,
      modifyFileId,
      canSubmit
    } = this.state
    const obj = {
      childName,
      idCard,
      childHeadFileId,
      masterName,
      tell,
      address,
      masterFileId,
      masterInfoFileId,
      childInfoFileId,
      modifyFileId
    }
    const arr: any[] = Object.keys(obj).filter(v => !obj[v])
    if (arr.length <= 0) {
      // 无空值
      if (canSubmit) return
      this.setState({
        canSubmit: true
      })
    } else {
      // 有空值
      if (!canSubmit) return
      this.setState({
        canSubmit: false
      })
    }
  }
  // 户籍图片上传
  fileChange = (key: string) => (fstate: any) => {
    this.setState(
      // @ts-ignore
      {
        [key]: fstate.files.length ? fstate.files[0].source : ''
      },
      () => {
        this.changeSubmit()
      }
    )
  }

  // 输入框更改
  inputChange = (key: string, e: any) => {
    this.setState(
      // @ts-ignore
      {
        [key]: e.detail.value
      },
      () => {
        this.changeSubmit()
      }
    )
  }

  render() {
    const {
      childSex,
      childName,
      idCard,
      relation,
      isUp,
      masterName,
      tell,
      address,
      canSubmit,
      childHeadFileId,
      masterFileId,
      masterInfoFileId,
      childInfoFileId,
      modifyFileId
    } = this.state
    const childHeadFileArr = childHeadFileId
      ? [
          {
            id: childHeadFileId,
            fileId: childHeadFileId
          }
        ]
      : []
    const masterFileArr = masterFileId
      ? [
          {
            id: masterFileId,
            fileId: masterFileId
          }
        ]
      : []
    const masterInfoFileArr = masterInfoFileId
      ? [
          {
            id: masterInfoFileId,
            fileId: masterInfoFileId
          }
        ]
      : []
    const childInfoFileArr = childInfoFileId
      ? [
          {
            id: childInfoFileId,
            fileId: childInfoFileId
          }
        ]
      : []
    const modifyFileArr = modifyFileId
      ? [
          {
            id: modifyFileId,
            fileId: modifyFileId
          }
        ]
      : []
    const { isEdit } = this.$router.params
    const { editData } = this.props
    return (
      <View className='child-info'>
        <View className='content'>
          {/* 儿童信息 */}
          <View className='info-block'>
            <View className='title-line'>
              <View className='icon' />
              <Text className='title'>儿童信息</Text>
            </View>
            <View className='item'>
              <View className='label'>姓名</View>
              <Input
                className='input'
                placeholder='请输入儿童姓名'
                placeholderClass='placeholder'
                value={childName}
                onInput={e => this.inputChange('childName', e)}
              />
            </View>
            <View className='item'>
              <View className='label'>性别</View>
              <RadioGroup
                onChange={e =>
                  this.setState({
                    childSex: parseInt(e.detail.value)
                  })
                }
              >
                {genders.map(item => (
                  <Radio
                    key={item.value}
                    value={item.value}
                    color='#5F89FA'
                    className='radio'
                    checked={childSex === parseInt(item.value) ? true : false}
                  >
                    {item.name}
                  </Radio>
                ))}
              </RadioGroup>
            </View>
            <View className='item'>
              <View className='label'>身份证号</View>
              <Input
                className='input'
                placeholder='请输入身份证号'
                placeholderClass='placeholder'
                value={idCard}
                maxLength={18}
                type='idcard'
                onInput={e => this.inputChange('idCard', e)}
              />
            </View>
            <View className='item'>
              <View className='label'>儿童近期免冠2寸照片</View>
              <FilePicker
                onChange={this.fileChange('childHeadFileId')}
                imgs={childHeadFileArr}
              />
            </View>
          </View>
          {/* 户籍信息 */}
          <View className='info-block'>
            <View className='title-line'>
              <View className='icon' />
              <Text className='title'>户籍信息</Text>
            </View>
            <View className='item'>
              <View className='label'>户主姓名</View>
              <Input
                className='input'
                placeholder='请输入户主姓名'
                placeholderClass='placeholder'
                value={masterName}
                onInput={e => this.inputChange('masterName', e)}
              />
            </View>
            <View className='item'>
              <View className='label'>与儿童关系</View>
              <Picker
                mode='selector'
                range={relations}
                value={0}
                rangeKey='name'
                onChange={e =>
                  this.setState({
                    relation: relations[parseInt(e.detail.value)]
                  })
                }
                onCancel={() => {
                  this.setState({
                    isUp: false
                  })
                }}
              >
                <View
                  className='picker'
                  onClick={() =>
                    this.setState({
                      isUp: true
                    })
                  }
                >
                  <Text>{relation.name}</Text>
                  <Image
                    src={TriDown}
                    className={isUp ? 'tri-ic tri-up' : 'tri-ic'}
                  />
                </View>
              </Picker>
            </View>
            <View className='item'>
              <View className='label'>电话</View>
              <Input
                className='input'
                type='number'
                placeholder='请输入电话'
                placeholderClass='placeholder'
                value={tell}
                onInput={e => this.inputChange('tell', e)}
              />
            </View>
            <View className='item'>
              <View className='label'>户口本地址</View>
              <Input
                className='input'
                placeholder='请输入户口本地址'
                placeholderClass='placeholder'
                value={address}
                onInput={e => this.inputChange('address', e)}
              />
            </View>
            <View className='item'>
              <View className='label'>户口地址页</View>
              <FilePicker
                onChange={this.fileChange('masterFileId')}
                imgs={isEdit ? masterFileArr : []}
              />
            </View>
            <View className='item'>
              <View className='label'>户口信息页</View>
              <FilePicker
                onChange={this.fileChange('masterInfoFileId')}
                imgs={masterInfoFileArr}
              />
            </View>
            <View className='item'>
              <View className='label'>户口入学儿童信息页</View>
              <FilePicker
                onChange={this.fileChange('childInfoFileId')}
                imgs={childInfoFileArr}
              />
            </View>
            <View className='item'>
              <View className='label'>户口增减页</View>
              <FilePicker
                onChange={this.fileChange('modifyFileId')}
                imgs={modifyFileArr}
              />
            </View>
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

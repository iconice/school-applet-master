import Taro, { Component, Config } from '@tarojs/taro'
import { View, RadioGroup, Radio, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { namespace } from '@/models/module/viccine-info'
import { namespace as commonSpace } from '@/models/module/common'
import { FilePicker } from '@/components'
import { choices } from '@/asset/commonData'
import './index.less'

interface IFile {
  id?: string
  fileId: string
  sortNum: number
  type: number
}
interface IProps {
  currentId: string
  isTrans: boolean
  editData: { [key: string]: any }
  dispatch: IDispatch
}
interface IState {
  hasPro: string // 是否有接种证明
  fileList: IFile[]
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
    hasPro: '1',
    fileList: [],
    canSubmit: false
  }
  config: Config = {
    navigationBarTitleText: '儿童接种检查'
  }

  componentDidMount() {
    const { isEdit } = this.$router.params
    isEdit && this.init()
  }

  init = async () => {
    const { id } = this.$router.params
    await this.props.dispatch({
      type: `${namespace}/getPreventionInfo`,
      payload: {
        id
      }
    })
    const { editData } = this.props
    const { fileList } = editData
    const hasPro = fileList.filter((it: IFile) => it.type === 1).length
      ? '1'
      : '0'
    this.setState(
      {
        fileList,
        hasPro
      },
      () => {
        this.canSubmit()
      }
    )
  }

  /**
   * 图片上传
   * type 类型：1-查验证明 2-接种证明
   */
  fileChange = (type: number) => (fstate: any) => {
    const { fileList } = this.state
    const oldArr = fileList.filter((it: IFile) => it.id)
    const nowArr = fileList.filter((it: IFile) => !it.id)
    let newArr: IFile[] = []
    newArr = nowArr.filter((it: IFile) => it.type != type)
    if (fstate.files.length) {
      fstate.files.map(it =>
        newArr.push({
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
        this.canSubmit()
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
        type: `${namespace}/delPreventionFile`,
        payload: {
          id
        },
        callback: () => {
          this.setState(
            {
              fileList: newArr
            },
            () => {
              this.canSubmit()
            }
          )
        }
      })
    }
  }

  changeHas = (e: any) => {
    const { value } = e.detail
    let fileArr = [...this.state.fileList]
    if (value === '0') {
      // 没有查验证明
      const Item: IFile[] = fileArr.filter((it: IFile) => it.type === 1)
      if (Item.length) {
        Item.map((it: IFile) => {
          if (it.id) {
            this.delFile(it.id)
          }
        })
      }
      fileArr = fileArr.filter((it: IFile) => it.type != 1)
    }
    this.setState(
      {
        hasPro: value,
        fileList: fileArr
      },
      () => {
        this.canSubmit()
      }
    )
  }

  confirm = () => {
    const { isEdit, id } = this.$router.params
    const { currentId, isTrans, editData } = this.props
    const { fileList } = this.state
    let fileArr = [...fileList]
    if (isEdit) {
      // 编辑时只上传新增的图片，原有的不传
      fileArr = fileArr.filter((it: IFile) => !it.id)
    }
    const param = {
      appliId: currentId || id,
      fileDtos: fileArr
    }
    if (isEdit && editData && editData.id) {
      this.props.dispatch({
        type: `${namespace}/updatePrevention`,
        payload: {
          ...param,
          id: editData.id || '',
          status: 1,
          appliId: id
        }
      })
    } else {
      this.props.dispatch({
        type: `${namespace}/createPrevention`,
        payload: param,
        callback: () => {
          if (isEdit) {
            Taro.navigateBack()
          } else {
            if (isTrans) {
              Taro.redirectTo({
                url: '/pages/timeline/index?step=3'
              })
            } else {
              Taro.switchTab({
                url: '/pages/check-result/index'
              })
            }
          }
        }
      })
    }
  }

  canSubmit = () => {
    const { fileList, hasPro } = this.state
    const fileArr1 = fileList.filter((it: IFile) => it.type === 2) // 接种证明
    const fileArr2 = fileList.filter((it: IFile) => it.type === 1) // 查验证明
    let flag = false
    if (!fileArr1.length) {
      flag = false
    } else {
      if (hasPro === '0' || fileArr2.length) {
        flag = true
      } else {
        flag = false
      }
    }
    this.setState({
      canSubmit: flag
    })
  }

  render() {
    const { hasPro, fileList, canSubmit } = this.state
    const { editData } = this.props
    return (
      <View className='viccine-info'>
        <View className='content'>
          <View className='info-block'>
            <View className='item'>
              <View className='label'>预防接种证所有页照片</View>
              <FilePicker
                count={99}
                onChange={this.fileChange(2)}
                imgs={fileList.filter((it: IFile) => it.id && it.type === 2)}
                delFile={this.delFile}
              />
            </View>
            <View className='item'>
              <View className='label'>是否完成预防接种查验</View>
              <RadioGroup onChange={(e: any) => this.changeHas(e)}>
                {choices.map(item => (
                  <Radio
                    key={item.value}
                    value={item.value}
                    color='#5F89FA'
                    className='radio'
                    checked={hasPro === item.value ? true : false}
                  >
                    {item.name}
                  </Radio>
                ))}
              </RadioGroup>
            </View>

            {hasPro === '0' ? (
              <View className='info'>
                请到对应小区物业处领取学校寄发的接
                种查验联系函，并去东南医院完成接种查验。
              </View>
            ) : (
              <View className='item'>
                <View className='label'>东南医院预防接种查验证明</View>
                <FilePicker
                  onChange={this.fileChange(1)}
                  imgs={fileList.filter((it: IFile) => it.id && it.type === 1)}
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

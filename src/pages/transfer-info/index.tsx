import Taro, { Component, Config } from '@tarojs/taro'
import {
  View,
  Text,
  Input,
  RadioGroup,
  Radio,
  Button
} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { namespace } from '@/models/module/transfer-info'
import { namespace as commonSpace } from '@/models/module/common'
import { namespace as checkSpace } from '@/models/module/check'
import { FilePicker } from '@/components'
import { healthInfo, hasInfo } from '@/asset/commonData'
import './index.less'

interface IFile {
  id?: string
  fileId: string
  type: number
}
interface IState {
  fileDtos: IFile[]
  isHealth: string // 是否健康
  isHealthForm: string // 是否有体检报告
  outSchoolName: string // 转出学校名称
  studentNum: string // 学籍号
  canSubmit: boolean // 是否可以提交
}

interface IProps {
  currentId: string
  editData: { [key: string]: any }
  dispatch: IDispatch
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
    fileDtos: [],
    isHealth: '1',
    isHealthForm: '1',
    outSchoolName: '',
    studentNum: '',
    canSubmit: false
  }

  config: Config = {
    navigationBarTitleText: '转学儿童信息'
  }

  componentDidMount() {
    this.init()
  }

  init = async () => {
    const { id, isEdit } = this.$router.params
    if (!isEdit) return
    await this.props.dispatch({
      type: `${namespace}/getTransInfo`,
      payload: {
        id
      }
    })
    const { editData } = this.props
    const {
      entranceStudentFileList,
      isHealth,
      isHealthForm,
      outSchoolName,
      studentNum
    } = editData
    this.setState(
      {
        outSchoolName,
        studentNum,
        fileDtos: entranceStudentFileList,
        isHealth: isHealth.toString(),
        isHealthForm: isHealthForm.toString()
      },
      () => {
        this.changeSubmit()
      }
    )
  }

  // 图片上传
  fileChange = (type: number) => (fstate: any) => {
    if (!fstate.files.length) return
    const { fileDtos } = this.state
    const newArr: IFile[] = [...fileDtos.filter((it: IFile) => it.id)]
    fstate.files.map(it =>
      newArr.push({
        type,
        fileId: it.source
      })
    )
    this.setState(
      // @ts-ignore
      {
        fileDtos: newArr
      },
      () => {
        this.changeSubmit()
      }
    )
  }

  // 编辑时删除已有图片
  delFile = (id: string) => {
    const { fileDtos } = this.state
    let newArr = [...fileDtos]
    newArr = newArr.filter((it: IFile) => it.id != id)
    this.setState(
      {
        fileDtos: newArr
      },
      () => {
        this.changeSubmit()
      }
    )
  }

  confirm = () => {
    const {
      fileDtos,
      isHealth,
      isHealthForm,
      outSchoolName,
      studentNum
    } = this.state
    const { currentId, editData } = this.props
    const { id, isEdit } = this.$router.params
    const param = {
      fileDtos,
      outSchoolName,
      studentNum,
      isHealth: parseInt(isHealth),
      isHealthForm: parseInt(isHealthForm),
      appliId: currentId || id
    }
    if (isEdit && editData.id) {
      this.props.dispatch({
        type: `${namespace}/updateTrans`,
        payload: {
          ...param,
          id: editData.id
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
        type: `${namespace}/createTrans`,
        payload: param,
        callback: () => {
          Taro.redirectTo({
            url: '/pages/timeline/index?step=4'
          })
        }
      })
    }
  }

  changeSubmit = () => {
    const { fileDtos, outSchoolName, studentNum } = this.state
    const flag1 = fileDtos.filter((it: IFile) => it.type === 1).length
      ? true
      : false
    const flag2 = fileDtos.filter((it: IFile) => it.type === 2).length
      ? true
      : false
    const flag3 = fileDtos.filter((it: IFile) => it.type === 3).length
      ? true
      : false
    if (
      !outSchoolName.length ||
      !studentNum.length ||
      !flag1 ||
      !flag2 ||
      !flag3
    ) {
      this.setState({
        canSubmit: false
      })
    } else {
      this.setState({
        canSubmit: true
      })
    }
  }

  hasChange = e => {
    const { isHealthForm, fileDtos } = this.state
    if (e.detail.value != isHealthForm) {
      const newFiles = fileDtos.filter((it: IFile) => it.type != 3)
      this.setState(
        {
          fileDtos: newFiles,
          isHealthForm: e.detail.value
        },
        () => {
          this.changeSubmit()
        }
      )
    }
  }

  render() {
    const {
      isHealth,
      isHealthForm,
      outSchoolName,
      studentNum,
      canSubmit,
      fileDtos
    } = this.state
    const { editData } = this.props
    return (
      <View className='transfer-info'>
        <View className='content'>
          <View className='info-block'>
            <View className='title-line'>
              <View className='icon' />
              <Text className='title'>儿童信息</Text>
            </View>
            <View className='item'>
              <View className='label'>转出学校名称</View>
              <Input
                className='input'
                placeholder='请输入转出学校名称'
                placeholderClass='placeholder'
                value={outSchoolName}
                onInput={e => {
                  this.setState({
                    outSchoolName: e.detail.value
                  })
                }}
              />
            </View>
            <View className='item'>
              <View className='label'>素质报告单/成绩单/班主任评语</View>
              <FilePicker
                count={99}
                onChange={this.fileChange(1)}
                imgs={fileDtos.filter((it: IFile) => it.id && it.type === 1)}
                delFile={this.delFile}
              />
            </View>
            <View className='item'>
              <View className='label'>学籍号码</View>
              <Input
                className='input'
                placeholder='请输入学籍号码'
                placeholderClass='placeholder'
                value={studentNum}
                onInput={e => {
                  this.setState({
                    studentNum: e.detail.value
                  })
                }}
              />
            </View>
            <View className='item'>
              <View className='label'>转出学校学籍卡（需加盖学籍章/公章）</View>
              <FilePicker
                count={99}
                onChange={this.fileChange(2)}
                imgs={fileDtos.filter((it: IFile) => it.id && it.type === 2)}
                delFile={this.delFile}
              />
            </View>
            <View className='item'>
              <View className='label'>健康状况</View>
              <RadioGroup
                onChange={e =>
                  this.setState({
                    isHealth: e.detail.value
                  })
                }
              >
                {healthInfo.map(item => (
                  <Radio
                    key={item.value}
                    value={item.value}
                    color='#5F89FA'
                    className='radio'
                    checked={isHealth === item.value ? true : false}
                  >
                    {item.name}
                  </Radio>
                ))}
              </RadioGroup>
            </View>
            <View className='item'>
              <View className='label'>有无学校体检表</View>
              <RadioGroup onChange={e => this.hasChange(e)}>
                {hasInfo.map(item => (
                  <Radio
                    key={item.value}
                    value={item.value}
                    color='#5F89FA'
                    className='radio'
                    checked={isHealthForm === item.value ? true : false}
                  >
                    {item.name}
                  </Radio>
                ))}
              </RadioGroup>
            </View>
            {isHealthForm === '1' ? (
              <View className='item'>
                <View className='label'>学校体检表</View>
                <FilePicker
                  count={99}
                  onChange={this.fileChange(3)}
                  imgs={fileDtos.filter((it: IFile) => it.id && it.type === 3)}
                  delFile={this.delFile}
                />
              </View>
            ) : (
              <View className='item'>
                <View className='label'>
                  医院入学常规体检报告（二级甲等以上）
                </View>
                <FilePicker
                  count={99}
                  onChange={this.fileChange(3)}
                  imgs={fileDtos.filter((it: IFile) => it.id && it.type === 3)}
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

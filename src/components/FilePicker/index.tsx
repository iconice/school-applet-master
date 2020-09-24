import Taro, { useEffect } from '@tarojs/taro'
import { View, Image, Block } from '@tarojs/components'
import * as icons from '@/asset/images'
import { completeUrl } from '@/utils/tools'
import useUploader from './useUploader'
import './index.less'

interface IImage {
  id: string
  fileId: string
  type?: number
  subType?: number
  childType?: number
  sortNum?: number
}

interface IProps {
  extCls?: string // 额外的样式
  imgs?: IImage[] // 初始图片数组
  count?: number // 最大张数
  size?: number
  beforeUpload?: (f: any) => boolean
  onChange?: (state: any) => any
  delFile?: (id: string) => any
}

const FilePicker = (props: IProps) => {
  const [fstate, actions] = useUploader({
    files: [],
    count: props.count || 1,
    size: props.size || 0,
    beforeUpload: props.beforeUpload || (() => true)
  })

  useEffect(() => {
    props.onChange && props.onChange(fstate)
  }, [fstate])

  // 大图查看
  const scanImg = (index: number) => {
    const urls: string[] = []
    if (props.imgs && props.imgs.length) {
      props.imgs.map(it => urls.push(completeUrl(it.fileId)))
    }
    fstate.files.map(it => urls.push(completeUrl(it.source)))
    Taro.previewImage({
      urls,
      current: index.toString()
    })
  }

  fstate.files = fstate.files ? fstate.files : []
  return (
    <View className={`box ${props.extCls || ''}`}>
      {fstate.files.length < fstate.count &&
        (props.imgs || []).map((item, index) => (
          <View className='item item1' key={item.id}>
            <Image
              className='img'
              src={completeUrl(item.fileId)}
              mode='aspectFill'
              onClick={() => scanImg(index)}
            />
            <Image
              className='close'
              src={icons.PicDel}
              onClick={() =>
                props.delFile ? props.delFile(item.id) : actions.remove(item.id)
              }
            />
          </View>
        ))}
      {fstate.files.map((item, index) => (
        <View className='item item2' key={item.source}>
          <Image
            className='img'
            src={completeUrl(item.source)}
            mode='aspectFill'
            onClick={() =>
              scanImg(index + (props.imgs ? props.imgs.length : 0))
            }
          />
          {!item.finish && (
            <Block>
              <View className='mask' style={{ height: item.percent + '%' }} />
              <View className='percent'>{item.percent}%</View>
            </Block>
          )}
          <Image
            className='close'
            src={icons.PicDel}
            onClick={() => actions.remove(item.source)}
          />
        </View>
      ))}
      {fstate.count >
        fstate.files.length + (props.imgs ? props.imgs.length : 0) && (
        <View className='item item-add' onClick={() => actions.add()}>
          <Image className='plus' src={icons.PicAdd} />
        </View>
      )}
    </View>
  )
}

export default FilePicker

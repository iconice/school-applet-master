import Taro, { Config, PureComponent } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.less'

export default class Index extends PureComponent {
  config: Config = {
    navigationBarTitleText: '招生简章'
  }

  render() {
    return (
      <View className='enrollment-guide'>
        <View className='content'>
          <View className='item'>
            <View className='title'>
              <View className='txt1'>
                01
                <View className='box' />
              </View>
              <View className='txt2'>
                招生范围
                <Image src={require('./triangle.png')} className='tri-img' />
              </View>
            </View>
            <View className='con con1'>
              <View className='sub-title'>
                <View className='circle' />
                <Text>鲁能领秀城</Text>
              </View>
              <View className='con-txt1'>
                <Text>
                  青云路5号，莲池路35号，天文大道3、17、
                  35号，吉庆路54号，兴塘路207号
                </Text>
              </View>
              <View className='sub-title'>
                <View className='circle' />
                <Text>江南小区</Text>
              </View>
              <View className='con-txt1'>
                <Text>玉马路9号</Text>
              </View>
              <View className='sub-title'>
                <View className='circle' />
                <Text>长青湖</Text>
              </View>
              <View className='con-txt1'>
                <Text>玉马路6号</Text>
              </View>
              <View className='sub-title'>
                <View className='circle' />
                <Text>坡领顿</Text>
              </View>
              <View className='con-txt1'>
                <Text>玉马路10号</Text>
              </View>
              <View className='sub-title'>
                <View className='circle' />
                <Text>中交漫山</Text>
              </View>
              <View className='con-txt1'>
                <Text>梨花大道161、451号，漫景路40号</Text>
              </View>
            </View>
          </View>
          <View className='item'>
            <View className='title'>
              <View className='txt1'>
                02
                <View className='box' />
              </View>
              <View className='txt2'>
                报名条件
                <Image src={require('./triangle.png')} className='tri-img' />
              </View>
            </View>
            <View className='con'>
              <View>（一）2019年8月31日前（含31日）年满6周岁的儿童。</View>
              <View>（二）满足“三对口”原则</View>
              <View className='con-txt1'>
                1.适龄儿童与法定监护人户籍一致
                2.户籍登记地与适龄儿童、法定监护人实际居住地一致
                3.居住地与法定监护人房屋产权一致，且均属于我校招生范围
              </View>
              <View className='con-txt2'>
                （三）辖区内居民住宅，6年内同一套住房只接收同一法定监护人合法子女对口入学。
              </View>
            </View>
          </View>
          <View className='item'>
            <View className='title'>
              <View className='txt1'>
                03
                <View className='box' />
              </View>
              <View className='txt2'>
                需提交的资料
                <Image src={require('./triangle.png')} className='tri-img' />
              </View>
            </View>
            <View className='con'>
              <View>1.适龄儿童和其法定监护人的同一户口簿;</View>
              <View>2.适龄儿童法定监护人的房屋产权有效证件；</View>
              <View>3.预防接种证</View>
              <View>4.预防接种查验证明</View>
            </View>
          </View>
          <View className='item'>
            <View className='title'>
              <View className='txt1'>
                04
                <View className='box' />
              </View>
              <View className='txt2'>
                报名材料提交时间
                <Image src={require('./triangle.png')} className='tri-img' />
              </View>
            </View>
            <View className='con'>
              <View className='align-center'>2019年6月20—24日</View>
            </View>
          </View>
          <View className='item'>
            <View className='title'>
              <View className='txt1'>
                05
                <View className='box' />
              </View>
              <View className='txt2'>
                报名材料提交方式
                <Image src={require('./triangle.png')} className='tri-img' />
              </View>
            </View>
            <View className='con'>
              <View>
                1、在物业管理处领取“预防接种查验证联系
                函”，然后执该函件自行前往东南医院开具“预
                防接种查验证明”，一并装入报名资料袋中。
              </View>
              <View>
                2、将报名材料的复印件装在文件袋里（文件袋
                上写上孩子的名字）封袋交至相应小区物业管理
                处，并完善报名登记表。
              </View>
              <View>注：只交报名材料复印件，无需原件。</View>
            </View>
          </View>
          <View className='item'>
            <View className='title'>
              <View className='txt1'>
                06
                <View className='box' />
              </View>
              <View className='txt2'>
                报名材料审核方式
                <Image src={require('./triangle.png')} className='tri-img' />
              </View>
            </View>
            <View className='con'>
              <View>
                （一）家长带上所有材料的原件，亲自前往珊瑚鲁能小学正大门旁的招生办公室进行面对面的核对。
              </View>
              <View>
                （二）材料审核的
                <Text className='con-txt2'>时间安排： </Text>
              </View>
              <View className='con-txt2 align-center'>
                （早上9:00—11:30，下午14:00—16:30）
              </View>
              <View className='con-txt1'>
                <View>2019年6月27-28日:</View>
                鲁能领秀城（青云路5号，莲池路35号，天文大道3、17、35号，吉庆路54号，兴塘路207号）、长青湖（玉马路6号）
                <View>2019年6月29-30日：</View>
                江南小区（玉马路9号）、坡领顿（玉马路10号）
                <View>2019年7月1-2日：</View>
                时代都汇（广福大道2、4、6、8号，金成路1、2号）、中交漫山（梨花大道161、451号，漫景路40号）
              </View>
            </View>
          </View>
          <View className='item'>
            <View className='title'>
              <View className='txt1'>
                07
                <View className='box' />
              </View>
              <View className='txt2'>
                转学生招生
                <Image src={require('./triangle.png')} className='tri-img' />
              </View>
            </View>
            <View className='con'>
              <View>1.符合“三对口”条件；</View>
              <View>
                2.请于2019年7月6—10日，带上“三对口”的相关材料原件和复印件来学校面对面审核。
              </View>
            </View>
          </View>
          <View className='item'>
            <View className='title'>
              <View className='txt1'>
                08
                <View className='box' />
              </View>
              <View className='txt2'>
                温馨提示
                <Image src={require('./triangle.png')} className='tri-img' />
              </View>
            </View>
            <View className='con'>
              <View>1.登记的先后顺序与录取无关，家长无需提前排队。</View>
              <View>
                2.2019年6月20日—7月10日上午9:00—11:30，下午14：00-16：30接受家长电话咨询。
              </View>
              <View>招生咨询电话：023-61750350 18996579351</View>
              <View>联系人：刘老师</View>
            </View>
          </View>
          <View className='bottom-box'>
            <View>重庆市南岸区珊瑚鲁能小学校招生办公室</View>
            <View>2019年6月13日</View>
          </View>
        </View>
      </View>
    )
  }
}

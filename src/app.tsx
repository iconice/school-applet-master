import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import '@tarojs/async-await'
import Index from './pages/home/index'
import store from './store'
import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/home/index',
      'pages/login/index',
      'pages/check-result/index',
      'pages/check-detail/index',
      'pages/personal/index',
      'pages/register/index',
      'pages/choose-school/index',
      'pages/change-password/index',
      'pages/timeline/index',
      'pages/entrance/index',
      'pages/parents-info/index',
      'pages/child-info/index',
      'pages/viccine-info/index',
      'pages/transfer-info/index',
      'pages/house-info/index',
      'pages/enrollment-guide/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      backgroundColor: '#ffffff',
      color: '#898989',
      selectedColor: '#6F79F0',
      list: [
        {
          pagePath: 'pages/home/index',
          text: '首页',
          iconPath: './asset/images/tabs/nav_home@2x.png',
          selectedIconPath: './asset/images/tabs/nav_home_pressed@2x.png'
        },
        {
          pagePath: 'pages/check-result/index',
          text: '审核',
          iconPath: './asset/images/tabs/nav_audit@2x.png',
          selectedIconPath: './asset/images/tabs/nav_audit_pressed@2x.png'
        },
        {
          pagePath: 'pages/personal/index',
          text: '我的',
          iconPath: './asset/images/tabs/nav_person@2x.png',
          selectedIconPath: './asset/images/tabs/nav_person_pressed@2x.png'
        }
      ]
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    // const a = 1;
    // console.log(a)
    return (
      <Provider store={store}>
        // @ts-ignore
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

interface IConfig {
  /** 主机host */
  host: string
  /** cdn host */
  cdnHost: string
}

const config: IConfig = {
  host: 'https://test.kslab.com',
  cdnHost: 'https://cdn.kooshua.com'
}
export default config

interface IConfig {
  /** 主机host */
  host: string
  /** cdnhost */
  cdnHost: string
}

const config: IConfig = {
  host: 'https://server.kooshua.com',
  cdnHost: 'https://cdn.kooshua.com'
}
export default config

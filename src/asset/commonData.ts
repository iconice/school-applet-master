// 前端公共静态数据

// 性别
const genders = [
  { value: '1', name: '男' },
  { value: '2', name: '女' }
]

// 是否
const choices = [
  { value: '1', name: '是' },
  { value: '0', name: '否' }
]

// 与儿童的关系
const relations = [
  {
    value: 1,
    name: '父亲'
  },
  {
    value: 2,
    name: '母亲'
  },
  {
    value: 3,
    name: '爷爷'
  },
  {
    value: 4,
    name: '奶奶'
  },
  {
    value: 5,
    name: '外公'
  },
  {
    value: 6,
    name: '外婆'
  },
  {
    value: 7,
    name: '其他'
  }
]

// 房产权利人信息
const houseRelations = [
  {
    value: '1',
    name: '父亲'
  },
  {
    value: '2',
    name: '母亲'
  },
  {
    value: '3',
    name: '其他'
  }
]

// 入学信息步骤
const lines = [
  {
    id: 1,
    name: '儿童户籍信息'
  },
  {
    id: 2,
    name: '房产信息'
  },
  {
    id: 3,
    name: '儿童接种查验'
  },
  {
    id: 4,
    name: '转学儿童信息'
  }
]

// 健康状况
const healthInfo = [
  {
    value: '1',
    name: '健康'
  },
  {
    value: '2',
    name: '残疾'
  }
]

// 有无
const hasInfo = [
  {
    value: '1',
    name: '有'
  },
  {
    value: '2',
    name: '无'
  }
]

export {
  genders,
  choices,
  relations,
  houseRelations,
  lines,
  healthInfo,
  hasInfo
}

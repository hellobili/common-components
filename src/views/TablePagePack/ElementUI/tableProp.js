// 数据
const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  sex: 0,
  mobileNum: '15663236548',
  address: '西湖区湖底公园1号'
},
{
  key: '2',
  name: '胡彦祖',
  age: 42,
  sex: 1,
  address: '西湖区湖底公园1号'
}
]
// 表格头设置
const columns = (that) => [{
  type: 'selection'
},
{
  label: '序号',
  type: 'index'
},
{
  label: '姓名',
  prop: 'name',
  unit: '单位',
  props: {
    sortable: 'sortable'
  }
},
{
  label: '姓名',
  prop: 'name',
  click: (row, column, index) => {
    alert(row.name)
  }
},
{
  label: '性别',
  prop: 'sex',
  formatter: (row, column, index) => {
    return row.sex === 0 ? '男' : '女'
  }
},
{
  label: '住址',
  prop: 'address',
  newjump: (row, columns, index) => {
    return `/studentInfo/index/${row.accountId}`
  }
},
{
  label: '手机号',
  render: (h, parmas) => {
    return [h('i', {
      class: 'el-icon-phone-outline',
      style: 'fontSize: 22px'
    }), h('span', parmas.row.mobileNum)]
  }
},
{
  label: '手机号',
  render: (h, parmas) => {
    return [
      <i class='el-icon-phone-outline' style='fontSize: 22px'></i>,
      <span>{parmas.row.mobileNum}</span>
    ]
  }
},
{
  label: '插槽1',
  slotName: 'slot1'
},
{
  label: '插槽2',
  slotName: 'slot2'
},
{
  operates: true,
  label: '操作',
  btn: [{
    label: '编辑',
    isShow: row => {
      return row.status !== 2
    },
    disabled: row => {
      return row.status === 2
    },
    method: row => {
      that.handleNewJump(row)
    }
  }]
}
]
// 表格操作按钮
const operates = (that) => [{
  label: '编辑',
  isShow: row => {
    return row.status !== 2
  },
  disabled: row => {
    return row.status === 2
  },
  method: row => {
    that.handleNewJump(row)
  }
}]

const pagination = {
  currentPage: 1,
  pageSize: 10
}

export {
  dataSource,
  columns,
  operates,
  pagination
}

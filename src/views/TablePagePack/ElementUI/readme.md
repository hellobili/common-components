## 使用说明

### 目录说明
- style    样式

- component 组件
    - table.vue  表格封装
    - search.vue 搜索封装

    - demo.vue      集合展示页面
    - utils.js      需要的工具类封装


### ElementTablePack Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| — | — | — | — | — |
| dataSource | 表格数据                 | Array | — | — |
| columns    | 表格列的配置描述 表头部分 | Array | — | — |
| operates   | 表格操作按钮             | Array | — | — |
| dataTotal  | 分页数据总数	            | Number | — | — |
| pagination | 分页的配置项	            | Object | — | — |
| border     | 是否展示外边框和列边框    | Boolean | — | false |
| loading    | 是否显示loading          | Boolean | — | false |

### ElementTablePack methods
| 事件名 | 说明 | 参数 |
| — | — | — |
| handleSelectionChange | 当选择项发生变化时会触发该事件	 | currentPage |
| handleChangePage      | 页码改变的回调，参数是改变后的页码及每页条数 | currentPage |
| toggleRowSelection    | 设置当前选中项回显、清空复选框事件 | dom节点 |


### columns Attributes
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| — | — | — | — | — |
| label     | 列头显示文字	             | String | — | — |
| prop      | 列数据在数据项中对应的 key  | String | — | — |
| type      | 表格column的type  | String | selection/index/expand | — |
| unit      | 单位  | String | — | — |
| content   | 默认值 | String | — | — |
| align     | 设置列的对齐方式	          |left/center/right| — | left |
| width     | 列宽度	                 | string/number | — | — |
| props     | 列表参数扩展属性Table-column Attributes  | Object | — | — |
| render    | 生成复杂数据的渲染函数，参数分别为createElement，当前行数据  | Function(h, record) {} | — | - |
| formatter | 数据格式化		         | Function(row, columns, index) {} | — | — |
| newjump   | url页面跳转	             | Function(row, columns, index) {}	 | — | — |

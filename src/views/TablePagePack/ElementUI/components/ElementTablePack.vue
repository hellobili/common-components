<template>
  <div class="table_list_fix">
    <!-- table表格 -->
    <el-table
      size="small"
      v-bind="options"
      :border="border"
      :data="dataSource"
      v-loading="loading"
      v-on="tableEvents"
      ref="multipleTable"
      style="width: 100%;"
      :header-cell-style="{ background: '#f6f2ee' }"
      @selection-change="handleSelectionChange"
    >
      <!-- 配置数据前插槽 -->
      <slot name="beforeColum"></slot>
      <!-- 表格数据 -->
      <template v-for="(column, index) in columns">
        <!-- type属性列 -->
        <template v-if="column.type">
          <el-table-column
            :key="index"
            :type="column.type"
            v-bind="column.props"
            :label="column.label"
            :align="column.align"
            :width="column.width || '60px'"
            v-if="!column.isShow || (column.isShow && column.isShow())"
          />
        </template>
        <template v-else>
          <el-table-column
            :key="index"
            v-bind="column.props"
            :prop="column.prop"
            :label="column.label"
            :align="column.align"
            :width="column.width"
            v-if="!column.isShow || (column.isShow && column.isShow())"
          >
            <template slot-scope="scope">
              <template v-if="!column.render">
                <!-- formatter -->
                <template v-if="column.formatter">
                  <span
                    v-html="column.formatter(scope.row, column, scope.$index)"
                    @click="column.click && column.click(scope.row, scope.$index)"
                  ></span>
                </template>
                <!-- 跳转 -->
                <template v-else-if="column.newjump">
                  <router-link
                    class="newjump"
                    v-bind="{ target : '_blank', ...column.target }"
                    :to="column.newjump(scope.row, column, scope.$index)"
                  >{{scope.row[column.prop] || column.content}}</router-link>
                </template>
                <!-- 操作按钮 -->
                <template v-else-if="column.operates">
                  <template v-for="(btn, key) in column.btn">
                    <span
                      :key="key"
                      v-if="!btn.isShow || (btn.isShow && btn.isShow(scope.row, scope.$index))"
                    >
                      <el-button
                        :size="btn.size || 'small'"
                        :type="btn.type || `text`"
                        :icon="btn.icon"
                        :plain="btn.plain"
                        :disabled="btn.disabled && btn.disabled(scope.row, scope.$index)"
                        @click.native.prevent="btn.method(scope.row, scope.$index)"
                      >{{ btn.label }}{{column.btn.length >= 2 ? '&nbsp;&nbsp;' : ''}}</el-button>
                    </span>
                  </template>
                </template>
                <slot v-else-if="column.slotName" :name="column.slotName" :data="scope"></slot>
                <template v-else>
                  <span
                    :style="column.click ? 'color: #409EFF; cursor: pointer;' : null"
                    @click="column.click && column.click(scope.row, scope.$index)"
                  >
                    {{scope.row[column.prop] || column.content}}
                    {{`${scope.row[column.prop] && column.unit ? column.unit : ''}`}}
                  </span>
                </template>
              </template>
              <template v-else>
                <render :column="column" :row="scope.row" :render="column.render" :index="index"></render>
              </template>
            </template>
          </el-table-column>
        </template>
      </template>

      <!-- 配置数据后插槽 -->
      <slot name="afterColum"></slot>

      <!-- 操作按钮 -->
      <el-table-column
        label="操作"
        v-if="operates"
      >
        <template slot-scope="scope">
            <template v-for="(btn, key) in operates">
              <span
                :key="key"
                v-if="!btn.isShow || (btn.isShow && btn.isShow(scope.row, scope.$index))"
              >
                <el-button
                  v-bind="btn.props && btn.props"
                  :size="btn.size || 'small'"
                  :type="btn.type || `text`"
                  :icon="btn.icon"
                  :plain="btn.plain"
                  :disabled="btn.disabled && btn.disabled(scope.row, scope.$index)"
                  @click.native.prevent="btn.method(scope.row, scope.$index)"
                >{{ btn.label }}{{operates.length >= 2 ? '&nbsp;&nbsp;' : ''}}</el-button>
              </span>
            </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页部分 -->
    <div class="tablePage-pagination">
      <el-pagination
        background
        class="pagination"
        v-if="pagination"
        :total="dataTotal"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        @current-change="handleChangePage"
        layout="total, prev, pager, next"
      />
    </div>
  </div>
</template>

<script>
const methods = {
  // 复选框选中项
  handleSelectionChange (val) {
    this.multipleSelection = val
    this.$emit('handleSelectionChange', Array.from(val))
  },
  // 改变分页触发事件
  handleChangePage (val) {
    this.$emit('handleChangePage', val)
  }
}
export default {
  name: 'ElementTablePack',
  props: {
    dataSource: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    border: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    slotcontent: {
      type: Boolean,
      default: false
    },
    operates: {
      type: Array
    },
    pagination: {
      type: Object,
      default: null
    },
    dataTotal: {
      type: Number,
      default: 0
    },
    options: Object,
    tableEvents: Object
  },
  data () {
    return {
      multipleSelection: []
    }
  },
  methods,
  mounted () {
    this.$nextTick(() => {
      this.$emit('toggleRowSelection', this.$refs.multipleTable)
    })
  },
  components: {
    render: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h, opt) => {
        const params = {
          row: opt.props.row,
          index: opt.props.index
        }
        if (opt.props.column) params.column = opt.props.column
        return opt.props.render(h, params)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.table_list_fix {
  overflow: hidden;
}

.newjump {
  text-decoration: none;
  color: dodgerblue;
}
.tablePage-pagination{
  padding 20px 0
  .pagination {
    text-align: center;
  }
}

</style>

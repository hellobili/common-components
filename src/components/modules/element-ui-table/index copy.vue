<template>
  <div>
    <slot name='leftContent'></slot>
    <article :class="isRight ? 'content-right-show':'content-show'">
      <section class="content-editBox">
        <div class="routeName">{{$route.name}}</div>
        <div class="editIconList" v-if="tabSet.topBtn && tabSet.topBtn.length>0">
          <slot name="tabs"></slot>
          <div>
            <el-button
              v-for="(item,index) in tabSet.topBtn"
              v-has='{type:item.has}'
              :key="index"
              :size="item.size || 'mini'"
              :icon="item.icon && item.icon.indexOf('el-')>-1? item.icon : `iconfont ${item.icon}`"
              :type="item.type"
              :disabled="item.disabled && item.disabled()"
              @click.native.prevent="item.method()"
            >{{item.title}}</el-button>
          </div>
        </div>
      </section>
      <!-- 搜索 -->
      <section class="content-seachBox" v-if="tabSet.tableSearch && tabSet.tableSearch.length>0">
        <el-form
          size="mini"
          :rules="tabSet.rules"
          :model="formSearch"
          :inline="true"
          ref="formSearch"
          class="demo-form-inline"
        >
          <!-- 不显示label -->
          <el-form-item
            :key="index"
            v-for="(item, index) in tabSet.tableSearch"
            class="table-header-item"
            :prop="item.value"
            v-bind="item.form"
          >
            <component
              v-if="item.name"
              :is="item.name"
              v-model="formSearch[item.value]"
              @handleChange="item.handleChange && item.handleChange()"
              @handleClear="item.handleClear && item.handleClear()"
            ></component>
            <template v-else>
              <el-select
                clearable
                v-if="item.type === 'select'"
                v-bind="item.props"
                @change="item.method && item.method();update()"
                @clear="item.clear && item.clear()"
                v-model="formSearch[item.value]"
                :placeholder="`请选择${item.label}`"
              >
                <template v-if="typeof item.children == 'string'">
                  <el-option
                    v-for="option in dictionaries[item.children]"
                    :key="option.code"
                    :value="option.code"
                    :label="option.name"
                  />
                </template>
                <el-option
                  v-else
                  v-for="option in item.children"
                  :key="option[item.prop.value] || option.value"
                  :value="option[item.prop.value] || option.value"
                  :label="option[item.prop.label] || option.label"
                />
              </el-select>
              <el-date-picker
                clearable
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                v-bind="item.props || {type: 'date'}"
                v-else-if="item.type === 'picker'"
                :placeholder="`请选择${item.label}`"
                v-model="formSearch[item.value]"
                @change="update"
              />
              <el-input
                v-else
                clearable
                v-bind="item.props"
                :type="item.inputType || 'text'"
                v-model="formSearch[item.value]"
                :placeholder="`${item.label}`"
                :maxlength="item.maxlength"
                @keyup.enter.native="handleSearch"
                @input="update"
                :oninput="handleChangeInput(item)"
              />
            </template>
          </el-form-item>
          <!-- 表格搜索插槽 -->
          <slot name="tableSearch"></slot>

          <el-form-item class="form-button-z">
            <el-button @click="handleReset('formSearch')">清空</el-button>
            <el-button type="primary" @click="handleSearch">检索</el-button>
          </el-form-item>
        </el-form>
      </section>
      <!-- 表格 -->
      <section class="content-tableBox">
        <el-table
          v-bind="tabSet.options"
          :border="tabSet.border"
          :data="dataSource"
          v-loading="tabSet.loading"
          :height="tabSet.options && tabSet.options.tabHeight || 'calc(100% - 48px)'"
          :max-height="tabSet.options && tabSet.options.tabMHeight"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
        >
          <!-- 表格数据 -->
          <template v-for="(column, index) in tabSet.columns">
            <!-- 复选框 -->
            <el-table-column
              :key="index"
              type="selection"
              v-if="column.type === 'selection'"
              width="55"
              v-bind="column.props"
              :selectable='column.selectable'
            />
            <el-table-column
              :key="index"
              width="60"
              align="left"
              type="index"
              v-else-if="column.type === 'index'"
              :index="column.indexMethod"
              :label="column.label"
            />
            <!-- 图片 -->
            <el-table-column
              :key="index"
              v-bind="column.props"
              v-else-if="column.type === 'image'"
              :prop="column.prop"
              :label="column.label"
            >
              <template slot-scope="scope">
                <el-image v-if="column.formatter" class="table-image" :src="column.formatter(scope.row, column, scope.$index)"></el-image>
                <el-image v-else class="table-image" :src="scope.row[column.prop]"></el-image>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="index"
              v-bind="column.props"
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <template v-if="!column.render">
                  <template v-if="column.formatter">
                    <span v-html="column.formatter(scope.row, column, scope.$index)"></span>
                  </template>
                  <template v-else-if="column.newjump">
                    <router-link
                      target="_blank"
                      class="newjump"
                      :to="column.newjump(scope.row, column, scope.$index)"
                    >{{scope.row[column.prop]}}</router-link>
                  </template>
                  <template v-else>
                    <span>{{scope.row[column.prop]}}</span>
                  </template>
                </template>
                <template v-else>
                  <render :column="column" :row="scope.row" :render="column.render" :index="index"></render>
                </template>
              </template>
            </el-table-column>
          </template>

          <!-- slot插槽按钮 -->
          <el-table-column label="操作"  v-if="tabSet.options && tabSet.options.slotcontent">
            <template slot-scope="scope">
              <slot :data="scope.row"></slot>
            </template>
          </el-table-column>

          <!-- 操作按钮 -->
          <el-table-column label="操作"  v-if="tabSet.operates && tabSet.operates.length > 0">
            <template slot-scope="scope">
              <!-- <template > -->
                <span>
                  <el-button
                    v-for="(btn, key) in tabSet.operates"
                    v-has='{type:btn.has}'
                    :key="key"
                    v-show="!btn.isShow || (btn.isShow && btn.isShow(scope.row, scope.$index))"
                    :size="btn.size"
                    :type="btn.type || `text`"
                    :icon="btn.icon"
                    :plain="btn.plain"
                    :disabled="btn.disabled && btn.disabled(scope.row, scope.$index)"
                    @click.native.prevent="btn.method(scope.row, scope.$index)"
                  >{{ btn.label}}</el-button>
                </span>
              <!-- </template> -->
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-pagination
          class="pagination"
          background
          v-if="pagination"
          @size-change="handleChangeSize"
          @current-change="handleChangePage"
          :total="pagination.total"
          :current-page="pagination.pageNum"
          :page-size="pagination.pageSize"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
        />-->
        <pagination-z :pageOrder="pagination" @getData="handleChangePage"></pagination-z>
      </section>
    </article>
    <slot name="components"></slot>
    <slot></slot>
  </div>
</template>

<script>
import { convertParams } from '@/utils'
import { mapGetters } from 'vuex'
const methods = {
  // 复选框选中项
  handleSelectionChange (val) {
    this.multipleSelection = val
    this.$emit('handleSelectionChange', Array.from(val))
  },
  // 改变分页触发事件
  handleChangePage (val) {
    this.$emit('handleChangePage', val)
  },
  // 分页大小
  handleChangeSize (val) {
    this.$emit('handleChangeSize', val)
  },
  // 搜索查询按钮
  handleSearch () {
    console.log(convertParams(Object.assign({}, this.formSearch)))
    if (this.tabSet.rules) {
      return this.$refs.formSearch.validate(valid => {
        if (!valid) return false
        this.$emit(
          'handleSearch',
          convertParams(Object.assign({}, this.formSearch))
        )
      })
    }
    this.pagination.pageNum = 1
    this.$emit(
      'handleSearch',
      convertParams(Object.assign({}, this.formSearch))
    )
  },
  // 搜索重置按钮
  handleReset (formName) {
    // this.$refs[formName].resetFields();
    // this.formSearch = {};
    this.$emit('handleReset')
    // if (this.reset) return false;
    // this.handleSearch();
  },
  // input为number校验
  handleChangeInput (item) {
    return item.inputType === 'number'
      ? this.handleOnInput(
        this.formSearch[item.value],
        item.value,
        item.rulesLength
      )
      : null
  },
  // input渲染长度校验/可自定义长度
  handleOnInput (val, label, rulesLength) {
    if (val && Number(val) <= 0) {
      this.formSearch[label] = 0
    }
    if (rulesLength && val && val.length > 11) {
      this.formSearch[label] = this.formSearch[label].slice(0, 11)
    }
  },
  update () {
    this.$forceUpdate()
  }
}
export default {
  name: 'ITable',
  props: {
    tabSet: {
      type: Object,
      default: {}
    },
    dataSource: {
      type: Array,
      default: []
    },
    pagination: {
      type: Object,
      default: {}
    },
    formSearch: {
      type: Object
    },
    reset: {
      type: Boolean
    },
    rulesLength: {
      type: Boolean
    },
    isRight: Boolean
  },
  data () {
    return {
      multipleSelection: []
    }
  },
  methods,
  computed: {
    ...mapGetters('dictionary', ['dictionaries']),
    tabHeight () {
      if (this.tabSet.tableSearch && this.tabSet.tableSearch.length > 0) {
        return 'calc(100% - 136px)'
      } else return 'calc(100% - 48px)'
    }
  },
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
.table-image {
  width: 128px;
  height: 72px;
}
</style>

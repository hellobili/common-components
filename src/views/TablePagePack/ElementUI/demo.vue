<template>
  <div>
    <div class="app-demo--title">table demo展示页面</div>
    <ElementTablePack
      :dataSource='dataSource'
      :columns='columns'
      :pagination='pagination'
      :dataTotal='20'
      :operates='operates'
      :tableEvents='{select:select}'
      @handleSelectionChange='handleSelectionChange'
      @handleChangePage='handleChangePage'
    >
      <template slot-scope="scope" slot="slot1">
        <p> row:{{scope.data.row}}</p>
        index:{{scope.data.$index}}
      </template>
      <template slot-scope="scope" slot="slot2">
         name:{{scope.data.row.name}}
      </template>
    </ElementTablePack>
  </div>
</template>

<script>
import { ElementTablePack } from './components'
import { dataSource, columns, pagination, operates } from './tableProp'
export default {
  components: { ElementTablePack },
  data () {
    return {
      dataSource: dataSource,
      pagination: pagination,
      columns: columns(this),
      operates: operates(this),
      tableEvents: {
        select: (selection, row) => this.select()
      }
    }
  },
  methods: {
    handleNewJump (row) {
      console.log(row)
    },
    handleSelectionChange (selection) {
      console.log(selection)
    },
    handleChangePage (currentPage) {
      console.log(currentPage)
    },
    toggleRowSelection (dom) {
      console.log(dom)
    },
    select (selection, row) {
      console.log(selection, row)
    }
  }
}
</script>

<style>

</style>

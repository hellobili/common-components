<template>
  <div>
    <div class="app-demo--title">table demo展示页面</div>
    <ElementTablePack
      :dataSource='dataSource'
      :columns='columns'
      :pagination='pagination'
      :dataTotal='20'
    />
  </div>
</template>

<script>
import { ElementTablePack } from './components'
import { dataSource, columns, pagination } from './tableProp'
export default {
  components: { ElementTablePack },
  data () {
    return {
      dataSource: dataSource,
      pagination: pagination,
      columns: columns
    }
  }
}
</script>

<style>

</style>

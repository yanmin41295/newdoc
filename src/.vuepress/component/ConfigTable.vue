<script lang="ts" setup>
import {onBeforeMount, onMounted, reactive, ref} from 'vue'
import {nanoid} from "nanoid";
import {tableConfigRepo, initDb} from "../data/condition";
import {TableConfig} from "../data/TableConfig";

const props = defineProps<{ name: string }>()
console.log(props)
const excel = ref(null);
const myLabels = {
  footerLeft: (top: number, bottom: number) => `纪录 ${top} 至 ${bottom}`,
  first: '头页',
  previous: '上一页',
  next: '下一页',
  last: '尾页',
  footerRight: {
    selected: '选择：',
    filtered: '过滤：',
    loaded: '载入：'
  },
  processing: '工作中',
  tableSetting: '表格设定',
  exportExcel: '汇出 Excel',
  importExcel: '汇入 Excel',
  back: '关',
  reset: '预设',
  sortingAndFiltering: '排序及过滤',
  sortAscending: '小至大排序',
  sortDescending: '大至小排序',
  near: '≒ 接近',
  exactMatch: '= 等于',
  notMatch: '≠ 不等于',
  greaterThan: '&gt; 大于',
  greaterThanOrEqualTo: '≥ 大于或等于',
  lessThan: '&lt; 少于',
  lessThanOrEqualTo: '≤ 少于或等于',
  regularExpression: '~ 正规表示式',
  customFilter: '过滤内容',
  listFirstNValuesOnly: (n: number) => `只列出 ${n} 项`,
  apply: '应用',
  noRecordIsRead: '没有纪录被读取',
  readonlyColumnDetected: '不可更新唯读纪录',
  columnHasValidationError: (name: string, err: Error) => `纪录栏位 ${name} 发生核实错误: ${err}`,
  noMatchedColumnName: '没有能配对之栏位',
  invalidInputValue: '输入错误内容',
  missingKeyColumn: '找不到关键栏位',
  noRecordIndicator: '沒有纪录'
}
const tableData = reactive({
  id: "excel_" + nanoid(),
  rows: [] as any[],
  selected: new Set<number>(),
  configOpened: false,

})
let rowToUpdate = null as any;

async function loadConfig() {
  tableConfig.data = await tableConfigRepo.findAll({name: {condition: '=', value: 't_table_config'}})
}

onBeforeMount(async () => {
  await initDb();
})

onMounted(async () => {
  await loadConfig()
  await loadData()
})

async function loadData() {
  tableData.rows = await tableConfigRepo.findAll({name: {condition: "=", value: props.name}});
  console.log(tableData.rows)
}

function addRow() {
  excel.value.newRecord({name: props.name, visible: true, mandatory: true, textAlign: 'center', readonly: false})
}


async function deleteSelected() {
  let data = []
  let ids: number[] = []
  for (let index = 0; index < tableData.rows.length; index++) {
    if (!tableData.selected.has(index)) {
      data.push(tableData.rows[index]);
    } else {
      ids.push(tableData.rows[index].id);
    }
  }
  await tableConfigRepo.deleteByIds(ids)
  tableData.selected.clear();
  tableData.rows = data;
}

function select(indexes: number[], selected: boolean) {
  console.log(`select row : ${indexes} , type : ${selected}`)
  if (selected) {
    for (let index of indexes) {
      tableData.selected.add(index);
    }
  } else {
    for (let index of indexes) {
      tableData.selected.delete(index);
    }
  }
}

const tableConfig = reactive({
  data: [] as TableConfig[],
})


async function moveRow(up: boolean) {
  let unSelected: number[] = [];
  let start = 0;
  let length = tableData.rows.length;
  let data = new Array(length);
  let toUpdated: any[] = []
  if (up) {
    for (let index = 0; index < length; index++) {
      if (!tableData.selected.has(index)) {
        unSelected.push(index);
      } else {
        if (index == 0) {
          data[index] = tableData.rows[index];
          tableData.selected.add(index);
        } else if (data[index - 1] == undefined) {
          data[index - 1] = tableData.rows[index];
          tableData.selected.delete(index);
          tableData.selected.add(index - 1);
          toUpdated.push({...tableData.rows[index], id: tableData.rows[index - 1].id})
          toUpdated.push({...tableData.rows[index - 1], id: tableData.rows[index].id})
        } else {
          data[index] = tableData.rows[index];
        }
      }
    }
    for (let index = 0; index < length; index++) {
      if (data[index] == undefined) {
        data[index] = tableData.rows[unSelected[start]];
        start++
      }
    }
  } else {
    for (let index = length - 1; index >= 0; index--) {
      if (!tableData.selected.has(index)) {
        unSelected.push(index);
      } else {
        if (index == length - 1) {
          data[index] = tableData.rows[index];
          tableData.selected.add(index);
        } else if (data[index + 1] == undefined) {
          data[index + 1] = tableData.rows[index];
          tableData.selected.delete(index);
          tableData.selected.add(index + 1);
        } else {
          data[index] = tableData.rows[index];
        }
      }
    }
    for (let index = length - 1; index >= 0; index--) {
      if (data[index] == undefined) {
        data[index] = tableData.rows[unSelected[start++]];
      }
    }
  }
  console.log(toUpdated)
  await tableDataRepo.save(toUpdated);
  await loadData()
  // tableData.rows = data;
}

function beforeUpdated(newVal: string, oldVal: string, oldRow: string, field: string) {
  rowToUpdate = oldRow;
  return true
}

async function onUpdate(items: number[]) {
  await tableConfigRepo.save(rowToUpdate);
  await loadData();
}

</script>

<template>
  <div style="width: 100%" id="excel">
    <div>
      <a-button @click="addRow" type="primary" style="margin: 5px">新增</a-button>
      <a-button @click="deleteSelected" type="primary" style="margin: 5px">删除选中</a-button>
      <!--      <a-button @click="moveRow(true)" type="primary">上移</a-button>
            <a-button @click="moveRow(false)" type="primary">下移</a-button>-->
      <!--    上移一行、置顶 功能  -->
      <!--      <a-button @click="()=>tableData.configOpened=true" type="primary">配置表格</a-button>-->
    </div>
    <vue-excel-editor ref="excel" v-model="tableData.rows" :filter-row="true" :new-if-bottom="true" autocomplete
                      remember @update="onUpdate"
                      :localized-label="myLabels"
                      :disable-panel-setting="false" @select="select">
      <vue-excel-column v-for="config in tableConfig.data" :field="config.field" :label="config.label"
                        :options="config.options?.split(',')" :invisible="config.visible ==='false'"
                        :type="config.type"
                        :text-align="config.textAlign??'center'" :change="beforeUpdated"/>
    </vue-excel-editor>
  </div>
</template>
<style>
.component-content {
  width: 100% !important;
}

.table-content {
  width: 100% !important;
}

.systable {
  width: 100% !important;
}

</style>
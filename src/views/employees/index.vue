<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :showBefore= 'true'>
        <!-- 左侧显示总记录数 -->
        <!-- 组件插槽的两种用法：直接使用slot='插槽名称'  template标签包裹 v-slot:插槽名称 可简写 #插槽名称
          <span slot="before">共166条记录</span> -->
        <template #before>
          <span>共{{ page.total }}条记录</span>
        </template>
        <!-- 右侧显示按钮 excel导入 excel导出 新增员工 -->
        <template #after>
          <el-button type="success" size="small" @click="$router.push('/import')">excel导入</el-button>
          <el-button type="danger" size="small" @click="exportData">excel导出</el-button>
          <el-button type="primary" size="small" @click="showDialog = true">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 表格组件 -->
      <el-table border="" v-loading='loading' :data="list">
        <el-table-column label="序号" type="index" sortable="" />
        <el-table-column label="姓名" prop="username" sortable="" />
        <el-table-column label="手机号码" prop="mobile" sortable="" />
        <el-table-column label="工号" prop="workNumber" sortable="" />
        <el-table-column label="聘用形式" prop="formOfEmployment" sortable="" :formatter='formatEmployment'/>
        <el-table-column label="部门" prop="departmentName" sortable="" />
        <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
          <template v-slot="{ row }">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState" sortable="">
          <template slot-scope="{ row }">
            <el-switch :value='row.enableState === 1'></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination 
        :current-page="page.page"
        :page-size="page.size"
        :total="page.total"
        @current-change='changePage'
        layout="prev, pager, next"
         />
      </el-row>
    </div>
    <AddEmployee :showDialog.sync= 'showDialog' />
  </div>
</template>

<script>
import { getEmployeesList, delEmployee} from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' //引入员工的枚举对象
import AddEmployee from './components/add-employee'
import { formatDate } from '@/filters'
export default {
  data () {
    return {
      page:{
        page: 1, //页码
        size: 10, //每页条数
        total: 0
      },
      list:[],
      loading: false, //显示遮罩层
      showDialog:false
    }
  },
  components:{
    AddEmployee
  },
  created() {
    this.getEmployeesList()
  },
  methods: {
    async getEmployeesList() {
      this.loading = true
      const { total, rows} = await getEmployeesList(this.page)
      // console.log(await getEmployeesList(this.page));
      this.list = rows
      this.page.total = total
      this.loading = false
    },
    changePage(newPage) { //newPage最新的页码
      this.page.page = newPage // 赋值最新的页码
      this.getEmployeesList() //重新拉去数据
    },
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '非正式'
    },
    async delEmployee(id) {
      try {
        await this.$confirm('确定删除该员工吗?')
        // 点击了确定进入下方
        await delEmployee(id) //调用删除员工接口
        this.$message.success('删除成功')
        this.getEmployeesList() //重新拉去数据
      } catch (error) {
        console.log(error)
      }
      
    },
    // 导出excel
    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // console.log(Object.keys(headers));
      import('@/vendor/Export2Excel').then(async excel => {
        // 获取所有数据
        const { rows } = await getEmployeesList({ page: 1, size: this.page.total})
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        // excel是引入文件的导出对象
        excel.export_json_to_excel({
          header:Object.keys(headers),
          data,
          filename:'员工信息资料表',
          // bookType:'xlsx' //导出文件类型
          multiHeader,//复杂表头
          merges //合并选项
        })
      })
    },
    // 将数据对象转化为二维数组
    formatJson(headers,rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          // 需要判断时间字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') { //判断字段是需要转换的时间
            return formatDate(item[headers[key]]) // 转换时间格式
          } else if (headers[key] === 'formOfEmployment') { // 判断字段是聘用形式
            const en =  EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        })
      })

      // return rows.map(item => Object.keys(headers).map(obj => item[headers[obj]]))
    }
  }
}
</script>

<style>

</style>

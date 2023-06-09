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
        <el-table-column width="120px" label="头像">
          <template  v-slot='{ row }'>
            <img 
            v-imageerror="require('@/assets/common/head.jpg')"
            :src="row.staffPhoto"
            @click="showQcCode(row.staffPhoto)"
            style="border-radius:50%; width:100%; height:100%; padding:10px">
          </template>
        </el-table-column>
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
            <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
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
    <el-dialog title="二维码" :visible.sync='showCodeDialog'>
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 放置分配角色组件 -->
    <AssignRole ref="assignRole" :showRoleDialog.sync='showRoleDialog' :userId='userId' />
  </div>
</template>

<script>
import { getEmployeesList, delEmployee} from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' //引入员工的枚举对象
import AddEmployee from './components/add-employee'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import AssignRole from './components/assign-role'
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
      showDialog: false,
      showCodeDialog: false, //显示二维码弹层
      showRoleDialog: false, //显示分配角色的弹层
      userId: null //用户id
    }
  },
  components:{
    AddEmployee,
    AssignRole
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
    },
    showQcCode(url) {
      // 只有url存在，才会弹层
      if (url) {
        this.showCodeDialog = true // 数据更新了但弹层不会立即出现
        // this.$nextTick()可以在上一次数据更新完毕，页面渲染之后
        this.$nextTick(() => {
         QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化为二维码 但是会报错，因为弹层不会立即出现，页面渲染是异步的
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    async editRole(id) {
      // 显示弹出层
      this.userId = id
      // 调用子组件中的方法 this.$refs
      await this.$refs.assignRole.getUserDetailById(id) //会条空白，使用await，强制执行完毕后，再执行下面的代码
      this.showRoleDialog = true
    }
  }
}
</script>

<style>

</style>

<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧内容 -->
            <!-- 新增按钮 -->
            <el-row style="height:60px">
              <el-button icon="el-icon-plus" type="primary" size="small" @click="showDialog = true">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border='' :data="list">
              <el-table-column align="center" type="index" label="序号" width="120"></el-table-column>
              <el-table-column align="center" prop="name" label="名称" width="240"></el-table-column>
              <el-table-column align="center" prop="description" label="描述"></el-table-column>
              <el-table-column align="center" label="操作">
                <!-- 作用域插槽  slot-scoped 获取要删除的列 -->
                <template slot-scope="{ row }">
                  <el-button type="success" size="small">分配权限</el-button>
                  <el-button type="primary" size="small" @click="editRole(row.id)">编辑</el-button>
                  <el-button type="danger" size="small" @click=deleteRole(row.id)>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev,pager,next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert 
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
             />
            <!-- 右边内容 -->
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" disabled style="width:400px"/>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px"/>
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px"/>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px"/>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px"/>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 防止弹出层 -->
    <el-dialog :title="this.roleForm.id ? '编辑角色' : '新增角色'" :visible='showDialog' @close='btnCancle'>
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input style="width:500px" v-model="roleForm.name"/>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input style="width:500px" v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 放置footer插槽 -->
      <el-row type="flex" justify="center"> 
        <el-col :span="8">
          <el-button size="small" @click="btnCancle">取消</el-button>
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      page:{
        page: 1, //页码
        pagesize: 10, //每页条数
        total: 0 //总数
      },
      formData:{
        // 公司信息
      },
      list:[], //定义一个承接角色数据的数组
      showDialog: false, //控制弹层显示
      roleForm:{
        name:'',
        description:''
      },
      rules:{
        name:[{required:true, message: '角色名称不能为空', trigger:'blur'}]
      }
    }
  },
  computed:{
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods:{
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      // console.log(await getRoleList(this.page));
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage
      this.getRoleList()
    },
    async getCompanyInfo() {
      // console.log(await getCompanyInfo(this.companyId));
      this.formData = await getCompanyInfo(this.companyId)
    },
    async deleteRole(id) {
      try {
        // 提示
        await this.$confirm('确认删除该角色吗?') //只有点确定了，才会进入到下面的代码
        await deleteRole(id) // 调用删除接口
        // 重新加载数据
        this.getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id) // 先获取数据回写
      this.showDialog = true // 再显示弹出层
    },
    async btnOk() {
      // 捕获失败，可以使用try catch方法
      try {
        // 表单校验
        await this.$refs.roleForm.validate() //validate方法不传参会返回一个primise对象，进行下一步可以使用.then(),或者await
        // 只有校验通过，才会执行下一步
        // roleForm有id就是编辑，没有id就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm) // 调用更新接口
        }else {
          // 新增
          await addRole(this.roleForm)
        }
        this.getRoleList() //调用成功后，重新拉取数据 
        this.$message.success('操作成功')
        this.showDialog = false //关闭弹层，会触发el-dialog的close事件
      } catch (error) {
        console.log(error)
      }
    },
    btnCancle() {
      // 清空数据
      this.roleForm = {
        name:'',
        description:''
      }
      // 移除校验规则
      this.$refs.roleForm.resetFields()
      this.showDialog =false
    },
      
  }
}
</script>

<style>

</style>

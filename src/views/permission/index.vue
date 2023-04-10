<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右按钮 -->
      <PageTools>
        <template v-slot:after> 
          <el-button type="primary" size="small" @click="addPermission(1, '0')">添加权限</el-button>
        </template>
      </PageTools>
      <!-- 表格 -->
      <!-- 指定id为唯一标识符 -->
      <el-table border :data="list" row-key="id" >
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column align="center" label="标识" prop="code"></el-table-column>
        <el-table-column align="center" label="描述" prop="description"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button v-if="row.type === 1" type="text" size="small" @click="addPermission(2, row.id)">添加</el-button>
            <el-button type="text" size="small" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" size="small" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增编辑弹层 -->
    <el-dialog :title="showText" :visible='showDialog' @close='btnCancel'>
      <el-form ref="permissionForm" :model="formData" :rules="rules" label-width="120px" style="margin-left: -50px">
        <el-form-item prop="name" label="权限名称">
          <el-input v-model="formData.name" style="width:90%"/>
        </el-form-item>
        <el-form-item prop="code" label="权限标识">
          <el-input v-model="formData.code" style="width:90%"/>
        </el-form-item>
        <el-form-item prop="description" label="权限描述">
          <el-input v-model="formData.description" style="width:90%"/>
        </el-form-item>
        <el-form-item prop="enVisible" label="企业可见">
          <!-- 当值为1时开启 0时关闭 -->
          <el-switch 
          v-model="formData.enVisible"
          active-value="1"
          inactive-value="0"
          style="width:90%"/>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center">
        <el-col :span='6'>
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, delPermission, addPermission, updatePermission, getPermissionDetail } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  data () {
    return {
      showDialog: false,
      list:[],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '1' // 开启
      },
      rules:{
        name:[{required: true, message: '权限名称不能为空', trigger: 'blur'}],
        code:[{required: true, message: '权限标识不能为空', trigger: 'blur'}]
      }
    }
  },
  computed:{
    showText() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods:{
    //获取全部的权限列表
    async getPermissionList() {
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    //删除权限
    delPermission(id) {
        this.$confirm('确定删除该权限吗？').then(async () => {
          await delPermission(id)
          this.$message.success('删除成功')
          // 重新拉取数据
        this.getPermissionList()
        })
    },
    addPermission(type, pid) {
      // 识别是添加访问权还是操作权，传值type，当值为1时是访问权 2是操作权
      // pid表示当前数据的父节点标识
      // 记录当前的type和pid
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    btnOk() {
      // 校验表单
      // this.$refs.permissionForm.validate(isOk => {})
      this.$refs.permissionForm.validate().then(() => {  //primise用法，校验成功进入then
        // 校验成功
        // 判断是否编辑操作，当formData.id有值时是编辑操作，没有新增操作
        if (this.formData.id) {
          return updatePermission(this.formData)
        }
        return addPermission(this.formData) //因为不能重复嵌套then用法，所以使用return返回，再调用then方法 调用新增接口
      }).then(() => {
        // 添加成功
        this.$message.success('操作成功')
        this.showDialog = false
        this.getPermissionList() //再次重新获取全部权限数据
      })
    },
    // 编辑功能
    async editPermission(id) {
      //数据回写，根据id获取权限详情
      this.formData =await getPermissionDetail(id)
      this.showDialog = true
      
    },
    btnCancel() {
      // 清空数据
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '1' // 开启
      }
      // 移除校验
      this.$refs.permissionForm.resetFields()
      // 关闭弹出层
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>

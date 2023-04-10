<template>
  <el-dialog title="分配角色" :visible='showRoleDialog' @close='btnCancel'>
    <!-- 多选框 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <!-- footer插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span=6>
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props:{
      showRoleDialog:{
        type: Boolean,
        default: false
      },
      userId:{
        // 用户id
        type: String,
        default:null
      }
  },
  data () {
    return {
      list:[],
      roleIds:[], //存储当前用户所拥有的角色id
      page:{
        page: 1,
        pagesize: 10
      },
    }
  },
  created() {
    this.getRoleList()
  },
  methods:{
    async getRoleList() {
      const { rows } = await getRoleList(this.page)
      // console.log(await getRoleList(this.page));
      this.list = rows
    },
    // 什么时候调用，props传值是异步的，所以这里不能用this。userId 这个方法时给父组件使用的
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      // console.log(roleIds);
      this.roleIds = roleIds
    },
    async btnOk() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      // 关闭弹层
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {
      // 清空roleIds数组
      this.roleIds = []
      // 关闭弹层
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style>

</style>
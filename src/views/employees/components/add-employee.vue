<template>
  <el-dialog title="新增员工" :visible='showDialog' @close='btnCancel'>
    <!-- 表单 -->
    <el-form ref="addEmployee" :model="formData" :rules="formRules" label-width="120px" style="margin-left: 150px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请输入聘用形式">
          <el-option 
          v-for="item in EmployeeEnum.hireType" 
          :key="item.id" 
          :label="item.value" 
          :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input 
        @focus="getDepartments" 
        v-model="formData.departmentName" 
        style="width:50%" 
        placeholder="请输入部门" />
        <el-tree 
        @node-click='selectNode'
        v-loading='loading'
        v-if="showTree" 
        :data="treeData" 
        :props="{ label:'name' }" 
        :default-expand-all='true'/>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 取消和确定按钮 -->
    <el-row slot="footer" type="flex" justify="center" align="middle">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
export default {
  props:{
    showDialog:{
      default: false,
      type:Boolean
    }
  },
  data() {
    return {
      EmployeeEnum,
      // 定义表单数据
      formData:{
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      // 定义表单规则
      formRules:{
        username: [{required:true, message:'用户姓名不能为空', trigger:'blur'},
        {min:1, max:4, message:'用户姓名为1-4位', trigger:'blur'}],
        mobile: [{required:true, message:'手机号码不能为空', trigger:'blur'},
        {pattern: /^1[3-9]\d{9}$/, message:'手机号格式不正确', trigger:'blur'}],
        formOfEmployment: [{required:true, message:'聘用形式不能为空', trigger:'blur'}],
        workNumber: [{required:true, message:'工号不能为空', trigger:'blur'}],
        departmentName: [{required:true, message:'部门不能为空', trigger:'change'}],
        timeOfEntry: [{required:true, message:'入职时间不能为空', trigger:'blur'}]
      },
      treeData:[], //接收树形结构数据
      showTree:false, //默认不显示树形结构
      loading:false //加上一个进度条
    }
  },
  methods:{
    async getDepartments() {
      this.loading = true
      const { depts } = await getDepartments()
      // depts是一个数组，需要转换成树形结构   才可以被 el-tree 显示
      this.treeData = tranListToTreeData(depts, '')
      this.showTree = true
      this.loading = false
    },
    // 部门选择赋值给表单
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    async btnOk() {
      // 校验表单
      try {
        await this.$refs.addEmployee.validate() //校验通过才会执行下面的代码
        // 调用新增员工接口
        await addEmployee(this.formData)
        // 通知父组件，更新数据    this.$parent -- 父组件实例
        this.$parent.getEmployeesList && this.$parent.getEmployeesList() //直接调用父组件的更新方法
        // 关闭弹层
        this.$parent.showDialog = false
        // 这里不用重置数据，因为关闭弹层会触发close事件，close事件绑定了btnCalcel方法
      } catch (error) {
        console.log(error)
      }
      
    },
    btnCancel() {
      // 清除数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 清除校验
      this.$refs.addEmployee.resetFields()
      // 通知父组件关闭弹层
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>

</style>
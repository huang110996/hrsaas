<template>
      <el-row type="flex" justify="space-between" align="middle" style="height:40px;width:100%">
            <el-col>
              <!-- 左侧内容 -->
              <span>{{treeNode.name}}</span>
            </el-col>
            <el-col :span="4">
              <!-- 右侧内容 -->
              <el-row type="flex" justify="end">
                <!-- 负责人 -->
                <el-col>
                  <span>{{treeNode.manager}}</span>
                </el-col>
                <!-- 下拉菜单 -->
                <el-col>
                  <!-- 内容 -->
                  <el-dropdown @command='operateDepts'>
                    <span>
                    操作 <i class="el-icon-arrow-down"></i>
                    </span>
                    <!-- 具名插槽 -->
                    <el-dropdown-menu slot="dropdown">
                    <!-- 下拉选项 -->
                      <el-dropdown-item command='add' :disabled="!checkPermission('add-depts')">添加子部门</el-dropdown-item>
                      <el-dropdown-item v-if="!isRoot" command='edit'>编辑部门</el-dropdown-item>
                      <el-dropdown-item v-if="!isRoot" command='del'>删除部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
</template>

<script>
import { delDeparments } from '@/api/departments'
export default {
  props:{
    treeNode:{
      type:Object,
      required:true
    },
    isRoot:{
      type:Boolean,
      default:false
    },
    
  },
  methods:{
    // 点击新增、编辑、删除部门
    operateDepts(type){
      if (type === 'add'){
        // 新增部门
        // 添加子部门，在当前点击的部门下，添加子部门   this.treeNode就是当前子部门
        this.$emit('addDepts',this.treeNode) //自定义事件，通知父组件，显示弹层
      } else if(type === 'edit'){
        // 编辑部门
        this.$emit('editDepts', this.treeNode) //点击谁编辑谁
      } else {
        // 删除部门
        this.$confirm('您确定要删除该组织部门吗').then(()=>{
          return delDeparments(this.treeNode.id) //返回的是一个promise对象，不能再里面嵌套then，需要return返回
        }).then(()=>{
          // 只需要等成功时，调用接口删除了，后端数据变化，前端没变，需重新获取
          this.$emit('delDepts')
          this.$message.success('删除部门成功')
        })
      }
    }
  }

}
</script>

<style>

</style>
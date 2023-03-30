<template>
  <div v-loading = 'loading' class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容-头部 -->
      <el-card class="tree-card">
        <!-- 结构内容 -->
        <TreeTools :treeNode='company' :isRoot = true @addDepts='addDepts'/>
        <!-- 树形结构 el-tree -->
        <el-tree :data="departs" :props="defaultProp" :default-expand-all="true">
           <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <TreeTools 
          slot-scope="{ data }" 
          :treeNode='data' 
          @delDepts='getDepartments'
          @addDepts='addDepts'
          @editDepts='editDepts' />
        </el-tree>
      </el-card>
      <AddDept ref="addDept" :showDialog.sync="showDialog" :treeNode = 'node' @addDepts='getDepartments' />
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import {tranListToTreeData} from '@/utils'
export default {
  data () {
    return {
      company:{},
      departs: [],
      defaultProp:{
        label:'name'
      },
      showDialog:false,
      loading: false, // 用来控制进度弹层的显示和隐藏
      node:null //存储当前部门
    }
  },
  components:{
    TreeTools,
    AddDept
  },
  created(){
    this.getDepartments()
  },
  methods:{
    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      // console.log(result);
      this.company = {name:result.companyName, manager:'负责人', id:''}
      // 将数据转换成树状结构
      this.departs = tranListToTreeData(result.depts,'')
      this.loading = false
    },
    // 监听tree-tools中触发的点击添加子部门事件
    addDepts(node) { //node是我们点击的部门
      this.showDialog = true //显示弹层
      this.node = node
    },
    // 监听tree-tools中触发的点击编辑事件
    async editDepts(node) {
      this.showDialog = true //显示弹层
      this.node = node
      // 在子组件设置获取部门详情的方法，再通过refs在父组件调用该方法
      this.$refs.addDept.getDepartDetail(node.id)
      // console.log(this.$refs.addDept);
    }
  }
  
}
</script>

<style scoped>
.tree-card{
  padding: 30px 140px;
  font-size: 14px;
}

</style>

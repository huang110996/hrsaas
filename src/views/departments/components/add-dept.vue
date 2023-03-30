<template>
  <!-- 放置弹层组件 -->
  <el-dialog :title="showTitle" :visible=showDialog @close='btnCancel'>
    <!-- 表单数据 label-width设置所有的标题宽度-->
    <el-form ref="deptForm" :model="formData" :rules="formRuls" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input style="width:80%" placeholder="1-50个字符" v-model="formData.name"/>
      </el-form-item >
      <el-form-item label="部门编码" prop="code">
        <el-input style="width:80%" placeholder="1-50个字符" v-model="formData.code"/>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select style="width:80%" placeholder="请选择" v-model="formData.manager" @focus="getEmployeesSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username"/>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" v-model="formData.introduce"/>
      </el-form-item>
    </el-form>
    <!-- 确定和取消 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOk">确认</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDeparments, getDepartDetail, updataDepartments} from '@/api/departments'
import { getEmployeesSimple } from '@/api/employees'

export default {
  props:{
    showDialog:{
      type:Boolean,
      default:false
    },
    treeNode:{
      type:Object,
      default:null
    }
  },
  data () {
    // 检查部门名称是否重复
    const checkNameRepeat = async (rule, value, callback) => {
      // value是部门名称，要去同级部门下的部门比较  有相同--不能过/不相同--通过
      // 获取组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 有id，编辑模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      }else {
        // 没id，新增模式
        // 去找同级部门的所有的子部门
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // 如isRepeat为true 表示找到了相同的
      isRepeat ? callback(new Error(`同级部门已存在这个${value}部门了`)) : callback()
    }
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 要求，排除自身的code ，比较其他是否相同的
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      }else {
        isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有
      }
      isRepeat ? callback(new Error(`组织架构下已存在这个${value}编码了`)) : callback()
    }
    return {
      // 定义表单数据
      formData:{
        name:'',
        code:'',
        manager:'',
        introduce:''
      },
      // 定义校验规则 {key:[]}
      formRuls:{
        name:[
          {required:true, message:'部门名称不能为空', trigger:'blur'},
          {min: 1, max: 50, message:'部门名称长度为1-50个字符', trigger:'blur'},
          {trigger:'blur', validator: checkNameRepeat}
          ],
        code:[{required:true, message:'部门编码不能为空', trigger:'blur'}, 
        {min: 1, max: 50, message:'部门编码长度为1-50个字符', trigger:'blur'},
        {trigger:'blur', validator: checkCodeRepeat}
        ],
        manager:[{required:true, message:'部门负责人不能为空', trigger:'blur'}],
        introduce:[{required:true, message:'部门介绍不能为空', trigger:'blur'},
         {min: 1, max: 300, message:'部门介绍长度为1-300个字符', trigger:'blur'}]
      },
      peoples:[]
    }
  },
  computed:{
    // 使用计算属性，修改标题名称
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods:{
    async getEmployeesSimple() {
      this.peoples = await getEmployeesSimple()
    },
    // 获取部门详情方法
    async getDepartDetail(id) {
      this.formData =  await getDepartDetail(id) 
      //因为props传值是异步的，不能直接获取到当前点击的值，通过在父组件通过ref找到组件的实例，在调用该方法传值
    },
    btnOk() {
      // 手动校验表单
      this.$refs.deptForm.validate(async isOk => {
        if(isOk) {
          if (this.formData.id) {  //youid
            // 编辑部门
            await updataDepartments(this.formData)
          } else {
            // 表单校验通过
          await addDeparments({...this.formData, pid: this.treeNode.id})
          }
          // 通知父组件更新数据
          this.$emit('addDepts')
          // 使用sync修饰符，关闭弹层，子组件this.$emit('updata: props名称'，值) 父组件 :props名称.sync = props名称 
          this.$emit('update:showDialog', false)
          // 关闭dialog时，会自动触发el-dialog的close事件，所以这里不需要再单独重置数据了
        }
      })
    },
    btnCancel() {
      // 因为resetFields()方法不能重置非表单里面的数据，所以需要强制加上重置数据
      this.formData = {
          name:'',
          code:'',
          manager:'',
          introduce:''
        },
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 清除之前的校验
      this.$refs.deptForm.resetFields()
    }
  }

}
</script>

<style>

</style>
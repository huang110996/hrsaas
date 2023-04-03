<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置一个el-card -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置内容 -->
            <el-form ref="userInfo" :model="userInfo" :rules="rules" label-width="120px" style="margin-left:120px; margin-top:30px">
              <el-form-item prop="username" label="姓名：">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item prop="password2" label="密码：">
                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
                <el-button>取消</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- <UserInfo /> -->
            <!-- vuejs中有一个内置了一个组件component 可以是任何组件    动态组件 可以切换组件 :is =  -->
            <component :is='UserComponent'/>
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="JobComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info'
import JobInfo from './components/job-info'
export default {
  data() {
    return {
      UserComponent:'UserInfo',
      JobComponent:'JobInfo',
      userId: this.$route.params.id, //直接将路由中的参数，赋值给data中的属性
      userInfo:{
        username:'',
        password2:'' //为什么叫password2，因为读取出来的password是密文
      },
      rules:{
        username:[{required:true, message:'姓名不能为空', trigger:'blur'}],
        password2:[{required:true, message:'密码不能为空', trigger:'blur'},
        {min:6, max:9, message: '长度为6-9位', trigger:'blur'}]
      }
    }
  },
  components:{
    UserInfo,JobInfo
  },
  created() {
    this.getUserDetailById()
  },
  methods:{
    // 获取员工基本信息
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    async saveUser() {
      try {
        // 调用方法时，首先校验一下表单
        await this.$refs.userInfo.validate() // 校验通过后执行下方代码
        await saveUserDetailById({...this.userInfo, password: String(this.password2)}) //修改用户信息
        this.$message.success('修改用户信息成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>

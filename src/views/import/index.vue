<template>
  <UploadExcel :on-success="success"  />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods:{
    async success({header, results}) {
        // 如果是导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // const arr = []
      // results.forEach(item => {
      //   const userInfo = {}
      //   Object.keys(item).forEach(key => {
      //      //这里的key是中文
      //     userInfo[userRelations[key]] = item[key] //将原来中文对应的值 赋值给 原来英文对应的值
      //   })
      //   arr.push(userInfo)
      // })
    const newArr = results.map(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          if(userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            // 后端接口，限制了不能是字符串，需要转化为时间类型
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '.'))
          } else {
            userInfo[userRelations[key]] = item[key] //将原来中文对应的值 赋值给 原来英文对应的值
          }
        })
        return userInfo
      })
      console.log(newArr);
      await importEmployee(newArr) //调用批量导入接口，传入一个数组
      this.$message.success('批量导入成功')
      this.$router.back() //路由返回上一个页面
    },
    
    // 格式化时间方法
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
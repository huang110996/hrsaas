<template>
  <el-dropdown trigger="click" @command='changLanguage'>
    <!-- 显示图标 -->
    <div>
      <svg-icon style="color: #fff; font-size: 20px" icon-class='language' />
    </div>
    <!-- 下拉图标 -->
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="this.$i18n.locale === 'zh'" command='zh'>中文</el-dropdown-item>
      <el-dropdown-item :disabled="this.$i18n.locale === 'en'" command='en'>en</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  methods:{
    changLanguage(type) {
      // 设置的值，先写入到cookie
      Cookie.set('language', type)
      // 改变当前的多语言
      this.$i18n.locale = type // 将当前的多语言类型改成对应的值
      this.$message.success('切换语言成功')
    }
  }
}
</script>

<style>

</style>
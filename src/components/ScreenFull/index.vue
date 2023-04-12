<template>
  <div>
    <svg-icon 
    icon-class='fullscreen' 
    style="color: #fff; width: 20px; height: 20px"
    @click="changScreen"
    />
  </div>
</template>

<script>
import ScreenFull from 'screenfull/dist/screenfull.js'
export default {
  methods:{
    changScreen() {
      // document.documentElement.requestFullscreen() 原生方式
      if (!ScreenFull.isEnabled) { //判断全屏功能是否可用
        this.$message.warning('此时全屏功能不可用')
        return
      }
      ScreenFull.toggle() //全屏方法 即可全屏，也可以退出全屏
    }
  }
}
</script>

<style>

</style>
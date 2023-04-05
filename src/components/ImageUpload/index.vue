<template>
  <div>
    <!-- action是必填项，给个#号就不会报错 -->
    <el-upload 
    list-type="picture-card" 
    :limit="1" action='#' 
    :on-preview="preview" 
    :on-remove="handleRemove"
    :on-change="changeFile"
    :before-upload="beforeUpload"
    :http-request="upload"
    :file-list="fileList"
    :class="{ disabled:fileComputed}">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress v-if="showPercent" :percentage='percent' style="width:200px"/>
    <el-dialog :visible.sync='showDialog' title="图片预览">
      <img :src="imgUrl" alt="" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' //引入腾讯云cos包
// 实例化COS对象
const cos = new COS({
  SecretId: 'AKIDw6rcHjvufBSSRK2Xp494uWuwjJgneHgr', //身份id
  SecretKey: '3rRoAG6g2A3kGafS5nJZdT8aprjOr9D5' //身份key
})
export default {
  data () {
    return {
      fileList:[],
      showDialog:false,
      imgUrl:'',
      currentFileUid:null, //记录当前的图片对象的uid
      percent:0,
      showPercent:false
    }
  },
  computed:{
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods:{
    // 点击预览事件
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    // file点击要删除的文件，fileList删除之后的文件
    handleRemove(file,fileList) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid) //将原来的文件给排除掉了 剩下的就是最新的数组了
      // this.fileList = fileList
    },
    changeFile(file,fileList) {
      // file当前文件  fileList当前最新数组
      // console.log(file)
      // console.log(fileList)
      // 如果当前fileList中没有该文件，就要往里面追加
      this.fileList = fileList.map(item => item)  //为什么暂时不成功，是因为还没有上传，所以进来的数据 一定是个空的
    },
    beforeUpload(file) {
      // 先检查文件
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        // 没有检测到符合的文件，直接返回false
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查文件大小 5M 1M = 1024KB 1KB=1024B
      const maxSize = 5*1024*1024
      if (file.size > maxSize) {
        // 超过了文件限制大小
        this.$message.error('上传图片大小不能大于5M')
        return false
      }
      // 已经确定当前上传的就是当前的这个file了
      this.currentFileUid = file.uid
      // 上传成功--显示进度条
      this.showPercent = true
      return true //最后一定要返回true
    },
    // 进行上传操作
    upload(params) {
      // console.log(params)
      if (params.file) {
        // 有文件，进行上传操作
        cos.putObject({
          Bucket: 'huangxiaolin-1317624998', //存储桶地址
          Region: 'ap-guangzhou', //存储桶地域
          Key: params.file.name, //文件名
          Body: params.file, //要上传的文件对象
          onProgress:(params) => {
            // console.log(params)
            this.percent = params.percent * 100
          }

        }, (err, data) => {
          console.log(err || data);
          if (!err && data.statusCode === 200) {
            // 表示文件上传成功  要获取返回的地址
            // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
            // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if(item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                 // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
              }
              return item
            })
            // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
            //关闭进度条--清空进度条
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style>
 .disabled .el-upload--picture-card{
  display: none;
 }
</style>
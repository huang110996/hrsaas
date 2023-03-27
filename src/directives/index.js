// 负责管理所有的自定义指令
export const imageerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    // dom表示当前指令作用的domh对象
    // options 指令中的变量的解释  其中有一个属性叫做value
    // 当图片有地址，但是地址没有加载成功时，会报错--触发图片的一个事件=> onerror
    dom.onerror = function() {
      // 当图片出现异常时，会将指令配置的默认图片设置为该图片的内容
      dom.src = options.value // 这里不能写死
    }
  }
}

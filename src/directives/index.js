// 负责管理所有的自定义指令
export const imageerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    // dom表示当前指令作用的domh对象
    // options 指令中的变量的解释  其中有一个属性叫做value
    // 当图片有地址，但是地址没有加载成功时，会报错--触发图片的一个事件=> onerror
    dom.src = dom.src || options.value // 初始化时，如有值，则赋值  如没有值，则进行默认赋值
    dom.onerror = function() {
      // 当图片出现异常时，会将指令配置的默认图片设置为该图片的内容
      dom.src = options.value // 这里不能写死
    }
  },
  componentUpdata(dom, options) {
    // 该钩子函数，会在使用的组件，更新数据完毕后执行
    // inserted只会执行一次    当数据发生更新后，会再次进入componentUpdata函数
    dom.src = dom.src || options.value
  }
}

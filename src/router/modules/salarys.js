// 导出员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/salarys', // 路由地址
  // name: 'salarys',
  component: Layout,
  children: [{
    path: '', // 二级路由的path什么都不写时，表示二级路由的默认路由 /salarys 不但有布局 layout => 员工主页
    component: () => import('@/views/salarys'),
    // 路由元信息，其实就是一个存储数据的地方，可以放任何内容
    meta: {
      title: '工资', // 为什么使用title，因为左侧导航读取这里的title属性
      icon: 'money'
    }
  }]
}

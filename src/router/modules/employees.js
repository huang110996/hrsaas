// 导出员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/employees', // 路由地址
  // name: 'employees',
  component: Layout,
  children: [{
    path: '', // 二级路由的path什么都不写时，表示二级路由的默认路由 /employees 不但有布局 layout => 员工主页
    component: () => import('@/views/employees'),
    // 路由元信息，其实就是一个存储数据的地方，可以放任何内容
    meta: {
      title: '员工管理', // 为什么使用title，因为左侧导航读取这里的title属性
      icon: 'people'
    }
  },
  {
    path: 'detail/:id', // 动态路由传参 id后面加？表示参数可传可不传
    component: () => import('@/views/employees/detail'),
    hidden: true, // 表示该内容不在左侧菜单显示
    meta: {
      title: '员工详情'
    }
  }]
}

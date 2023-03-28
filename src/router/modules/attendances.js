import Layout from '@/views/attendances'
export default {
  path: '/attendances',
  name: 'attendances',
  component: Layout,
  children: [{
    path: '',
    component: () => (import('@/views/attendances')),
    meta: {
      title: '考勤'
    }
  }]
}

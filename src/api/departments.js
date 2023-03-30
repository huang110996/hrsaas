import request from '@/utils/request'

// 获取组织架构的数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
// 删除组织结构部门
export function delDeparments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}
// 新增组织结构部门
export function addDeparments(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}
// 获取部门详情
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}
// 保存编辑部门的数据
export function updataDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}

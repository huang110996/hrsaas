import request from '@/utils/request'

// 获取所有角色列表
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}
// 获取企业信息数据
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
// 根据ID删除角色
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}
// 根据ID获取角色详情
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}
// 根据ID更新角色
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}
// 添加角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

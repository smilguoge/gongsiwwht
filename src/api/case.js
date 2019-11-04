import request from '@/utils/request'

export function getCaseList(query) {
  return request({
    url: '/api/cases/list',
    method: 'get',
    params: query
  })
}

export function deleteAdmin(data) {
  return request({
    url: '/api/cases/delete',
    method: 'delete',
    data
  })
}

export function postCase(data) {
  return request({
    url: '/api/cases/save',
    method: 'post',
    data
  })
}

export function getRoleList(query) {
  return request({
    url: '/api/admin/role/list',
    method: 'get',
    params: query
  })
}

export function deleteRole(data) {
  return request({
    url: '/api/admin/role/delete',
    method: 'delete',
    data
  })
}

export function postRole(data) {
  return request({
    url: '/api/admin/role/save',
    method: 'post',
    data
  })
}

export function getRolePlist(query) {
  return request({
    url: '/api/admin/role/plist',
    method: 'get',
    params: query
  })
}


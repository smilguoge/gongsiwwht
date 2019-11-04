import request from '@/utils/request'

export function getNewsList(query) {
  return request({
    url: '/api/news/list',
    method: 'get',
    params: query
  })
}

export function deleteAdmin(data) {
  return request({
    url: '/api/news/delete',
    method: 'delete',
    data
  })
}

export function postNews(data) {
  return request({
    url: '/api/news/save',
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


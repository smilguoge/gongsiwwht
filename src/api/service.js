import request from '@/utils/request'

export function getServiceList(query) {
  return request({
    url: '/api/service/list',
    method: 'get',
    params: query
  })
}

export function deleteService(data) {
  return request({
    url: '/api/service/delete',
    method: 'delete',
    data
  })
}

export function postService(data) {
  return request({
    url: '/api/service/save',
    method: 'post',
    data
  })
}

export function getServiceSearch(query) {
  return request({
    url: '/api/service/search',
    method: 'get',
    params: query
  })
}


import request from '@/utils/request'

export function getUnionList(query) {
  return request({
    url: '/api/union/list',
    method: 'get',
    params: query
  })
}

export function deleteUnion(data) {
  return request({
    url: '/api/union/delete',
    method: 'delete',
    data
  })
}

export function postUnion(data) {
  return request({
    url: '/api/union/save',
    method: 'post',
    data
  })
}

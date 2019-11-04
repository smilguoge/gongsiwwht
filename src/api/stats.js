import request from '@/utils/request'

export function getSms(query) {
  return request({
    url: '/api/stats/sms',
    method: 'get',
    params: query
  })
}

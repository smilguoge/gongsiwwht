import request from '@/utils/request'

export function getOrderList(query) {
    return request({
      url: '/api/order/list',
      method: 'get',
      params: query
    })
  }



import request from '@/utils/request'

/**
 * @param 支付渠道配置
 */
export function getPaymentList(query) {
  return request({
    url: '/api/payment/list',
    method: 'get',
    params: query
  })
}

/**
 * @param 保存支付渠道
 */
export function postPayment(data) {
  return request({
    url: '/api/payment/save',
    method: 'post',
    data
  })
}


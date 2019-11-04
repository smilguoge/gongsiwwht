import request from '@/utils/request'

export function getCompanyList(query) {
  return request({
    url: '/api/company/list',
    method: 'get',
    params: query
  })
}

export function getCompanySearch(query) {
  return request({
    url: '/api/company/search',
    method: 'get',
    params: query
  })
}

export function deleteCompany(data) {
  return request({
    url: '/api/company/delete',
    method: 'delete',
    data
  })
}

export function postCompany(data) {
  return request({
    url: '/api/company/save',
    method: 'post',
    data
  })
}

export function getCompanyMenuList(query) {
  return request({
    url: '/api/company/menu/list',
    method: 'get',
    params: query
  })
}

export function getCompanyMenuPlist(query) {
  return request({
    url: '/api/company/menu/plist',
    method: 'get',
    params: query
  })
}

export function getCompanyMenutree(query) {
  return request({
    url: '/api/company/menu/tree',
    method: 'get',
    params: query
  })
}

export function deleteCompanyMenu(data) {
  return request({
    url: '/api/company/menu/delete',
    method: 'delete',
    data
  })
}

export function postCompanyMenu(data) {
  return request({
    url: '/api/company/menu/save',
    method: 'post',
    data
  })
}

export function getCompanyAdminList(query) {
  return request({
    url: '/api/company/admin/list',
    method: 'get',
    params: query
  })
}

export function deleteCompanyAdmin(data) {
  return request({
    url: '/api/company/admin/delete',
    method: 'delete',
    data
  })
}

export function postCompanyAdmin(data) {
  return request({
    url: '/api/company/admin/save',
    method: 'post',
    data
  })
}

export function getCompanyRoleList(query) {
  return request({
    url: '/api/company/role/list',
    method: 'get',
    params: query
  })
}

export function getCompanyRoleTree(query) {
  return request({
    url: '/api/company/role/tree',
    method: 'get',
    params: query
  })
}

export function getCompanyDriverList(query) {
  return request({
    url: '/api/company/driver/list',
    method: 'get',
    params: query
  })
}

export function postCompanySetup(data) {
  return request({
    url: '/api/company/setup/save',
    method: 'post',
    data
  })
}

export function getCompanySetupDetail(id) {
  return request({
    url: '/api/company/setup/detail',
    method: 'get',
    params: { id: id }
  })
}
/**
 * 公司支付渠道获取
 */
export function getCompanyChannel(query) {
  return request({
    url: '/api/payment/company_channel',
    method: 'get',
    params: query
  })
}
/**
 * 司机支付渠道获取
 */
export function getDriverChannel(query) {
  return request({
    url: '/api/payment/driver_channel',
    method: 'get',
    params: query
  })
}

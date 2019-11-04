import request from '@/utils/request'

export function getAppSetupList(query) {
  return request({
    url: '/api/app_setup/list',
    method: 'get',
    params: query
  })
}

export function getAppSetupPlist(query) {
  return request({
    url: '/api/app_setup/plist',
    method: 'get',
    params: query
  })
}

export function deleteAppSetup(data) {
  return request({
    url: '/api/app_setup/delete',
    method: 'delete',
    data
  })
}

export function postAppSetup(data) {
  return request({
    url: '/api/app_setup/save',
    method: 'post',
    data
  })
}
/**
 * app 版本列表
 */
export function getAppVersionList(query) {
  return request({
    url: '/api/app_setup/app_version/list',
    method: 'get',
    params: query
  })
}

/**
 * app 版本保存
 */
export function postAppVersionSave(data) {
  return request({
    url: '/api/app_setup/app_version/save',
    method: 'post',
    data
  })
}
/**
 * 删除app版本
 */
export function deleteAppVersion(data) {
  return request({
    url: '/api/app_setup/app_version/delete',
    method: 'delete',
    data
  })
}


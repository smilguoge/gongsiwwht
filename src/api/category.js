import request from '@/utils/request'

export function getCategoryList(query) {
    return request({
      url: '/api/category/list',
      method: 'get',
      params: query
    })
  }

  export function deleteCate(data) {
    return request({
      url: '/api/category/delete',
      method: 'delete',
      data
    })
  }
  
  export function postCate(data) {
    return request({
      url: '/api/category/save',
      method: 'post',
      data
    })
  }


  export function getTagList(query) {
    return request({
      url: '/api/category/tag/list',
      method: 'get',
      params: query
    })
  }

  export function deleteTag(data) {
    return request({
      url: '/api/category/tag/delete',
      method: 'delete',
      data
    })
  }
  
  export function postTag(data) {
    return request({
      url: '/api/category/tag/save',
      method: 'post',
      data
    })
  }


  

 
  
  

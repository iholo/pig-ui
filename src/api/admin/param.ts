import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/admin/param/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/admin/param',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/admin/param/' + id,
    method: 'get'
  })
}

export function delObj(ids?: Object) {
  return request({
    url: '/admin/param',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/admin/param',
    method: 'put',
    data: obj
  })
}
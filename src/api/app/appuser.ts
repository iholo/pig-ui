import request from "/@/utils/request"

export function fetchList(query: any) {
  return request({
    url: '/admin/appuser/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj: any) {
  return request({
    url: '/admin/appuser',
    method: 'post',
    data: obj
  })
}

export function getObj(id: string) {
  return request({
    url: '/admin/appuser/' + id,
    method: 'get'
  })
}

export function delObj(ids?: object) {
  return request({
    url: '/admin/appuser/',
    method: 'delete',
    data:ids
  })
}

export function putObj(obj: any) {
  return request({
    url: '/admin/appuser',
    method: 'put',
    data: obj
  })
}
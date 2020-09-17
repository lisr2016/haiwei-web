import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/cms/get/user/list',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/cms/new/user',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/cms/update/org/info',
    method: 'post',
    data
  })
}

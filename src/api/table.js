import request from '@/utils/request'

export function getUserList(data) {
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

export function updateOrg(data) {
  return request({
    url: '/cms/update/org/info',
    method: 'post',
    data
  })
}

export function getOrgList(data) {
  return request({
    url: '/cms/get/org/list',
    method: 'post',
    data
  })
}

export function addOrg(data) {
  return request({
    url: '/cms/new/org',
    method: 'post',
    data
  })
}

export function deleteOrg(data) {
  return request({
    url: '/cms/delete/org',
    method: 'post',
    data
  })
}


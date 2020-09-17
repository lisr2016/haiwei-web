import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/cms/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/cms/user/info',
    method: 'get',
  })
}

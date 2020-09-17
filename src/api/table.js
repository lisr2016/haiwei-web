import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/cms/get/user/list',
    method: 'post',
    data
  })
}

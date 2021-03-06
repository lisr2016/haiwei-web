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



export function getNotificationList(data) {
  return request({
    url: '/cms/get/notification/list',
    method: 'post',
    data
  })
}

export function updateNotification(data) {
  return request({
    url: '/cms/update/notification/info',
    method: 'post',
    data
  })
}

export function addNotification(data) {
  return request({
    url: '/cms/new/notification',
    method: 'post',
    data
  })
}
export function cancelNotification(data) {
  return request({
    url: '/cms/cancel/notification',
    method: 'post',
    data
  })
}

export function updateUserPassword(data) {
  return request({
    url: '/cms/update/user/password',
    method: 'post',
    data
  })
}

export function updateUserOrg(data) {
  return request({
    url: '/cms/update/user/org',
    method: 'post',
    data
  })
}

export function getTemplateList(data) {
  return request({
    url: '/cms/get/assess/template/list',
    method: 'post',
    data
  })
}

export function addTemplate(data) {
  return request({
    url: '/cms/new/assess/template',
    method: 'post',
    data
  })
}

export function updateTemplate(data) {
  return request({
    url: '/cms/update/assess/template',
    method: 'post',
    data
  })
}

export function deleteTemplate(data) {
  return request({
    url: '/cms/delete/assess/template',
    method: 'post',
    data
  })
}

export function getTaskList(data) {
  return request({
    url: '/cms/get/assess/task/list',
    method: 'post',
    data
  })
}

export function addTask(data) {
  return request({
    url: '/cms/new/assess/task',
    method: 'post',
    data
  })
}

export function deleteTask(data) {
  return request({
    url: '/cms/delete/assess/task',
    method: 'post',
    data
  })
}

export function getPolicyList(data) {
  return request({
    url: '/cms/get/policy/list',
    method: 'post',
    data
  })
}

export function addPolicyList(data) {
  return request({
    url: '/cms/new/policy',
    method: 'post',
    data
  })
}

export function updatePolicyList(data) {
  return request({
    url: '/cms/update/policy/info',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/cms/delete/user',
    method: 'post',
    data
  })
}

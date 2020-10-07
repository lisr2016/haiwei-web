import request from '@/utils/request'

export function getDomesticDaily(data) {
  return request({
    url: '/cms/summary/domestic/daily',
    method: 'post',
    data
  })
}

export function getDomesticWeekly(data) {
  return request({
    url: '/cms/summary/domestic/weekly',
    method: 'post',
    data
  })
}

export function getDomesticMonthly(data) {
  return request({
    url: '/cms/summary/domestic/monthly',
    method: 'post',
    data
  })
}
export function getMedicMonthly(data) {
  return request({
    url: '/cms/summary/medic/monthly',
    method: 'post',
    data
  })
}
export function getSummaryTotal(params) {
  return request({
    url: '/cms/summary/total',
    method: 'get',
    params
  })
}

export function getSummaryScreen(data) {
  return request({
    url: '/cms/summary/screen',
    method: 'post',
    data
  })
}



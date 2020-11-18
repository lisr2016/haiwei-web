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

export function getBarrelMonthly(data) {
  return request({
    url: '/cms/summary/barrel/monthly',
    method: 'post',
    data
  })
}

export function getReportSubmitted(data) {
  return request({
    url: '/cms/report/submitted',
    method: 'post',
    data
  })
}

export function getReportDetail(data) {
  return request({
    url: '/cms/report/detail',
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



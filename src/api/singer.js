import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios';

export function getSingerList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  
    const data = Object.assign({}, commonParams, {
      channel: 'singer',
      page: 'list',
      key: 'all_all_all',
      pagesize: 100,
      pagenum: 1,
      hostUin: 0,
      needNewCode: 0,
      platform: 'yqq'
    })
  
    return jsonp(url, data, options)
  }
  
  export function getSingerDetail(singerId) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  
    const data = Object.assign({}, commonParams, {
      hostUin: 0,
      needNewCode: 0,
      platform: 'yqq',
      order: 'listen',
      begin: 0,
      num: 80,
      songstatus: 1,
      singermid: singerId
    })
  
    return jsonp(url, data, options)
  }

export function getMusic(songmid) {
    const url = '/api/music'
    const data = Object.assign({}, commonParams, {
      songmid: songmid,
      filename: 'C400' + songmid + '.m4a',
      guid: 4866459368, //会变，以实时抓取的数据为准
      platform: 'yqq',
      loginUin: 0,
      hostUin: 0,
      needNewCode: 0,
      cid:205361747,
      uin: 0,
      format: 'json'
    })
    return axios.get(url, {
      params: data
    }).then((res) => {
      return Promise.resolve(res.data)
    })
}
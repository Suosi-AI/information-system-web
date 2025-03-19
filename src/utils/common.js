import weibo from './../assets/images/icon/weibo.png';
import weixin from './../assets/images/icon/weixin.png';
import google from './../assets/images/icon/google.png';
import blog from './../assets/images/icon/blog.png';
import wangzhan from './../assets/images/icon/new.png';
import baidu from './../assets/images/icon/baidu.png';
import twitter from './../assets/images/icon/twitter.png';
import facebook from './../assets/images/icon/facebook.png';
import youtube from './../assets/images/icon/youtube.png';
import telegram from './../assets/images/icon/telegram.png';
import zhiku from './../assets/images/icon/zhiku.svg';

import moment from 'moment';
import { getFavoritesList } from 'src/services/store';

export const primaryColor = '#02f3dd';

export const articleBodyStyle = {
  display: '-webkit-box',
  maxHeight: '4.5em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  cursor: "'pointer'",
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: '3',
};

export const sourceTypeImg = sourceType => {
  switch (sourceType) {
    case '微博':
      return weibo;
    case '公众号':
      return weixin;
    case '谷歌':
      return google;
    case '博客':
      return blog;
    case '网站':
      return wangzhan;
    case '百度':
      return baidu;
    case '推特':
      return twitter;
    case '脸书':
      return facebook;
    case '油管':
      return youtube;
    case '电报':
      return telegram;
    case '智库':
      return zhiku;

    default:
      return '';
  }
};

export function downloadBlob(resp, filename) {
  // 创建 Blob 对象
  const blob = new Blob([resp], { type: 'application/vnd.ms-xls;charset=utf-8' });

  // 生成 URL
  const url = window.URL.createObjectURL(blob);

  // 创建一个 <a> 元素并设置相关属性
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.download = `${filename}`; // 设置下载文件的名称

  // 将 <a> 元素添加到页面中并触发点击
  document.body.appendChild(link);
  link.click();

  // 清理操作
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function downloadPdf(urlPath) {
  const response = await fetch(urlPath);
  // 创建 Blob 对象
  const blob = new Blob([await response.blob()], { type: 'application/vnd.ms-word;charset=utf-8' });

  // 生成 URL
  const url = window.URL.createObjectURL(blob);

  // 创建一个 <a> 元素并设置相关属性
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.download = '报告.pdf'; // 设置下载文件的名称

  // 将 <a> 元素添加到页面中并触发点击
  document.body.appendChild(link);
  link.click();

  // 清理操作
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export const highLight = (input, keyword) => {
  // 增加空值检查
  if (!input) return input;

  if (!keyword || keyword.trim() === '') {
    return input;
  }

  const keywords = keyword.match(
    /([\u4e00-\u9fa5a-zA-Z0-9\(\)]+)(?=([\+\|]+))|(?<=([\+\|]+))([\u4e00-\u9fa5a-zA-Z0-9\(\)]+)/gi
  ) ?? [keyword];
  const pattern = keywords
    .map(part => part.trim().replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ''))
    .join('|');
  const regexp = new RegExp(pattern, 'gi');

  const res = input.replaceAll(regexp, part => {
    return `<span style="color: red">${part}</span>`;
  });

  return <span dangerouslySetInnerHTML={{ __html: res }} />;
};

export const calculateTimeRange = range => {
  const endDate = new Date(); // 结束时间为当前时间
  let startTime;

  switch (range) {
    case '24h':
      startTime = new Date(endDate.getTime() - 3600 * 1000 * 24 * 1); // 24小时
      break;
    case '1w':
      startTime = new Date(endDate.getTime() - 3600 * 1000 * 24 * 7); // 一周
      break;
    case '1m':
      startTime = new Date(endDate.getTime() - 3600 * 1000 * 24 * 30); // 一月
      break;
    case '1y':
      startTime = new Date(endDate.getTime() - 3600 * 1000 * 24 * 365); // 一年
      break;
    default:
      startTime = new Date(endDate.getTime() - 3600 * 1000 * 24 * 1); // 24小时
  }

  return [moment(startTime, 'YYYY-MM-DD HH:mm:ss'), moment(endDate, 'YYYY-MM-DD HH:mm:ss')];
};

export let collects = [];

export async function fetchCollects() {
  try {
    const response = await getFavoritesList();
    if (response.code === 200 && response.data) {
      collects = response.data;
    }
  } catch (error) {
    console.error('获取收藏夹列表失败:', error);
  }
}

fetchCollects();

import axios from 'axios';
import { message } from 'antd';
import { Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const defaultConfig = {
  baseURL: '/dev-api',
  // baseURL: 'http://localhost:8899',
  // timeout: 120 * 1000,
  withCredentials: true,
  headers: {
    'content-type': 'application/json',
  },
};

const customHistory = createBrowserHistory();
const request = (method = 'get', url, { params = {}, config } = {}) => {
  const finalConfig = { ...defaultConfig, ...config };
  const instance = axios.create(finalConfig);
  // const navigate = getNavigate() // 获取 navigate 实例

  instance.interceptors.request.use(request => {
    const token = localStorage.getItem('token');
    if (token) {
      request.headers['token'] = token;
    }
    return request;
  });

  // 响应拦截器
  instance.interceptors.response.use(
    response => {
      if (response.data.code === 401) {
        // 如果token失效，则跳转到登录页面
        localStorage.removeItem('token');
        message.success('登录失效，请重新登录');
        // customHistory.push('/#/login');
        window.location.href = '/#/login';
      }

      return response.data;
    },
    error => {
      // if (error.response && error.response.data.code === 401) {
      //   message.success('token失效，请重新登录')
      //   // navigate('/login') // 使用 navigate 进行导航
      //   window.location.href = '/#/login'
      // } else {
      message.error(error.response?.msg || '系统出错！');
      // }
      return Promise.reject(error);
    }
  );

  // 清理params中的undefined或null值
  Object.keys(params).forEach(item => {
    if (params[item] === undefined || params[item] === null) {
      delete params[item];
    }
  });

  const data =
    finalConfig.headers['content-type'] === 'application/json'
      ? JSON.stringify(params)
      : require('qs').stringify(params);

  return instance({
    method,
    url,
    params: method === 'get' || method === 'delete' ? params : undefined,
    data: method === 'post' || method === 'put' || method === 'patch' ? data : undefined,
    headers: finalConfig.headers,
    ...config,
  });
};

export default request;

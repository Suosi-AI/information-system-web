module.exports = {
  proxy: {
    '/dev-api': {
      // target: 'http://192.168.102.31:8899', // 后端服务地址
      // target: 'http://192.168.101.29:8881', // 后端服务地址
      target: 'http://192.168.101.29:8899', // 后端服务地址
      changeOrigin: true, // 改变请求头中的host信息
      pathRewrite: {
        '^/dev-api': '',
      },
    },
    '/images': {
      // 新增的代理规则，用于图片
      // target: 'http://10.10.16.189:10000', // 图片服务地址
      target: 'http://180.167.238.140:10000', // 图片服务地址
      changeOrigin: true,
      pathRewrite: {
        '^/images': '',
      },
    },
  },
};

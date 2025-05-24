module.exports = {
  proxy: {
    '/dev-api': {
      // target: 'http://192.168.102.31:8899', // 后端服务地址
      // target: 'http://192.168.101.29:8881', // 后端服务地址
      target: process.env.SERVER_URL || 'http://hj-server:8899', // access server url through docker container name or docker compose service name
      changeOrigin: true, // 改变请求头中的host信息
      pathRewrite: {
        '^/dev-api': '',
      },
    },
    '/images': {
      // 新增的代理规则，用于图片
      target: 'http://10.10.16.189:10000', // 图片服务地址
      // target: 'http://192.168.102.23:10000', // 图片服务地址
      changeOrigin: true,
      pathRewrite: {
        '^/images': '',
      },
    },
  },
};

const axios = require('axios');

axios.interceptor.response.use(res => {
  return res.data
})

/**
 * 获取
 */
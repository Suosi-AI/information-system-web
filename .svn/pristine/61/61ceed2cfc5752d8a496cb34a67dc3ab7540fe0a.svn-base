import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from './../types' // 注意这里应该是types，不是type
import axios from 'axios'

export const login = (username, password) => {
  return async dispatch => {
    dispatch({ type: LOGIN_REQUEST })

    try {
      const response = await axios.post('/intelligence/api/sysUser/login', {
        username,
        password
      })

      if (response.status === 200 && response.data.token) { // 确保后端返回了token
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            token: response.data.token,
            username: response.data.username, // 假设后端返回了用户名
            rank: response.data.rank // 假设后端返回了权限字段
          }
        })

        localStorage.setItem('token', response.data.token) // 存储token到localStorage
        localStorage.setItem('username', response.data.username) // 存储用户名到localStorage
        localStorage.setItem('permissions', JSON.stringify(response.data.permissions)) // 存储权限到localStorage
      } else {
        // 处理后端返回的错误情况
        dispatch({
          type: LOGIN_FAILURE,
          payload: new Error('登录失败：' + (response.data.message || '未知错误'))
        })
      }
    } catch (error) {
      dispatch({
        type: LOGIN_FAILURE,
        payload: error
      })
    }
  }
}
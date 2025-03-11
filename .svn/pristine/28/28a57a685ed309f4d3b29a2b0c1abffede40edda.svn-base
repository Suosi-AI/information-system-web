import { useEffect } from 'react';
import { localStorage } from 'antd';

const useAuth = requiredRank => {
  const rank = JSON.parse(localStorage.getItem('rank'));

  useEffect(() => {
    console.log('====================================');
    console.log('useAuth');
    console.log('====================================');
    if (!rank || rank !== requiredRank) {
      // 如果用户没有权限，清除本地存储中的用户信息
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('rank');
    }
  }, [rank, requiredRank]);

  // 返回用户是否有权限的布尔值
  return rank === requiredRank;
};

export default useAuth;

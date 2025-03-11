// useCollect.js
import { useState } from 'react';

function useCollect() {
  const [isCollected, setIsCollected] = useState(false);

  const handleCollect = () => {
    setIsCollected(true);
    // 这里添加收藏的逻辑
  };

  const handleCancelCollect = () => {
    setIsCollected(false);
    // 这里添加取消收藏的逻辑
  };

  return {
    isCollected,
    handleCollect,
    handleCancelCollect,
  };
}

export default useCollect;

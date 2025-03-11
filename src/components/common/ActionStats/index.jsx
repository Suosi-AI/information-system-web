import React from 'react';
import { LikeOutlined, MessageOutlined, ShareAltOutlined, EyeOutlined } from '@ant-design/icons';
import styles from './index.less';
const ActionStats = ({ likeNum, commentNum, shareNum, readNum }) => {
  return (
    <p style={{ display: 'flex', width: '25%', justifyContent: 'space-between' }}>
      <span>
        <LikeOutlined />
        <span>{likeNum}</span>
      </span>
      <span>
        <MessageOutlined />
        <span>{commentNum}</span>
      </span>
      <span>
        <ShareAltOutlined />
        <span>{shareNum}</span>
      </span>
      <span>
        <EyeOutlined />
        <span>{readNum}</span>
      </span>
    </p>
  );
};

export default ActionStats;

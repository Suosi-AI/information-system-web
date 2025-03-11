import React, { useState } from 'react';
import { Card, Dropdown, Menu } from 'antd';
import {
  FileWordTwoTone,
  StarOutlined,
  LinkOutlined,
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  EyeOutlined,
  StarFilled,
} from '@ant-design/icons';
import styles from './index.less';
const CollectionDropdown = ({ isCollected, setIsCollected }) => {
  const handleMenuClick = e => {
    setIsCollected(!isCollected);
    console.log('666666666666');
    // 这里可以添加更多的逻辑，比如发送请求到服务器收藏或取消收藏文章
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="0">默认收藏夹</Menu.Item>
      <Menu.Item key="1">工作收藏夹</Menu.Item>
      <Menu.Item key="2">个人收藏夹</Menu.Item>
    </Menu>
  );

  return (
    <span style={{ display: 'flex', lineHeight: '20px' }}>
      {isCollected ? (
        <StarFilled style={{ fontSize: '22px', marginRight: '2px', color: 'orange' }} />
      ) : (
        <StarOutlined style={{ fontSize: '22px', marginRight: '2px', color: 'orange' }} />
      )}
      <Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
        <a style={{ color: 'orange' }} className="ant-dropdown-link">
          {isCollected ? '取消收藏' : '收藏'}
        </a>
      </Dropdown>
    </span>
  );
};
export default CollectionDropdown;

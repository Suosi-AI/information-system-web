import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Icon from '@/components/Icon';
import styles from './topMenu.less';
import './topMenu.less';

const TopMenu = () => {
  const navigate = useNavigate();

  const [topMenuList, setTopMenuList] = useState([
    {
      name: '海清速查',
      id: '1',
      icon: 'MonitorOutlined',
      url: '/dashboard',
    },
    {
      name: '专题监测',
      id: '2',
      icon: 'LineChartOutlined',
      url: '/topic',
    },
    {
      name: '海警情报',
      id: '3',
      icon: 'ReconciliationOutlined',
      url: '/intelligence',
    },
    {
      name: '报告平台',
      id: '4',
      icon: 'StarOutlined',
      url: '/favorites',
    },
    {
      name: '天眼监控',
      id: '5',
      icon: 'AimOutlined',
      url: '/monitoring',
    },
    {
      name: '专业术语',
      id: '6',
      icon: 'AimOutlined',
      url: '/words',
    },
    {
      name: '全球智库',
      id: '7',
      icon: 'AimOutlined',
      url: '/thinkTank',
    },
  ]);
  const [active, setActive] = useState('1');

  const changeMenu = p => {
    setActive(p.id);
  };

  const navigateTo = url => {
    // window.location.href = url + '/';
    console.log('url==', url);
    navigate(url);
  };

  const getTopMenuList = () => {
    return topMenuList.map(p => (
      <div
        key={p.id}
        className={[styles.topMenuContent, active === p.id ? styles.topMenuContentActive : ''].join(
          ' '
        )}
        onClick={() => {
          console.log(p, 'pppppppppppp');

          changeMenu(p);
          navigateTo(p.url);
        }}
      >
        <Icon name={p.icon} />
        <div>{p.name}</div>
      </div>
    ));
  };

  return <div className={styles.TopMenu}>{getTopMenuList()}</div>;
};

export default TopMenu;

import React, { lazy } from 'react';
import {
  DashboardOutlined,
  StarOutlined,
  AimOutlined,
  FormOutlined,
  MonitorOutlined,
  LineChartOutlined,
  ReconciliationOutlined,
} from '@ant-design/icons';
import { Navigate } from 'react-router-dom';
export const insideRoutes = [
  {
    path: 'home',
    title: '数据采集',
    id: '1',
    icon: <MonitorOutlined />,
    element: lazy(() => import('@/pages/Dashboard')),
  },
  {
    path: 'social',
    title: '分类导航',
    id: '2',
    icon: <LineChartOutlined style={{ fontSize: '16px' }} />,
    element: lazy(() => import('@/pages/Social')),
  },
  {
    path: 'archives',
    title: '百科数据',
    id: '3',
    icon: <ReconciliationOutlined style={{ fontSize: '16px' }} />,
    element: lazy(() => import('@/pages/Archives')),
    // disabled: true,
  },

  {
    path: 'favorites',
    title: '报告平台',
    id: '4',
    icon: <StarOutlined style={{ fontSize: '16px' }} />,

    element: lazy(() => import('@/pages/Favorites/index.jsx')),
    // disabled: true,
  },

  {
    path: 'monitoring',
    title: '天眼监控',
    id: '5',
    icon: <AimOutlined style={{ fontSize: '16px' }} />,
    // element: (
    //   window.location.href = 'https://www.baidu.com' // 使用Navigate组件进行重定向
    // ),
    element: lazy(() => import('@/pages/Monitoring/index.jsx')),
    // disabled: true,
  },

  {
    path: 'word',
    title: '专业术语',
    id: '7',
    icon: <StarOutlined style={{ fontSize: '16px' }} />,

    element: lazy(() => import('@/pages/Word/index.jsx')),
    // disabled: true,
  },

  // {
  //   path: 'thinkTank',
  //   title: '全球智库',
  //   id: '8',
  //   icon: <ReconciliationOutlined style={{ fontSize: '16px' }} />,

  //   element: lazy(() => import('@/pages/ThinkTank/index.jsx')),
  //   // disabled: true,
  // },

  {
    path: 'dataAnylasis',
    title: '数据分析',
    id: '9',
    icon: <LineChartOutlined style={{ fontSize: '16px' }} />,

    element: lazy(() => import('@/pages/DataAnalysis/index.jsx')),
    // disabled: true,
  },

  {
    path: 'userManagement',
    title: '用户管理',
    id: '5',
    icon: <AimOutlined style={{ fontSize: '16px' }} />,

    element: lazy(() => import('@/pages/UserManagement/index.jsx')),
    hidden: true,
    // disabled: true,
    rank: '1', // 只有管理员（rank为1）可以访问
    permission: 'admin', // 需要管理员权限
  },
  {
    path: 'userLogs',
    title: '系统日志',
    id: '6',
    icon: <AimOutlined style={{ fontSize: '16px' }} />,

    element: lazy(() => import('@/pages/UserLogs/index.jsx')),
    hidden: true,
    // disabled: true,
    rank: '1', // 只有管理员（rank为1）可以访问
    permission: 'admin', // 需要管理员权限
  },
  {
    path: '/',
    hidden: true,
    redirect: 'login',
  },

  // {
  //   path: '*',
  //   title: '404',
  //   element: lazy(() => import('@/components/common/NotFound')),
  //   hidden: true,
  //   disabled: true,
  // },
];

import React, { Suspense, useRef } from 'react';
import { Layout as Container } from 'antd';
import SideBar from './NavBar';
import TopBar from './TopBar';
import NavBar from './SideBar';
import SettingMenu from '@/components/common/SettingMenu';
import { Outlet, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { insideRoutes } from '@/router';
import RouteLoading from '../RouteLoading';
import { getRoutes, getNavigateRoutes } from '../RouteMap';
import BreadcrumbGroup from '../BreadcrumbGroup';
import styles from './index.less';
import cls from 'classnames';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import navLogo from '@/assets/images/login_logo.png';

const { Content } = Container;
const Layout = () => {
  const location = useLocation();
  const container = useRef(null);
  const { menuMode } = useSelector(state => state.SettingReducer);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {/* <Link to="/"> */}
        <img className={styles.navLogo} src={navLogo} alt="logo" />
        {/* </Link> */}
        <TopBar />
      </div>
      <div className={styles.main}>
        <Content
          className={cls({ [styles.mixin]: menuMode === 'mixin' })}
          style={{ overflow: 'hidden' }}
        >
          <Suspense fallback={<RouteLoading />}>
            <div className={styles.content} ref={container}>
              <Routes>{getNavigateRoutes(insideRoutes)}</Routes>
              <SwitchTransition>
                <CSSTransition
                  appear
                  timeout={500}
                  classNames="page-transition"
                  unmountOnExit
                  nodeRef={container}
                  key={location.pathname}
                >
                  <Routes location={location}>{getRoutes(insideRoutes)}</Routes>
                </CSSTransition>
              </SwitchTransition>
              <Outlet />
            </div>
          </Suspense>
        </Content>
      </div>
    </div>
    // <Container>
    //   {/* <Container className={cls({ [styles.inline]: menuMode === 'inline' })}> */}

    // </Container>
  );
};
export default Layout;

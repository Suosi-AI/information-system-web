import React, { useState, useEffect } from 'react';
import { Modal, Image, Menu, Dropdown } from 'antd';
import {
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  EyeOutlined,
  TranslationOutlined,
  FileWordTwoTone,
  StarOutlined,
  StarFilled,
} from '@ant-design/icons';
import styles from './index.less';
import weibo from './../../../assets/images/icon/weibo.png';
import weixin from './../../../assets/images/icon/weixin.png';
import google from './../../../assets/images/icon/google.png';
import blog from './../../../assets/images/icon/blog.png';
import wangzhan from './../../../assets/images/icon/new.png';
import baidu from './../../../assets/images/icon/baidu.png';
import twitter from './../../../assets/images/icon/twitter.png';
import facebook from './../../../assets/images/icon/facebook.png';
import youtube from './../../../assets/images/icon/youtube.png';
import telegram from './../../../assets/images/icon/telegram.png';
// import { highLight } from './../../../pages/Dashboard/index';

import { collectNew, getFavoritesList, cancelCollectNew } from './../../../services/store';

const BASE_IP = '/images';
const replaceIP = url => {
  const urlObj = new URL(url);
  return `${BASE_IP}${urlObj.pathname}`;
};
const CardModal = ({
  visible,
  onCancel,
  modalData,
  setIsModalVisible,
  showActions = true,
  handleExport,
  images,
  isModalVisible,
  isCollected,
  setIsCollected,
  videos,
  onHandle,
  onHandleHq,
  onHandleJc,
}) => {
  const dynamicImg = sourcetype => {
    switch (sourcetype) {
      case '微博':
        return weibo;
      case '公众号':
        return weixin;
      case '谷歌':
        return google;
      case '博客':
        return blog;
      case '网站':
        return wangzhan;
      case '百度':
        return baidu;
      case '推特':
        return twitter;
      case '脸书':
        return facebook;
      case '油管':
        return youtube;
      case '电报':
        return telegram;




      default:
        return '';
    }
  };
  const [displayRawContent, setDisplayRawContent] = useState(false);
  // const [isCollected, setIsCollected] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  const toggleContent = () => {
    setDisplayRawContent(!displayRawContent);
  };
  const highLight = (text, keyword) => {
    // 增加空值检查
    if (!text) return '';

    if (!keyword || keyword.trim() === '') {
      return text;
    }
    const regex = new RegExp(`(${keyword})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <span key={index} style={{ color: 'red' }}>
            {part}
          </span>
        );
      } else {
        return part;
      }
    });
  };

  const processedModalData = {
    ...modalData,
    titlezh: highLight(modalData?.titlezh, modalData?.searchQuery),
    contentzh: highLight(modalData?.contentzh, modalData?.searchQuery),
    contentraw: highLight(modalData?.contentraw, modalData?.searchQuery),
    summary: highLight(modalData?.summary, modalData?.searchQuery),
  };

  const imagesArray = Array.isArray(images) ? images : images ? JSON.parse(images) : [];

  const videosArray = Array.isArray(videos) ? videos : videos ? JSON.parse(videos) : [];
  const imagesWithNewIP = imagesArray.map(src => replaceIP(src));
  const videosWithNewIP = videosArray.map(src => replaceIP(src));

  const whetherCollect = modalData?.whetherCollect;
  const newsId = modalData?.id;
  const folderId = modalData?.folderId;

  // useEffect(() => {
  //   if (typeof whetherCollect === 'string' && whetherCollect === '1') {
  //     setIsCollected(true);
  //   } else {
  //     setIsCollected(false);
  //   }
  // }, [whetherCollect]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await getFavoritesList();
        if (response.code === 200 && response.data) {
          setFavorites(response.data);
        }
      } catch (error) {
        console.error('获取收藏夹列表失败:', error);
      }
    };

    fetchFavorites();
  }, []);

  const toggleMenu = () => {
    // if (whetherCollect === '1') {
    //   return;
    // }
    setShowMenu(true);
  };

  const handleOpenChange = val => {
    if (!val) {
      setShowMenu(false);
    }
  };

  const handleMenuClick = async e => {
    const favoriteId = e.key;
    // setCurrentFavorite(favorite => (favoriteId === favorite?.id ? null : favoriteId));

    try {
      const response = await collectNew({
        newsId: newsId,
        folderId: favoriteId,
      });
      if (response.code === 200) {
        console.log('收藏成功');
        setIsModalVisible(false);
        onHandle && onHandle();
        // setIsCollected(true);
        onHandleHq && onHandleHq();
        onHandleJc && onHandleJc();
        getFavoritesList();
      } else {
        console.error('收藏失败:', response.message);
      }
    } catch (error) {
      console.error('收藏失败:', error);
    }
    // }
  };

  const cancelCollect = async () => {
    try {
      const response = await cancelCollectNew({
        newsId: newsId,
        folderId: folderId,
      });
      if (response.code === 200) {
        console.log('取消收藏成功');
        setIsModalVisible(false);
        onHandle && onHandle();
        onHandleHq && onHandleHq();
        onHandleJc && onHandleJc();
      } else {
        console.error('取消收藏失败:', response.message);
      }
    } catch (error) {
      console.error('取消收藏失败:', error);
    }
  };

  const menu = (
    <Menu
      onClick={handleMenuClick}
      style={{
        maxWidth: '250px',
        minWidth: '200px',
        minHeight: '50px',
        maxHeight: '350px',
        overflow: 'auto',
      }}
    >
      {favorites.map(favorite => (
        <Menu.Item key={favorite.folder_id}>{favorite.folder_name}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Modal
      // title={modalData?.titlezh}
      title={processedModalData.titlezh || ''}
      visible={visible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
      className={styles.cardModal}
      width={1000}
    >
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.medalHeader1}>
            <img
              src={dynamicImg(modalData?.sourcetype)}
              alt="source-icon"
              className={styles.sourceIcon}
            />
            <div className={styles.info}>
              <span className={styles.label}>来源：</span>
              {modalData?.sourcetype}
            </div>
          </div>
          <div className={styles.info}>
            <span className={styles.label}>发布时间：</span>
            {modalData?.publishtime}
          </div>
          {showActions && (
            <div className={styles.actions}>
              <span className={styles.actionItem}>
                <LikeOutlined /> {modalData.likenum}
              </span>
              <span className={styles.actionItem}>
                <MessageOutlined /> {modalData.commentnum}
              </span>
              <span className={styles.actionItem}>
                <ShareAltOutlined /> {modalData.sharenum}
              </span>
              <span className={styles.actionItem}>
                <EyeOutlined /> {modalData.readnum}
              </span>
            </div>
          )}
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalBodyTop}>
            <div className={styles.metadata}>
              <span className={styles.label}>作者：</span>
              {modalData?.sourcename}
            </div>
            <div className={styles.metadata}>
              <span className={styles.label}>语种：</span>
              {modalData?.lang}
            </div>
            <div className={styles.metadata1}>
              <span className={styles.label1}>原文地址：</span>
              <a
                className={styles.link}
                href={modalData?.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  maxWidth: '400px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {modalData?.url}
              </a>
            </div>
          </div>
          <div className={styles.controls}>
            {/* <span className={styles.controlsSpan} onClick={toggleContent}>
              <TranslationOutlined style={{ color: '#EAB308', marginRight: '8px' }} />
              <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                {displayRawContent ? '中文' : '原文'}
              </span>
            </span> */}
            <span className={styles.controlsSpan}>
              <FileWordTwoTone style={{ marginRight: '8px' }} />
              <span
                onClick={handleExport}
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
              >
                导出
              </span>
            </span>
            {/* <span className={styles.controlsSpan}>
              <StarOutlined style={{ color: 'orange', marginRight: '8px' }} />
              <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>收藏</span>
            </span> */}
            <span style={{ display: 'flex', lineHeight: '20px' }}>
              {whetherCollect === '1' ? (
                <StarFilled
                  onClick={cancelCollect}
                  style={{ fontSize: '22px', marginRight: '2px', color: 'orange' }}
                />
              ) : (
                <StarOutlined style={{ fontSize: '22px', marginRight: '2px', color: 'orange' }} />
              )}
              {whetherCollect !== '1' ? (
                <Dropdown
                  overlay={menu}
                  placement="bottomCenter"
                  trigger={['click']}
                  open={isCollected}
                  onOpenChange={handleOpenChange}
                >
                  <a
                    style={{ color: 'white' }}
                    className="ant-dropdown-link"
                    onClick={handleMenuClick}
                  >
                    收藏
                  </a>
                </Dropdown>
              ) : (
                <a style={{ color: 'white' }} className="ant-dropdown-link" onClick={cancelCollect}>
                  取消收藏
                </a>
              )}
            </span>
          </div>
          <div className={styles.content}>
            摘要：<pre
                style={{
                  maxWidth: '100%',
                  whiteSpace: 'pre-wrap',
                  // background: 'rgba(79, 75, 74, 0.17)',
                  background: '#696969',
                  padding: '15px 0',
                }}
              >
                {processedModalData.summary || "\n"}
              </pre>
            译文：<pre style={{ maxWidth: '100%', whiteSpace: 'pre-wrap' }}>
              {/* {displayRawContent ? processedModalData.contentraw : processedModalData.contentzh} */}
              {processedModalData.contentzh || "\n"}
            </pre>
            原文：<pre style={{ maxWidth: '100%', whiteSpace: 'pre-wrap', background: '#696969'}}>
              {processedModalData.contentraw}
            </pre>
          </div>
          <div className={styles.images}>
            {(imagesArray.length > 0 || videosArray.length > 0) && (
              <div className={styles.mediaContainer}>
                {imagesWithNewIP.map((src, index) => (
                  <Image
                    key={index}
                    src={src}
                    alt="Logo"
                    style={{ width: '150px', height: '100px', marginRight: '8px' }}
                  />
                ))}
                {videosWithNewIP.map((src, index) => (
                  <video
                    key={index}
                    controls
                    style={{ width: '150px', height: '100px', marginRight: '8px' }}
                  >
                    <source src={src} type="video/mp4" />
                  </video>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CardModal;

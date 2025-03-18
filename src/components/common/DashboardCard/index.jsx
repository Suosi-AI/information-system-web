import React, { useState, useEffect } from 'react';
import { Card, Button, Tag, Dropdown, Menu, Image, Modal } from 'antd';
import {
  FileWordTwoTone,
  StarOutlined,
  LinkOutlined,
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  EyeOutlined,
  StarFilled,
  FilePdfTwoTone,
} from '@ant-design/icons';
import styles from './index.less';

import { sourceTypeImg } from 'src/utils/common';

const BASE_IP = '/images';

const replaceIP = url => {
  const urlObj = new URL(url);
  return `${BASE_IP}${urlObj.pathname}`;
};

export const dynamicImg = sourceTypeImg;

async function downloadPdf(urlPath) {
  const response = await fetch(urlPath);
  // 创建 Blob 对象
  const blob = new Blob([await response.blob()], { type: 'application/vnd.ms-word;charset=utf-8' });

  // 生成 URL
  const url = window.URL.createObjectURL(blob);

  // 创建一个 <a> 元素并设置相关属性
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.download = '报告.pdf'; // 设置下载文件的名称

  // 将 <a> 元素添加到页面中并触发点击
  document.body.appendChild(link);
  link.click();

  // 清理操作
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

import { collectNew, getFavoritesList, cancelCollectNew } from './../../../services/store';

const DashboardCard = ({
  img,
  sourceName,
  title,
  content,
  contentType,
  link,
  images, // 图片数组
  videos, // 视频数组
  likeNum,
  commentNum,
  shareNum,
  readNum,
  showActions = true,
  onClickContent,
  publishTime,
  lang,
  onExport,
  newsId,
  whetherCollect,
  folderId,
  onHandle,
  onHandleHq,
  onHandleJc,
  isCollected,
  setIsCollected,
  summary,
  files,
  ...props
}) => {
  // const [isCollected, setIsCollected] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentFavorite, setCurrentFavorite] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const hasSamePost = title?.includes('阿布扎比') || content?.includes('阿布扎比');

  const handleCollect = () => {
    setIsCollected(!isCollected);
  };

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

  const handleOpenChange = val => {
    if (!val) {
      setShowMenu(false);
    }
  };

  const handleMenuClick = async e => {
    const favoriteId = e.key;
    setCurrentFavorite(favorite => (favoriteId === favorite?.id ? null : favoriteId));

    setShowMenu(true);
    try {
      const response = await collectNew({
        newsId: newsId,
        folderId: favoriteId,
      });
      if (response.code === 200) {
        console.log('收藏成功');
        // setIsCollected(true);
        // getFavoritesList();
        onHandle && onHandle(favoriteId);
        onHandleHq && onHandleHq();
        onHandleJc && onHandleJc(favoriteId);
      } else {
        console.error('收藏失败:', response.message);
      }
    } catch (error) {
      console.error('收藏失败:', error);
    }
    // }
  };
  const toggleMenu = e => {
    if (whetherCollect === '1') {
      cancelCollect();
    } else {
      handleMenuClick(e);
    }
  };

  const cancelCollect = async () => {
    try {
      const response = await cancelCollectNew({
        newsId: newsId,
        folderId: folderId,
      });
      if (response.code === 200) {
        console.log('取消收藏成功');
        onHandleHq && onHandleHq(); //海情速查列表数据
        onHandle && onHandle(folderId); //收藏管理列表数据
        onHandleJc && onHandleJc(folderId);
        // setIsCollected(false);
      } else {
        console.error('取消收藏失败:', response.message);
      }
    } catch (error) {
      console.error('取消收藏失败:', error);
    }
  };

  const menu = (
    <Menu
      onClick={e => handleMenuClick(e)}
      style={{
        maxWidth: '250px',
        minWidth: '200px',
        minHeight: '200px',
        maxHeight: '350px',
        overflow: 'auto',
      }}
    >
      {favorites.map(favorite => (
        <Menu.Item key={favorite.folder_id}>{favorite.folder_name}</Menu.Item>
      ))}
    </Menu>
  );

  const imagesArray = Array.isArray(images) ? images : images ? JSON.parse(images) : [];
  const videosArray = Array.isArray(videos) ? videos : videos ? JSON.parse(videos) : [];

  const imagesWithNewIP = imagesArray.map(src => replaceIP(src));
  const videosWithNewIP = videosArray.map(src => replaceIP(src));
  // console.log(videosWithNewIP);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Card className={styles.cardStyle}>
      <p className={styles.topCard}>
        <span className={styles.topLeft} onClick={() => onClickContent?.()}>
          <span className={styles.topImg}>
            <img
              style={{ width: '20px', height: '20px', marginRight: '12px' }}
              src={img}
              alt="Logo"
            />
            <span className={styles.topLeft1}>{sourceName}</span>
          </span>
          <span style={{ width: '149px' }}>{publishTime}</span>
        </span>
        <span className={styles.topRight} style={{ justifyContent: 'end', columnGap: '16px' }}>
          {contentType && (
            <>
              内容类型：
              <Button
                type="primary"
                style={{
                  color: 'white',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}
              >
                {contentType}
              </Button>
            </>
          )}
          <span style={{ display: 'flex', lineHeight: '20px' }}>
            <FileWordTwoTone onClick={onExport} style={{ fontSize: '22px', marginRight: '2px' }} />
            <a style={{ color: 'white' }} onClick={onExport}>
              导出
            </a>
          </span>
          <span style={{ display: 'flex', lineHeight: '20px' }}>
            {whetherCollect !== '1' ? (
              <Dropdown
                overlay={menu}
                placement="bottomCenter"
                trigger={['click']}
                open={showMenu}
                onOpenChange={handleOpenChange}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {whetherCollect === '1' ? (
                    <StarFilled
                      onClick={cancelCollect}
                      style={{
                        fontSize: '22px',
                        marginRight: '2px',
                        color: 'orange',
                        cursor: 'pointer',
                      }}
                    />
                  ) : (
                    <StarOutlined
                      style={{
                        fontSize: '22px',
                        marginRight: '2px',
                        color: 'orange',
                        cursor: 'pointer',
                      }}
                    />
                  )}
                  <a style={{ color: 'white' }} className="ant-dropdown-link" onClick={toggleMenu}>
                    收藏
                  </a>
                </div>
              </Dropdown>
            ) : (
              <div>
                <StarFilled
                  style={{
                    fontSize: '22px',
                    marginRight: '2px',
                    color: 'orange',
                    cursor: 'pointer',
                  }}
                />
                <a
                  style={{ color: 'white' }}
                  className="ant-dropdown-link"
                  onClick={e => toggleMenu(e)}
                >
                  取消收藏
                </a>
              </div>
            )}
          </span>
        </span>
      </p>
      <div onClick={onClickContent}>
        <h3 style={{ color: 'white', fontWeight: 'bolder' }}>{title || ''}</h3>
        <p className={styles.pContent}>{content}</p>
      </div>
      {showActions && (
        <p style={{ display: 'flex', width: '25%', justifyContent: 'space-between' }}>
          <span>
            <LikeOutlined />
            <span>{likeNum || 0}</span>
          </span>
          <span>
            <MessageOutlined />
            <span>{commentNum || 0}</span>
          </span>
          <span>
            <ShareAltOutlined />
            <span>{shareNum || 0}</span>
          </span>
          <span>
            <EyeOutlined />
            <span>{readNum || 0}</span>
          </span>
        </p>
      )}
      {link && (
        <p
          style={{
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <LinkOutlined style={{ marginRight: '4px' }} />
          <a href={link} target="_blank" rel="noopener noreferrer">
            {link}
          </a>
        </p>
      )}
      {(imagesArray.length > 0 || videosArray.length > 0) && (
        <div className={styles.mediaContainer} style={{ display: 'flex', overflowX: 'auto' }}>
          {imagesWithNewIP.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt="Logo"
              style={{ width: '150px', height: '100px', marginRight: '8px' }}
              loading="lazy"
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
      {files?.length > 0 &&
        files.map(file => {
          return (
            <span style={{ display: 'flex', lineHeight: '20px' }}>
              <FilePdfTwoTone style={{ fontSize: '22px', marginRight: '2px' }} />
              <a style={{ color: 'white' }} onClick={() => downloadPdf(file)}>
                导出
              </a>
            </span>
          );
        })}

      {/* <Modal
        title="相似文章"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // 不显示默认的底部按钮
        width={800} // 设置 Modal 宽度
      >
        {similarArticles.map(card => (
          <DashboardCard
            className={styles.dashboardCardStyle}
            key={card.id}
            img={sourceTypeImg(card.sourceType)}
            sourceName={card.sourceName}
            sourceType={card.sourceType}
            publishTime={card.publishTime}
            title={card.titleZh}
            content={card.contentZh}
            link={card.url}
            images={card.pics}
            likeNum={card.likeNum}
            commentNum={card.commentNum}
            shareNum={card.shareNum}
            readNum={card.readNum}
            showActions={card.showActions}
            onClickContent={() => handleContentClick(card.id, card.showActions)}
            onCollect={isCollected => handleCollect(card.id, isCollected)}
            onExport={() => handleExport(card.id)}
            whetherCollect={card.whetherCollect}
            // newsId={card.id}
            // folderId={card.folderId}
          />
        ))}
      </Modal> */}
    </Card>
  );
};

export default DashboardCard;

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
} from '@ant-design/icons';
import styles from './index.less';
import weibo from '../../../assets/images/icon/weibo.png';
import weixin from '../../../assets/images/icon/weixin.png';
import google from '../../../assets/images/icon/google.png';
import blog from '../../../assets/images/icon/blog.png';
import wangzhan from '../../../assets/images/icon/new.png';
import baidu from '../../../assets/images/icon/baidu.png';
import twitter from '../../../assets/images/icon/twitter.png';
import facebook from '../../../assets/images/icon/facebook.png';
import youtube from '../../../assets/images/icon/youtube.png';
import telegram from '../../../assets/images/icon/telegram.png';
import zhiku from '../../../assets/images/icon/zhiku.svg';

const BASE_IP = '/images';

const replaceIP = url => {
  const urlObj = new URL(url);
  return `${BASE_IP}${urlObj.pathname}`;
};

export const dynamicImg = sourceType => {
  switch (sourceType) {
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
    case '智库':
      return zhiku;

    default:
      return '';
  }
};

const similarArticles = [
  {
    id: 1,
    sourceName: '美通社',
    sourceType: '网站',
    publishTime: '2024-12-30 12:00:00',
    titleZh: '阿布扎比在 MIPCOM 2024 上推出新现金返还，最低 35%++',
    contentZh: `2024 年 2 月 22 日/美通社/——阿布扎比电影委员会 (ADFC) 旗下的阿布扎比​​创意媒体管理局 (CMA) 今天宣布了一项重大发展，将继续发展、加强和吸引电影和电视制作行业的战略投资。ADFC 将从 2025 年 1 月 1 日起申请的合格制作的当前折扣从 30% 提高到 35%++。此更新将确保好莱坞、宝莱坞和阿拉伯世界的进一步制作。\n创意媒体管理局代理局长穆罕默德·多巴伊 (Mohamed Dobay) 表示：“我们很自豪能够成为第一个提供回扣计划的目的地，并且是拥有良好记录的地区先行者。更新后的财务回扣支持将确保我们继续吸引国际制作人\n和来自世界各地的导演，并成为全球和地区电影和电视制作的领先目的地，举办大片制作拍摄不仅通过交通、物流和住宿为当地经济做出了重大贡献，而且还为电影和电视制作人带来了无与伦比的展示机会。\n目的地，这反过来又为包括旅游业在内的多个行业做出了贡献。`,
    url: 'https://www.prnasia.com/story/474428-1.shtml',
    // pics: ['/images/sample1.jpg'], // 示例图片
    likeNum: 10,
    commentNum: 5,
    shareNum: 2,
    readNum: 100,
  },
  {
    id: 2,
    sourceName: '百度',
    sourceType: '百度',
    publishTime: '2024-12-31 12:26:00',
    titleZh: '2024 年阿布扎比在 MIPCOM 上推出新现金返还',
    contentZh:
      '阿布扎比电影委员会 (ADFC) 旗下的阿布扎比​​创意媒体管理局 (CMA) 今天宣布了一项重大发展，将继续发展、加强和吸引电影和电视制作行业的战略投资。ADFC 将从 2025 年 1 月 1 日起申请的合格制作的当前折扣从 30% 提高到 35%++。此更新将确保好莱坞、宝莱坞和阿拉伯世界的进一步制作。',
    url: 'https://www.taiwannews.com.tw/en/news/5956348',
    // pics: ['/images/sample2.jpg'],
    likeNum: 20,
    commentNum: 10,
    shareNum: 5,
    readNum: 200,
  },
  {
    id: 3,
    sourceName: '泰晤士报',
    sourceType: '网站',
    img: dynamicImg('网站'),
    publishTime: '2024-12-31 12:37:00',
    titleZh: '阿布扎比在 MIPCOM 上推出新现金返还',
    contentZh:
      '阿布扎比电影委员会主席 Sameer Al Jaberi 补充道：“自 2013 年启动我们的回扣计划以来，已有 150 多部主要作品通过该计划受益。独立验证的研究表明，回扣对我们的经济产生了巨大影响。”通过该计划，通过在酋长国举办大型制作，超过三迪拉姆的资金回流到经济中，除了对经济的财政刺激之外，参观制作还为作为国家未来故事讲述者的年轻创意人员提供了巨大的培训机会，这一重点确保了强有力的发展。当我们临近 2025 年 1 月 1 日发放回扣时，我们将与我们现有的生产社区分享更多信息。”',
    url: 'https://www.taiwannews.com.tw/en/news/1286295',
    // pics: ['/images/sample3.jpg'],
    likeNum: 15,
    commentNum: 8,
    shareNum: 3,
    readNum: 150,
  },
];

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

  // useEffect(() => {
  //   // 根据whetherCollect的值来设置isCollected状态
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
        <span className={styles.topLeft} onClick={onClickContent}>
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
        <span className={styles.topRight}>
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
          <div onClick={hasSamePost && showModal} style={{ cursor: 'pointer' }}>
            相似文章：{hasSamePost ? 3 : 0}
          </div>
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

      <Modal
        title="相似文章"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // 不显示默认的底部按钮
        width={800} // 设置 Modal 宽度
      >
        {/* 在 Modal 中嵌套 DashboardCard 组件 */}
        {/* <DashboardCard /> */}
        {/* 如果需要多个 DashboardCard，可以使用 map 函数渲染多个 */}
        {similarArticles.map(card => (
          <DashboardCard
            className={styles.dashboardCardStyle}
            key={card.id}
            img={dynamicImg(card.sourceType)}
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
      </Modal>
    </Card>
  );
};

export default DashboardCard;

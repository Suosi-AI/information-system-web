import React, { useState } from 'react';
import {
  sourceTypeImg,
  primaryColor,
  articleBodyStyle,
  collects,
  downloadBlob,
  downloadPdf,
  highLight as keywordHightlight,
} from 'src/utils/common';
import { collectNew, cancelCollectNew, downNewsWord, getInfo } from 'src/services/store';
import ReportDetail from './ReportDetail';

import { Button, Image, Dropdown, Menu, Modal, message } from 'antd';
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

const icons = ['likeNum', 'commentNum', 'shareNum', 'readNum'];

async function fetchReportDetail(id) {
  try {
    const response = await getInfo({ newsId: id });

    if (response.code === 200 && response.data) {
      return response.data;
    } else {
      console.error(response.message ?? '获取失败');
    }
  } catch (error) {
    message.error('获取时发生错误');
  }
  return {};
}

async function onExport(id) {
  if (!id) {
    message.error('文章id不能为空');
    return;
  }
  const respone = await downNewsWord({ newsId: id });
  downloadBlob(respone, '新闻.doc');
  message.success('导出成功');
}

export function ReportTag({ text, style = {} }) {
  return (
    <Button
      type="primary"
      style={{
        border: `1px solid ${primaryColor}`,
        color: 'white',
        backgroundColor: 'transparent',
        ...style,
      }}
    >
      {text}
    </Button>
  );
}

export function ReportDataIcon({ report, prop, render, style = {} }) {
  const reportIconMappings = {
    likeNum: () => <LikeOutlined />,
    commentNum: () => <MessageOutlined />,
    shareNum: () => <ShareAltOutlined />,
    readNum: () => <EyeOutlined />,
    url: () => <LinkOutlined />,
  };

  if (!reportIconMappings[prop] && !report[prop]) {
    return <React.Fragment />;
  }

  return (
    <span style={{ display: 'flex', alignItems: 'center', columnGap: '8px', ...style }}>
      {reportIconMappings[prop]?.()}
      {render ? render(report[prop]) : <span>{report[prop]}</span>}
    </span>
  );
}

export function ReportDataIcons({ data, style = {} }) {
  return (
    <section style={{ display: 'flex', columnGap: '16px', fontSize: '18px', ...style }}>
      {icons.map((icon, index) => (
        <ReportDataIcon report={data} prop={icon} key={index} />
      ))}
    </section>
  );
}

/**
 * 单独处理收藏部分
 */
function Collect({ report, trigger, callback }) {
  const { id, whetherCollect, folderId } = report;
  const isCollected = whetherCollect === '1';

  async function handleCollectAction(collectId) {
    const operateTitle = isCollected ? '取消收藏' : '收藏';
    try {
      let response;
      if (!isCollected) {
        response = await collectNew({
          newsId: id,
          folderId: collectId,
        });
      } else {
        response = await cancelCollectNew({
          newsId: id,
          folderId,
        });
      }
      if (response.code === 200) {
        message.success(`${operateTitle}成功`);
        callback?.();
      } else {
        message.error('操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
  }

  if (isCollected) {
    return (
      <Button type="text" style={{ fontSize: '18px' }} onClick={() => handleCollectAction()}>
        {trigger}
      </Button>
    );
  }

  return (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => handleCollectAction(key)}>
          {collects.map(c => (
            <Menu.Item key={c.folder_id}>{c.folder_name}</Menu.Item>
          ))}
        </Menu>
      }
      trigger={['click']}
    >
      <Button type="text" style={{ fontSize: '18px' }}>
        {trigger}
      </Button>
    </Dropdown>
  );
}

export function ReportExport({ data }) {
  return (
    <Button type="text" onClick={() => onExport(data.id)} style={{ fontSize: '18px' }}>
      <FileWordTwoTone />
      <span style={{ color: 'white' }}>导出</span>
    </Button>
  );
}

export function ReportCollect({ data, onFlush }) {
  const isCollected = data?.whetherCollect === '1';
  return (
    <Collect
      report={data}
      trigger={
        <div>
          <span style={{ color: 'orange' }}>{isCollected ? <StarFilled /> : <StarOutlined />}</span>
          <span style={{ color: 'white', marginLeft: '8px' }}>
            {isCollected ? '取消收藏' : '收藏'}
          </span>
        </div>
      }
      callback={onFlush}
    />
  );
}

export function ReportMediaGroup({ video, img }) {
  const parsedVideo = typeof video === 'string' ? JSON.parse(video) : video ?? [];
  const parsedImg = typeof img === 'string' ? JSON.parse(img) : img ?? [];

  const data = [...parsedVideo, ...parsedImg];

  if (data.length === 0) {
    return <React.Fragment />;
  }

  return (
    <div
      style={{
        height: 'max-content',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '8px',
      }}
    >
      {parsedImg.length !== 0 &&
        parsedImg.map((src, index) => (
          <Image key={index} width="100%" height="100%" src={src} alt="Logo" loading="lazy" />
        ))}
      {parsedVideo.length !== 0 &&
        parsedVideo.map((src, index) => (
          <video
            key={index}
            controls
            style={{ width: '150px', height: '100px', marginRight: '8px' }}
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
    </div>
  );
}

export function ReportMedia({ data, type = 'img' }) {
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

  if (!parsedData || parsedData.length === 0) {
    return <React.Fragment />;
  }
  return (
    <div
      style={{
        height: 'max-content',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '8px',
      }}
    >
      {type === 'img' &&
        parsedData.map((src, index) => (
          <Image key={index} width="100%" height="100%" src={src} alt="Logo" loading="lazy" />
        ))}
      {type === 'video' &&
        parsedData.map((src, index) => (
          <Video
            key={index}
            controls
            style={{ width: '150px', height: '100px', marginRight: '8px' }}
          >
            <source src={src} type="video/mp4" />
          </Video>
        ))}
    </div>
  );
}

export default function Report(props) {
  const { data, keyword, theme, onFlush } = props;

  const pdfFiles = data.files ? JSON.parse(data.files) : [];

  const [detailVisible, setDetailVisible] = useState(false);
  const [reportDetail, setReportDetail] = useState({});

  async function showReportDetail(beforeAction) {
    beforeAction?.();
    const detail = await fetchReportDetail(data.id);
    setReportDetail({ ...data, ...detail });
    setDetailVisible(true);
  }

  return (
    <React.Fragment>
      <article
        style={{
          width: '100%',
          padding: '16px',
          border: `1px solid ${'gray'}`,
          borderRadius: '8px',
          display: 'grid',
          gridTemplateColumns: '1fr',
          rowGap: '16px',
        }}
      >
        <section
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '18px',
          }}
        >
          <div style={{ display: 'flex', columnGap: '16px', alignItems: 'center' }}>
            {theme != 'simple' && (
              <img width="25" height="25" src={sourceTypeImg(data.sourceType)} />
            )}
            <span style={{ color: primaryColor }}>{data.sourceName}</span>
            <span>{data.publishTime}</span>

            {theme != 'simple' && data.contentType && (
              <div>
                <span>内容类型：</span>
                <ReportTag text={data.contentType} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ReportExport data={data} />

            <ReportCollect data={data} onFlush={onFlush} />
          </div>
        </section>

        <header style={{ fontSize: '18px', fontWeight: 'bold' }} onClick={() => showReportDetail()}>
          {keywordHightlight(data.title ?? data.titleZh, keyword)}
        </header>

        <main style={{ ...articleBodyStyle, fontSize: '16px' }}>
          {keywordHightlight(data.content ?? data.contentZh, keyword)}
        </main>

        {theme != 'simple' && <ReportDataIcons data={data} />}

        {data.url && (
          <ReportDataIcon
            report={data}
            prop="url"
            render={value => (
              <a href={value} target="_blank">
                {value}
              </a>
            )}
            style={{ color: primaryColor }}
          />
        )}

        <ReportMediaGroup img={data.pics} video={data.videos} />
        {pdfFiles.length > 0 &&
          pdfFiles.map((file, index) => {
            return (
              <span style={{ display: 'flex', lineHeight: '20px' }} key={index}>
                <FilePdfTwoTone style={{ fontSize: '22px', marginRight: '2px' }} />
                <a style={{ color: 'white' }} onClick={() => downloadPdf(file)}>
                  导出
                </a>
              </span>
            );
          })}
      </article>

      <Modal
        visible={detailVisible}
        footer={null}
        width="min-content"
        onCancel={() => setDetailVisible(false)}
      >
        <ReportDetail
          data={reportDetail}
          keyword={keyword}
          theme={theme}
          onFlush={() => showReportDetail(onFlush)}
        />
      </Modal>
    </React.Fragment>
  );
}

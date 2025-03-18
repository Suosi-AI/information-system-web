import React from 'react';
import { Divider } from 'antd';
import { sourceTypeImg, primaryColor, highLight as keywordHightlight } from 'src/utils/common';
import { ReportExport, ReportCollect, ReportDataIcons } from './Report';
import 'src/styles/theme.less';

export function Info({ label, value, logo }) {
  return (
    <span style={{ fontSize: '16px', display: 'flex', alignItems: 'center', columnGap: '8px' }}>
      {logo && <img width="25" height="25" src={logo} />}
      <span style={{ color: '#a1a1a2' }}>{label}:</span>
      <span style={{ color: 'whitesmoke' }}>{value}</span>
    </span>
  );
}

export function Article({ label, value, keyword, hightlight }) {
  return (
    <article style={{ color: 'whitesmoke' }}>
      <header style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>{label}</header>

      {!!value ? (
        <main style={{ fontSize: '16px', background: hightlight ? 'rgb(105, 105, 105)' : 'none' }}>
          {keywordHightlight(value, keyword)}
        </main>
      ) : (
        <em>暂无内容</em>
      )}
    </article>
  );
}

export default function ReportDetail({ data = {}, keyword, onFlush }) {
  return (
    <div
      style={{
        minWidth: '800px',
        maxWidth: 'min-content',
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: '18px',
      }}
    >
      <header
        style={{
          fontSize: '18px',
          color: primaryColor,
          fontWeight: 'bold',
          letterSpacing: '2px',
          textAlign: 'center',
        }}
      >
        <p>{keywordHightlight(data.titleZh)}</p>
      </header>

      <section style={{ width: '100%', display: 'flex', columnGap: '16px' }}>
        <Info label="来源" value={data.sourceType} logo={sourceTypeImg(data.sourceType)} />
        <Info label="作者" value={data.sourceName} />
        <Info label="语种" value={data.lang} />
        <Info label="发布时间" value={data.publishTime} />
      </section>

      <section
        style={{
          fontSize: '16px',
          color: 'whitesmoke',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        <span>原文地址：</span>
        <a href={data.url} target="_blank">
          {data.url}
        </a>
      </section>

      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ReportDataIcons data={data} style={{ color: 'whitesmoke' }} />

        <div>
          <ReportExport data={data} />
          <ReportCollect data={data} onFlush={onFlush} />
        </div>
      </section>

      <hr style={{ color: 'whitesmoke', opacity: '0.2' }} />

      <Article label="摘要" value={data.summary} keyword={keyword} hightlight />

      <Article label="译文" value={data.contentzh} keyword={keyword} />

      <Article label="原文" value={data.contentraw} keyword={keyword} hightlight />
    </div>
  );
}

import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Input, Select, Radio, Empty } from 'antd';
import styles from '../index.less';

const { Search, TextArea } = Input;

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
        <span key={index} style={{ color: 'yellow' }}>
          {part}
        </span>
      );
    } else {
      return part;
    }
  });
};

export default function ReadReportPlatform(props) {
  const {
    data = [],
    searchQuery = {},
    selectedCard,
    handleSelectCard,
    handleContentClick,
    handleSearch,
    pagination,
    onTypeChange,
  } = props;

  const [keyword, setKeyword] = useState('');
  const [reportType, setReportType] = useState();

  useEffect(() => {
    onTypeChange?.(reportType);
  }, [reportType]);

  return (
    <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr', rowGap: '18px' }}>
      <header style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', columnGap: '16px' }}>
        <Search placeholder="请输入关键字" allowClear onSearch={e => handleSearch(e)} />
        <Select value={reportType} onChange={setReportType} placeholder="数据筛选规则">
          {['公开数据', '通报报文', '内部素材'].map(type => {
            return (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            );
          })}
        </Select>
      </header>

      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button>相似文章去重</Button>
        <span>
          共 <span style={{ color: 'red' }}>{data.length}</span> 结果
        </span>
      </section>

      <main>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: '16px', padding: '20px 0' }}
        >
          {data.length === 0 ? (
            <Empty style={{ margin: '200px 8px', fontSize: '16px' }} />
          ) : (
            data.map(card => {
              const processedCard = {
                ...card,
                titleZh: highLight(card.titleZh, searchQuery),
                contentZh: highLight(card.contentZh, searchQuery),
              };

              return (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'min-content 1fr',
                    alignItems: 'center',
                    columnGap: '16px',
                  }}
                  key={card.id}
                >
                  <Radio
                    onChange={() => handleSelectCard(card)}
                    value={card.id}
                    checked={selectedCard && selectedCard.id === card.id}
                  />
                  <article>
                    <header
                      onClick={() => handleContentClick(card.id, card.showActions)}
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '250px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        marginBottom: '8px',
                      }}
                    >
                      {processedCard.titleZh}
                    </header>
                    <p
                      style={{
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: '2',
                        color: '#dedada',
                      }}
                      onClick={() => handleContentClick(card.id, card.showActions)}
                    >
                      {processedCard.contentZh}
                    </p>
                  </article>
                </div>
              );
            })
          )}
          {data.length > 0 && pagination}
        </div>
      </main>
    </div>
  );
}

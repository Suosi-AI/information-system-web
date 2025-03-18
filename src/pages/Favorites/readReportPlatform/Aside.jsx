import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Input, Select, Radio, Empty, Modal } from 'antd';
import ReportDetail from 'src/components/common/ReportDetail';
import DashboardCard, { dynamicImg } from 'src/components/common/DashboardCard';

const { Search, TextArea } = Input;

const emptyQueryOption = {
  keyword: '',
  reportType: '',
  filterSame: false,
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
        <span key={index} style={{ color: 'yellow' }}>
          {part}
        </span>
      );
    } else {
      return part;
    }
  });
};

async function getList(queryOption) {
  // import('./readReportPlatform/mock-data').then(({ data }) => {
  //   setMockCardsData(data);
  // });
}

export default function ReadReportPlatform(props) {
  const {
    data: mockData = [],
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
  const [isModalVisible, setIsModalVisible] = useState();
  const [sameReports, setSameReports] = useState([]);
  const [duplicationFlag, setDuplicationFlag] = useState(false);
  const [queryOption, setQueryOption] = useState({ ...emptyQueryOption });

  function showDuplication(item) {
    setIsModalVisible(true);
    const data = mockData.filter(d => item?.sameReportIds.includes(d.id));
    setSameReports(data);
  }

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
        <Button onClick={() => setDuplicationFlag(!duplicationFlag)}>相似文章去重</Button>
        <span>
          共 <span style={{ color: 'red' }}>{mockData.length}</span> 结果
        </span>
      </section>

      <main>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: '16px', padding: '20px 0' }}
        >
          {mockData.length === 0 ? (
            <Empty style={{ margin: '200px 8px', fontSize: '16px' }} />
          ) : (
            mockData.map(card => {
              const processedCard = {
                ...card,
                titleZh: highLight(card.titleZh, searchQuery),
                contentZh: highLight(card.contentZh, searchQuery),
              };

              return (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'min-content 1fr min-content',
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
                  {duplicationFlag && (
                    <Button
                      type="text"
                      onClick={() => showDuplication(card)}
                      style={{ color: 'white' }}
                    >
                      {card?.sameReportIds?.length ?? 0}
                    </Button>
                  )}
                </div>
              );
            })
          )}
          {mockData.length > 0 && pagination}
        </div>
      </main>

      <Modal
        title="相似文章"
        visible={isModalVisible}
        footer={null} // 不显示默认的底部按钮
        width={800} // 设置 Modal 宽度
        onCancel={() => setIsModalVisible(false)}
      >
        {sameReports.map(card => (
          <ReportDetail data={card} />
        ))}
      </Modal>
    </div>
  );
}

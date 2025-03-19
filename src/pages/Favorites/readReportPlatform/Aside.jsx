import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Input, Select, Radio, Empty, Modal } from 'antd';

import ReportDetail from 'src/components/common/ReportDetail';
import ReportList from 'src/components/common/ReportList';
import { highLight as keywordHightlight } from 'src/utils/common';

const { Search } = Input;

const emptyQueryOption = {
  ids: null,
  keyword: '',
  type: null,
  filterSame: false,
};

async function getList(queryOption) {
  const { data } = await import('./mock-data');

  return data
    .filter(
      item =>
        !queryOption.ids || queryOption.ids?.length === 0 || queryOption?.ids?.includes(item.id)
    )
    .filter(
      item => !queryOption.filterSame || (item.sameReportIds && item.sameReportIds?.length !== 0)
    )
    .filter(item => !queryOption.type || queryOption.type === item.type)
    .filter(
      item =>
        !queryOption.keyword ||
        item.titleZh.includes(queryOption.keyword) ||
        item.contentZh.includes(queryOption.keyword)
    );
}

export default function ReadReportPlatform(props) {
  const { selectedCard, handleSelectCard, pagination } = props;

  const [data, setData] = useState([]);
  const [sameReports, setSameReports] = useState([]);
  const [viewReport, setViewReport] = useState();
  const [queryOption, setQueryOption] = useState({ ...emptyQueryOption });
  const [isModalVisible, setIsModalVisible] = useState();
  const [modalType, setModalType] = useState('duplication');

  const dataLength = data.length;

  async function showDuplication(ids) {
    if (!ids || ids.length === 0) {
      return;
    }
    setModalType('duplication');
    setIsModalVisible(true);
    const data = await getList({ ids });
    setSameReports(data);
    setIsModalVisible(true);
  }

  function showViewReport(report) {
    setViewReport(report);
    setModalType('viewReport');
    setIsModalVisible(true);
  }

  /**
   *
   * @param {keyof typeof emptyQueryOption} key
   * @param {any} value
   */
  function handleQueryChange(key, value) {
    setQueryOption({ ...queryOption, [key]: value });
  }

  useEffect(async () => {
    const data = await getList(queryOption);
    console.log(queryOption);
    setData(data);
  }, [queryOption]);

  return (
    <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr', rowGap: '18px' }}>
      <header style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', columnGap: '16px' }}>
        <Search
          placeholder="请输入关键字"
          allowClear
          onSearch={value => handleQueryChange('keyword', value)}
        />
        <Select
          allowClear
          value={queryOption.type}
          onChange={value => handleQueryChange('type', value)}
          placeholder="数据筛选规则"
        >
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
        <Button onClick={() => handleQueryChange('filterSame', !queryOption.filterSame)}>
          相似文章去重
        </Button>

        <span>
          共 <span style={{ color: 'red' }}>{dataLength}</span> 结果
        </span>
      </section>

      <main>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: '16px', padding: '20px 0' }}
        >
          {dataLength === 0 ? (
            <Empty style={{ margin: '200px 8px', fontSize: '16px' }} />
          ) : (
            data.map(card => {
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
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '250px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        marginBottom: '8px',
                        cursor: 'pointer',
                      }}
                      onClick={() => showViewReport(card)}
                    >
                      {keywordHightlight(card.titleZh, queryOption.keyword)}
                    </header>
                    <p
                      style={{
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: '2',
                        color: '#dedada',
                      }}
                    >
                      {keywordHightlight(card.contentZh, queryOption.keyword)}
                    </p>
                  </article>
                  {queryOption.filterSame && (
                    <span
                      type="text"
                      onClick={() => showDuplication(card.sameReportIds)}
                      style={{
                        color: 'white',
                        fontSize: '20px',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                    >
                      {card?.sameReportIds?.length ?? 0}
                    </span>
                  )}
                </div>
              );
            })
          )}
          {dataLength > 0 && pagination}
        </div>
      </main>

      <Modal
        title="相似文章"
        visible={isModalVisible && modalType === 'duplication'}
        footer={null}
        width="min-content"
        onCancel={() => setIsModalVisible(false)}
      >
        <ReportList
          list={sameReports}
          style={{ minWidth: '800px', color: 'whitesmoke' }}
          theme="simple"
          disableSelect={true}
        />
      </Modal>

      <Modal
        title="文章详情"
        visible={isModalVisible && modalType === 'viewReport'}
        footer={null}
        width="min-content"
        onCancel={() => setIsModalVisible(false)}
      >
        <ReportDetail
          data={viewReport}
          style={{ minWidth: '800px', color: 'whitesmoke' }}
          theme="simple"
        />
      </Modal>
    </div>
  );
}

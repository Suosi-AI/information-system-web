import React, { useState, useEffect } from 'react';
import Report from './Report';
import { Spin, Empty, Pagination, Dropdown, Button, Menu, Checkbox, message } from 'antd';

import { highLight, primaryColor, downloadBlob } from 'src/utils/common';
import {
  exportNewsToExcel as exportToExcel,
  exportNewsToWordZip as exportToWordZip,
} from 'src/services/store';

export function ReportListExport({ onTrigger, ids = [], style = {} }) {
  async function exportTo(type) {
    const exportTypeMappings = {
      excel: exportToExcel,
      wordZip: exportToWordZip,
    };

    if (!exportTypeMappings[type]) {
      message.warning(`不支持的导出类型: ${type}`);
      return;
    }

    const blob = await exportTypeMappings[type]({
      newsIdList: ids,
    });
    downloadBlob(blob, `新闻列表.${type === 'excel' ? 'xls' : 'zip'}`);
    onTrigger();
  }

  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key="excel" disabled={ids?.length === 0} onClick={() => exportTo('excel')}>
            导出为Excel
          </Menu.Item>
          <Menu.Item key="wordZip" disabled={ids?.length === 0} onClick={() => exportTo('wordZip')}>
            导出为WordZip
          </Menu.Item>
        </Menu>
      }
      placement="bottom"
      onClick={() => onTrigger?.()}
    >
      <Button
        style={{
          backgroundColor: 'transparent',
          color: 'white',
          border: `1px solid ${primaryColor}`,
          ...style,
        }}
      >
        批量导出
      </Button>
    </Dropdown>
  );
}

export default function ReportList({
  list = [],
  queryOption = {},
  loading = false,
  style = {},
  pagination,
  theme,
  disableSelect = false,
  onFlush,
}) {
  const length = list.length;
  const showEmpty = length === 0 && !loading;

  const [showSelect, setShowSelect] = useState(false);
  const [selectIds, setSelectIds] = useState([]);

  useEffect(() => {
    if (!showSelect) {
      setSelectIds([]);
    }
  }, [showSelect]);

  if (showEmpty) {
    return <Empty description={<div>暂无数据</div>} />;
  }

  function handleReportSelect(id, isChecked) {
    if (isChecked) {
      setSelectIds([...selectIds, id]);
    } else {
      setSelectIds(selectIds.filter(i => i !== id));
    }
  }

  return (
    <div style={{ padding: '0 20px', ...style }}>
      {!disableSelect && (
        <header style={{ textAlign: 'end', paddingBottom: '20px' }}>
          <ReportListExport
            onTrigger={() => setShowSelect(!showSelect)}
            ids={selectIds}
            style={{ display: 'inline-block' }}
          />
        </header>
      )}

      <Spin tip="加载数据中..." spinning={loading}>
        <main
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr',
            rowGap: '16px',
          }}
        >
          {list.map((card, index) => {
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showSelect && (
                  <Checkbox
                    value={card.id}
                    checked={selectIds.includes(card.id)}
                    onChange={e => handleReportSelect(card.id, e.target.checked)}
                    style={{ padding: '0 16px' }}
                  />
                )}
                <Report data={card} keyword={queryOption.keyword} onFlush={onFlush} theme={theme} />
              </div>
            );
          })}
        </main>
      </Spin>

      {length > 0 && pagination}
    </div>
  );
}

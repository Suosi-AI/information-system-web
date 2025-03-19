import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Table, Tooltip, Space, message, Modal } from 'antd';
import { useLocalStorageState } from 'ahooks';
import ReportList from 'src/components/common/ReportList';

function downloadFile(resp) {
  // 创建 Blob 对象
  const blob = new Blob([resp], { type: 'application/vnd.ms-word;charset=utf-8' });

  // 生成 URL
  const url = window.URL.createObjectURL(blob);

  // 创建一个 <a> 元素并设置相关属性
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.download = '报告.doc'; // 设置下载文件的名称

  // 将 <a> 元素添加到页面中并触发点击
  document.body.appendChild(link);
  link.click();

  // 清理操作
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export default function SearchReportPlatform() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 用于存储被选中的行的key值
  const [dataSource, setDataSource] = useLocalStorageState('searchReport', {
    defaultValue: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [tableData, setTableData] = useState(dataSource ?? []);
  const [sameReports, setSameReports] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDuplication, setIsDuplication] = useState(false);
  // 定义选择框的配置
  const rowSelection = {
    selectedRowKeys,
    onChange: newSelectedRowKeys => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const baseColumns = [
    {
      title: '序号',
      dataIndex: 'num',
      key: 'num',
      // width: 80,
      render: (text, record, index) => `${(currentPage - 1) * pageSize + index + 1}`,
    },
    {
      title: '报告名称',
      dataIndex: 'reportTitle',
      key: 'reportTitle',
      ellipsis: {
        showTitle: false,
      },
      render: reportTitle => (
        <Tooltip placement="topLeft" title={reportTitle}>
          {reportTitle}
        </Tooltip>
      ),
    },
    {
      title: '日期',
      dataIndex: 'publishTime',
      key: 'publishTime',
      // width: 200,
    },
    {
      title: '创建者',
      dataIndex: 'sourceName',
      key: 'sourceName',
      // width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: () => {
        return (
          <Tooltip placement="topLeft" title={'admin'}>
            admin
          </Tooltip>
        );
      },
    },
  ];

  const mergeColumn = {
    title: '相似合并数量',
    dataIndex: 'mergeNum',
    key: 'mergeNum',
    render: (value, record) => (
      <Button type="text" onClick={() => showSameReports(record?.sameReportIds)}>
        {record?.sameReportIds?.length ?? 0}
      </Button>
    ),
  };

  const operationColumn = {
    title: '操作',
    key: 'action',
    render: (_, reocrd) => (
      <Space size="middle" style={{ textAlign: 'center' }}>
        <a onClick={() => onExportFire(reocrd.reportId)}>下载</a>
        <a onClick={() => onDel(reocrd)}>删除</a>
        <a onClick={() => message.success('通报成功！')}>通报</a>
      </Space>
    ),
  };

  const [columns, setColumns] = useState([...baseColumns, operationColumn]);

  function showSameReports(sameReportIds) {
    if (!sameReportIds || sameReportIds?.length === 0) {
      return;
    }
    const sameReports = dataSource.filter(report => sameReportIds.includes(report.id));
    setSameReports(sameReports);
    setIsModalVisible(true);
  }

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  function handleDeduplicate() {
    if (isDuplication) {
      const filterData = dataSource.filter(
        item => !!item.sameReportIds && Array.isArray(item.sameReportIds)
      );
      setTableData(filterData);
      setColumns([...baseColumns, mergeColumn, operationColumn]);
    } else {
      setTableData(dataSource);
      setColumns([...baseColumns, operationColumn]);
    }
  }

  const onDel = report => {
    function delSingle() {
      const hasSameReports = !!(report.sameReportIds && report.sameReportIds.length !== 0);
      const filterReports = dataSource
        .filter(item => report.id !== item.id)
        .map(item => {
          if (!hasSameReports) {
            const sameReportIds = item.sameReportIds;
            if (!sameReportIds) {
              return item;
            } else {
              const filterSameReportIds = sameReportIds.filter(id => id !== report.id);
              return { ...item, sameReportIds: filterSameReportIds };
            }
          } else {
            const [extendedSameReportId, ...extendedIds] = report.sameReportIds;
            if (item.id === extendedSameReportId) {
              return { ...item, sameReportIds: extendedIds };
            } else {
              return item;
            }
          }
        });
      setDataSource(filterReports);
      message.success('删除成功');
    }

    function delMulti() {
      const reportIds = report.sameReportIds ?? [];
      const filterReports = dataSource
        .filter(item => !reportIds.includes(item.id))
        .map(item => {
          if (item.id === report.id) {
            return { ...item, sameReportIds: [] };
          } else {
            return item;
          }
        });
      setDataSource(filterReports);
      message.success('重复数据删除成功');
    }

    isDuplication && report.sameReportIds.length > 0 ? delMulti() : delSingle();
  };

  const onExportFire = async reportId => {
    exportReportToWord({ reportId: reportId })
      .then(resp => {
        downloadFile(resp);
        message.success('导出成功!');
      })
      .catch(error => {
        console.error('导出失败:', error);
        message.error('导出失败: ' + error.message);
      });
  };

  useEffect(() => {
    handleDeduplicate();
  }, [isDuplication, dataSource]);

  useEffect(() => {
    if (dataSource?.length !== 0) {
      return;
    } else {
      import('../Social/mock-data').then(({ reports }) => {
        setDataSource(reports);
        setTableData(reports);
        setTotalCount(reports.length);
      });
    }
  });

  return (
    <div style={{ paddingRight: '10px' }}>
      <p style={{ textAlign: 'right' }}>
        <Button onClick={() => setIsDuplication(!isDuplication)}>相似文章去重</Button>
      </p>
      <Table
        style={{ maxWidth: '100%' }}
        rowSelection={rowSelection} // 注入勾选框配置
        rowKey="id" // 为每行设置唯一的key
        columns={columns}
        dataSource={tableData}
        pagination={{
          position: ['bottomCenter'],
          current: currentPage,
          pageSize: pageSize,
          total: totalCount,
          onChange: handlePageChange,
        }}
      />

      <Modal
        title="相似文章"
        visible={isModalVisible}
        footer={null}
        width={800}
        onCancel={() => setIsModalVisible(false)}
      >
        <ReportList
          list={sameReports}
          disableSelect={true}
          theme="simple"
          style={{ color: 'whitesmoke' }}
        />
      </Modal>
    </div>
  );
}

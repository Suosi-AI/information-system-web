import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Table, Tooltip, Space, message, Modal } from 'antd';
import { queryPageTable, deleteReport, exportReportToWord } from './../../services/store';
import DashboardCard, { dynamicImg } from 'src/components/common/DashboardCard/index.jsx';
import { useLocalStorageState } from 'ahooks';

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
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 用于存储被选中的行的key值
  const [dataSource, setDataSource] = useLocalStorageState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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
        <a onClick={() => onDel(reocrd.reportId)}>删除</a>
        <a onClick={() => message.success('通报成功！')}>通报</a>
      </Space>
    ),
  };

  const [columns, setColumns] = useState([...baseColumns, operationColumn]);

  useEffect(() => {});

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
    setIsAllSelected(false);
  };

  const handleTableReport = async () => {
    if (true) {
      const { reports } = await import('../Social/mock-data');
      setDataSource(reports);
      setTotalCount(reports.length);
      return;
    }
    setIsLoading(true);
    try {
      const response = await queryPageTable({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        // folderId: selectedFirstLevelArchiveId,
      });

      setDataSource(response.page.list);
      setTotalCount(response.page.totalCount);
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error(`获取数据失败${response.msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  async function handleDeduplicate() {
    if (!isDuplication) {
      const filterData = dataSource.filter(
        item => !!item.sameReportIds && item.sameReportIds?.length !== 0
      );
      setDataSource(filterData);
      setColumns([...baseColumns, mergeColumn, operationColumn]);
    } else {
      await handleTableReport();
      setColumns([...baseColumns, operationColumn]);
    }
    setIsDuplication(!isDuplication);
  }

  const onDel = async reportId => {
    const filterData = dataSource.filter(item => item.id !== reportId);
    setDataSource(filterData);
    await handleDeduplicate();
    message.success('删除成功');
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
    handleTableReport();
  }, [currentPage, pageSize]);

  return (
    <div style={{ paddingRight: '10px' }}>
      <p style={{ textAlign: 'right' }}>
        <Button onClick={handleDeduplicate}>相似文章去重</Button>
      </p>
      <Table
        style={{ maxWidth: '100%' }}
        rowSelection={rowSelection} // 注入勾选框配置
        rowKey="id" // 为每行设置唯一的key
        columns={columns}
        dataSource={dataSource}
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
        footer={null} // 不显示默认的底部按钮
        width={800} // 设置 Modal 宽度
        onCancel={() => setIsModalVisible(false)}
      >
        {sameReports.map(card => (
          <DashboardCard
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
            whetherCollect={card.whetherCollect}
          />
        ))}
      </Modal>
    </div>
  );
}

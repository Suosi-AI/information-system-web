import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Table, Tooltip, Space, message } from 'antd';
import { queryPageTable, deleteReport, exportReportToWord } from './../../services/store';

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
  const [dataSource, setDataSource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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
      dataIndex: 'createTime',
      key: 'createTime',
      // width: 200,
    },
    {
      title: '创建者',
      dataIndex: 'username',
      key: 'username',
      // width: 200,
      ellipsis: {
        showTitle: false,
      },
      render: username => (
        <Tooltip placement="topLeft" title={username}>
          {username}
        </Tooltip>
      ),
    },
  ];

  const mergeColumn = {
    title: '相似合并数量',
    dataIndex: 'mergeNum',
    key: 'mergeNum',
    render: value => <Button type="text">{value}</Button>,
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

  function handleDeduplicate() {
    setColumns([...baseColumns, mergeColumn, operationColumn]);
  }

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    setIsAllSelected(false);
  };

  const handleTableReport = async () => {
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

  const onDel = async reportId => {
    try {
      const response = await deleteReport({ reportId: reportId });

      if (response.code === 200) {
        message.success('删除成功');
        handleTableReport();
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除时发生错误');
    }
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
        rowKey="reportId" // 为每行设置唯一的key
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
    </div>
  );
}

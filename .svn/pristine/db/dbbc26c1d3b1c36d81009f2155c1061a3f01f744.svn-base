import React, { useState, useEffect, useMemo } from 'react';
import { Table, Space, Button, message } from 'antd';
import styles from './index.less';
import { userLogs } from './../../services/store';

const UserLogs = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const memoizedPagination = useMemo(() => ({ ...pagination }), [pagination]);

  const columns = [
    {
      title: '序号',
      dataIndex: 'num',
      key: 'num',
      render: (text, record, index) => (
        <span>{(pagination.current - 1) * pagination.pageSize + index + 1}</span>
      ),
      width: 100,
    },
    {
      title: '操作用户',
      dataIndex: 'username',
      key: 'username',
      width: 300,
    },
    {
      title: '操作内容',
      dataIndex: 'operation',
      key: 'operation',
    },
    {
      title: '创建时间',
      dataIndex: 'create_date',
      key: 'create_date',
      width: 200,
    }, // { //   title: '操作', //   key: 'action', //   render: (_, record) => ( //     <Space size="middle"> //       <a>重置密码</a> //       <a>导出</a> //       <a>删除</a> //     </Space> //   ), // },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await userLogs({
          page: memoizedPagination.current,
          limit: memoizedPagination.pageSize,
        });
        if (response && response.page) {
          setData(response.page.list);
          setTotal(response.page.totalCount);
        }
      } catch (error) {
        message.error('获取数据失败' + error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [memoizedPagination.current, memoizedPagination.pageSize]); // 依赖项改为当前页和每页大小

  const handleTableChange = newPagination => {
    setPagination({
      ...pagination,
      ...newPagination,
    });
  };

  return (
    <>
      <div className={styles.box}>
        <div className={styles.top}>
          <div>
            共有
            <span style={{ color: 'red', margin: '0 5px' }}>{total || '0'}</span>
            条操作日志
          </div>
          {/* <Button className={styles.btn}>新增用户</Button> */}
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ ...pagination, total }}
          loading={loading}
          onChange={handleTableChange}
          rowKey={record => record.key}
        />
      </div>
    </>
  );
};

export default UserLogs;

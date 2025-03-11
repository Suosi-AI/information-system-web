import React, { useState, useEffect, useMemo } from 'react';
import { Table, Space, Button, message, Modal, Form, Input, Popconfirm, Select } from 'antd';
import styles from './index.less';
import {
  wordPage,
  wordAdd,
  wordinfo,
  wordUpdate,
  wordDelete,
} from './../../services/store';
const { Option } = Select;

const UserManagement = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false); // 控制弹框显示
  const [modalType, setModalType] = useState(''); // '' | 'add' | 'edit'
  const [currentRecord, setCurrentRecord] = useState(null); // 当前编辑的记录
  const [userId, setUserId] = useState(null);
  const [form] = Form.useForm();
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
      title: '原文术语',
      dataIndex: 'ori_word',
      key: 'ori_word',
      width: 300,
    },
    {
      title: '专业译文',
      dataIndex: 'pro_word',
      key: 'pro_word',
      // render: text => (text === '1' ? '超级管理员' : '普通用户'),
      width: 300,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 300,
    },
    {
      title: '编辑人员',
      dataIndex: 'username',
      key: 'username',
      width: 300,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 300,
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      key: 'update_time',
      width: 300,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm title="你确认要删除吗？" onConfirm={() => handleDelete(record)}>
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
      width: 200,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await wordPage({
          page: memoizedPagination.current,
          limit: memoizedPagination.pageSize,
        });
        if (response && response.page) {
          // 处理 rank 字段
          const processedData = response.page.list.map(item => ({
            ...item,
            rank: item.rank === '1' ? '超级管理员' : '普通用户',
          }));
          setData(processedData);
          setTotal(response.page.totalCount);
        }
      } catch (error) {
        message.error('获取数据失败' + error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [memoizedPagination.current, memoizedPagination.pageSize]);

  const handleTableChange = newPagination => {
    setPagination({
      ...pagination,
      ...newPagination,
    });
  };

  const handleAdd = () => {
    setModalType('add');
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = record => {
    setModalType('edit');
    setCurrentRecord(record);
    setModalVisible(true);
    setUserId(record.user_id);
    form.setFieldsValue({
      ori_word: record.ori_word,
      pro_word: record.pro_word,
      category: record.category,
    });
  };

  const handleDelete = async record => {
    try {
      await wordDelete({ ori_word: record.ori_word });
      message.success('删除成功');
      const response = await wordPage({
        page: memoizedPagination.current,
        limit: memoizedPagination.pageSize,
      });
      setData(response.page.list);
      setTotal(response.page.totalCount);
    } catch (error) {
      message.error('删除失败' + error);
    }
  };

  const handleResetPassword = async record => {
    try {
      await userResetPassword({ username: record.username });
      message.success('密码重置成功');
    } catch (error) {
      message.error('密码重置失败' + error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === 'add') {
        const response = await wordAdd({
          ori_word: values.ori_word,
          pro_word: values.pro_word,
          category: values.category,
        });
        if (response.code === 200) {
          message.success('添加专业术语成功');
        } else {
          message.error(response.msg + '!!!');
        }
      } else if (modalType === 'edit') {
        // debugger;
        const response = await wordUpdate({
          ori_word: values.ori_word,
          pro_word: values.pro_word,
          category: values.category,
        });
        if (response.code === 200) {
          message.success('编辑专业术语成功');
        } else {
          message.error(response.msg + '!!!');
        }
      }
      setModalVisible(false);
      const response = await wordPage({
        page: memoizedPagination.current,
        limit: memoizedPagination.pageSize,
      });
      setData(response.page.list);
      setTotal(response.page.totalCount);
    } catch (error) {
      if (error.response) {
        message.error('操作失败：' + error.response.msg);
      } else {
        message.error('操作失败：' + error);
      }
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <div className={styles.box}>
        <div className={styles.top}>
          <div>
            共有
            <span style={{ color: 'red', margin: '0 5px' }}>{total || '0'}</span>
            个专业术语
          </div>
          <Button className={styles.btn} onClick={handleAdd}>
            新增术语
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ ...pagination, total }}
          loading={loading}
          onChange={handleTableChange}
          rowKey={record => record.key}
        />
        <Modal
          title={modalType === 'add' ? '新增术语' : '编辑术语'}
          visible={modalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="ori_word"
              label="原文术语"
              rules={[{ required: true, message: '请输入原文术语!' }]}
            >
              <Input disabled={modalType === 'edit'} />
            </Form.Item>
            <Form.Item
              name="pro_word"
              label="专业译文"
              rules={[{ required: true, message: '请输入专业译文!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="category"
              label="分类"
              rules={[{ required: true, message: '请输入分类!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default UserManagement;

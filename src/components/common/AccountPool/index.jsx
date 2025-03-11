import React from 'react';
import { Form, Row, Col, Button, Checkbox } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import styles from './index.less';

const AccountPool = ({
  title,
  accounts,
  onMoveRight,
  onMoveLeft,
  onCheckAllChange,
  onCheckedChange,
}) => {
  return (
    <Col
      span={11}
      style={{ height: 400, overflowY: 'scroll', border: '1px silver solid', padding: 10 }}
    >
      <div style={{ marginBottom: 10 }}>
        <Checkbox
          indeterminate={false}
          checked={accounts.checkedAll}
          onChange={onCheckAllChange}
          className={styles.quanxuan}
        >
          {title}
        </Checkbox>
      </div>
      <Checkbox.Group
        value={accounts.checkedList}
        onChange={onCheckedChange}
        className={styles.checkoutStyle}
      >
        {accounts.list.map(account => (
          <Checkbox key={account.id} value={account.id}>
            {account.name}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </Col>
  );
};
export default AccountPool;

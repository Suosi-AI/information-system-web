import React, { useState, useEffect } from 'react';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import styles from './index.less';
import { Input, Modal, Select, Form, DatePicker, message } from 'antd';
import dayjs from 'dayjs';

const { Search, TextArea } = Input;
const { RangePicker } = DatePicker;
const plainOptions = [
  '微博',
  '公众号',
  '谷歌',
  '博客',
  '网站',
  '推特',
  '百度',
  '油管',
  '脸书',
  '电报',
  '智库',
];

const timeLabelMappings = {
  '24h': '近一天',
  '1w': '近一周',
  '1m': '近一月',
  '1y': '近一年',
  'custom': '自定义',
};

const calculateTimeRange = range => {
  const endDate = new Date(); // 结束时间为当前时间
  let startTime;

  switch (range) {
    case '24h':
      startTime = new Date(endDate.getTime() - 3600 * 1000 * 24 * 1); // 24小时
      break;
    case '1w':
      startTime = new Date(endDate.getTime() - 3600 * 1000 * 24 * 7); // 一周
      break;
    case '1m':
      startTime = new Date(endDate.getTime() - 3600 * 1000 * 24 * 30); // 一月
      break;
    case '1y':
      startTime = new Date(endDate.getTime() - 3600 * 1000 * 24 * 365); // 一年
      break;
    default:
      startTime = new Date(endDate.getTime() - 3600 * 1000 * 24 * 1); // 24小时
  }

  return [moment(startTime, 'YYYY-MM-DD HH:mm:ss'), moment(endDate, 'YYYY-MM-DD HH:mm:ss')];
};

const defaultTimeRange = '24h';

const emptyForm = () => ({
  id: new Date().getTime().toString(),
  name: '',
  dateRange: calculateTimeRange(defaultTimeRange),
  sourceType: [],
  area: '',
  lang: '',
  site: '',
  targetMatchedCondition: '',
  timeRange: defaultTimeRange,
});

/**
 * @type Record<keyof ReturnType<typeof emptyForm>, (value: any) => any>
 */
const formValueFilter = {
  sourceType: value => {
    if (value.includes('全部')) {
      return [...plainOptions];
    } else {
      return value;
    }
  },
};

export function formatForm(form) {
  return { ...emptyForm(), ...(form ?? {}) };
}

export default function DataSmartSearchForm(props) {
  const { data = {}, visible = false, onOk, onCancel } = props ?? {};
  const isEditing = !!data;
  const [form, setForm] = useState({ ...emptyForm() });
  const [timeRange, setTimeRange] = useState(defaultTimeRange);
  const [disableSourceType, setDisableSourceType] = useState(false);

  /**
   * @param {keyof form | Record<keyof form, any>} keyOrEntries
   * @param {any | undefined} value
   */
  function handleChange(keyOrEntries, value) {
    const getForm = (key, input) => {
      let val = input;
      if (typeof input === 'object' && 'target' in input) {
        val = input.target.value;
      }
      val = formValueFilter[key]?.(val) || val;
      return {
        ...form,
        [key]: val,
      };
    };

    if (typeof keyOrEntries === 'object') {
      let extForm = {};
      for (const [k, v] of Object.entries(keyOrEntries)) {
        extForm = { ...extForm, ...getForm(k, v) };
      }
      setForm(extForm);
    } else {
      setForm(getForm(keyOrEntries, value));
    }
  }

  function close(action, isSave) {
    if (isSave && !form.targetMatchedCondition) {
      message.error('关键词组不能为空');
      return;
    } else if (isSave && !form.name) {
      message.error('搜索主题不能为空');
      return;
    }
    action?.({ ...form });
    setForm({ ...emptyForm() });
    setTimeRange(defaultTimeRange);
  }

  useEffect(() => {
    if (data) {
      setForm({ ...form, ...data });
      setTimeRange(data.timeRange || defaultTimeRange);
    }
  }, [data]);

  useEffect(() => {
    if (timeRange !== 'custom') {
      const dateRange = calculateTimeRange(timeRange);
      handleChange({ dateRange, timeRange });
    } else {
      handleChange('timeRange', 'custom');
    }
  }, [timeRange]);

  useEffect(() => {
    if (form.sourceType.includes('全部')) {
    }
  }, [form.sourceType]);

  return (
    <Modal
      title={isEditing ? '编辑数据智能搜索' : '添加数据智能搜索'}
      visible={visible}
      onOk={() => close(onOk, true)}
      onCancel={() => close(onCancel)}
      className={styles.modalSty}
    >
      <Form data-smart-search-form>
        <Form.Item label="搜索主题">
          <Input
            value={form.name}
            onChange={e => handleChange('name', e)}
            placeholder="请输入搜索主题名称"
          />
        </Form.Item>
        <Form.Item label="发文时间">
          <div style={{ display: 'flex', columnGap: '16px' }}>
            {['24h', '1w', '1m', '1y', 'custom'].map(time => {
              return (
                <span
                  data-like-button={time === timeRange}
                  onClick={() => setTimeRange(time)}
                  key={time}
                >
                  {timeLabelMappings[time]}
                </span>
              );
            })}
          </div>
        </Form.Item>
        {timeRange === 'custom' && (
          <Form.Item label="自定义时间">
            <RangePicker
              locale={locale}
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              className="mar-l-10"
              defaultValue={form.dateRange.map(v => dayjs(v))}
              onChange={date => handleChange('dateRange', date)}
            />
          </Form.Item>
        )}
        <Form.Item label="数据源类型">
          <Select
            mode="multiple"
            value={form.sourceType}
            onChange={value => handleChange('sourceType', value)}
            placeholder="全部"
          >
            {[...plainOptions].map(type => {
              return (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="语种">
          <div style={{ display: 'flex', columnGap: '16px' }}>
            {['', '中文', '日语', '英语', '其他'].map(lang => {
              return (
                <span
                  data-like-button={lang === form.lang}
                  onClick={() => handleChange('lang', lang)}
                  key={lang}
                >
                  {lang || '全部'}
                </span>
              );
            })}
          </div>
        </Form.Item>
        <Form.Item label="发布国家及地区">
          <Select
            value={form.area || null}
            onChange={value => handleChange('area', value)}
            placeholder="全部"
          >
            {['中国', '日本', '美国', '其他'].map(area => {
              return (
                <Select.Option key={area} value={area}>
                  {area}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="发布站点">
          <Input
            value={form.site}
            onChange={e => handleChange('site', e)}
            placeholder="请输入站点名称"
          />
        </Form.Item>
        <Form.Item label="关键词组">
          <TextArea
            rows={4}
            value={form.targetMatchedCondition}
            onChange={e => handleChange('targetMatchedCondition', e)}
            placeholder="输入匹配条件，使用+-|组合对应逻辑表达式，例：(日本|海上保安厅)+军舰 进行筛选"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

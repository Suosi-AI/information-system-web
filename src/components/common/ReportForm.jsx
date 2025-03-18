import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { calculateTimeRange, primaryColor } from 'src/utils/common';

export function FormItem({ label, list, render, onSelect }) {
  const [selected, setSelected] = useState();

  function handleSelect(value) {
    setSelected(value);
    onSelect?.(value);
  }
  return (
    <section>
      <span>{label}：</span>
      {list.map(value => {
        return (
          <span
            style={{ color: selected === value ? primaryColor : 'inherit' }}
            onClick={() => handleSelect(value)}
            key={value}
          >
            {render ? render(value) : value}
          </span>
        );
      })}
    </section>
  );
}

export function TimeRange({ value, onClick }) {
  const [time, setTime] = useState(value);
  const timeLabelMappings = {
    '24h': '近一天',
    '1w': '近一周',
    '1m': '近一月',
    '1y': '近一年',
    'custom': '自定义',
  };

  const timeLabels = Object.keys(timeLabelMappings);

  return timeLabels.map(time => {
    return (
      <span
        style={{ color: time === value ? primaryColor : 'inherit' }}
        onClick={onClick}
        key={time}
      >
        {timeLabelMappings[time]}
      </span>
    );
  });
}

const timeRange = {
  key: 'timeRange',
  label: '时间范围',
  value: ['24h', '1w', '1m', '1y', 'custom'],
};
const lang = {
  key: 'lang',
  label: '语种筛选',
  value: ['中文', '繁体', '日语', '英语', '韩语', '其他'],
};
const area = {
  key: 'area',
  label: '信源地区',
  value: ['中国', '美国', '日本', '韩国', '台湾', '越南', '菲律宾', '马来西亚'],
};
const contentType = {
  key: 'contentType',
  label: '内容类型',
  value: ['目标动向', '人员更替', '政策发布', '官方发布'],
};

export default function ReportForm({ formItems = [], onChange }) {
  const [form, setForm] = useState(generateEmptyForm());

  function generateEmptyForm() {
    if (formItems.length === 0) {
      return {};
    }

    let emptyForm = { searchKey: '' };
    for (const { key } of formItems) {
      emptyForm[key] = '';
    }

    return emptyForm;
  }

  function handleFormItemChange(key, value) {
    setForm({ ...form, [key]: value });
  }

  function emit() {
    onChange?.(form);
  }

  useEffect(() => {
    emit();
  }, [form]);

  return (
    <article style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr', rowGap: '16px' }}>
      <Input.Search onSearch={emit} />
    </article>
  );
}

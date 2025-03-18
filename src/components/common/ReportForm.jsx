import React, { useState } from 'react';
import { calculateTimeRange, primaryColor } from 'src/utils/common';

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

export default function ({ form }) {}

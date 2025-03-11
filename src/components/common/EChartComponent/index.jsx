// EChartComponent.js
import React, { useEffect, useRef, memo } from 'react';
import * as echarts from 'echarts';

const EChartComponent = memo(({ option, notMerge = false, lazyUpdate = false, onClick }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      chartInstance.current.setOption(option, notMerge);

      chartInstance.current.on('click', params => {
        if (params.componentType === 'series' && params.data) {
          onClick(params.data);
        }
      });

      return () => {
        chartInstance.current.dispose();
      };
    }
  }, [option, notMerge, onClick]);

  useEffect(() => {
    // 确保图表在组件更新后重新调整大小
    if (chartInstance.current) {
      chartInstance.current.resize();
    }
  }, [chartInstance]);

  // 使用 ResizeObserver 监听容器尺寸变化
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (chartInstance.current) {
          chartInstance.current.resize();
        }
      }
    });

    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) {
        resizeObserver.unobserve(chartRef.current);
      }
    };
  }, [chartInstance]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
});

export default EChartComponent;

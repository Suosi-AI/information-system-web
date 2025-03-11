import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tabs, Button, message } from 'antd';
import { Line, Pie, Column, WordCloud } from '@ant-design/plots';
import { ChoroplethMap } from '@ant-design/maps';
import styles from './index.less';
import { DownloadOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, ImageRun } from 'docx';
import { saveAs } from 'file-saver';
import { Font } from 'jspdf';


// 信息走势数据
const trendData = [
  // 网站
  ...Array.from({ length: 13 }, (_, i) => ({
    data: i === 12 ? '2025-01' : `2024-${String(i + 1).padStart(2, '0')}`,
    type: '网站',
    value: Math.floor(Math.random() * (8000 - 5000) + 5000)
  })),
  // 博客
  ...Array.from({ length: 13 }, (_, i) => ({
    data: i === 12 ? '2025-01' : `2024-${String(i + 1).padStart(2, '0')}`,
    type: '博客',
    value: Math.floor(Math.random() * (6000 - 3000) + 3000)
  })),
  // 公众号
  ...Array.from({ length: 13 }, (_, i) => ({
    data: i === 12 ? '2025-01' : `2024-${String(i + 1).padStart(2, '0')}`,
    type: '公众号',
    value: Math.floor(Math.random() * (7000 - 4000) + 4000)
  })),
  // 微博
  ...Array.from({ length: 13 }, (_, i) => ({
    data: i === 12 ? '2025-01' : `2024-${String(i + 1).padStart(2, '0')}`,
    type: '微博',
    value: Math.floor(Math.random() * (10000 - 6000) + 6000)
  })),
  // 推特
  ...Array.from({ length: 13 }, (_, i) => ({
    data: i === 12 ? '2025-01' : `2024-${String(i + 1).padStart(2, '0')}`,
    type: '推特',
    value: Math.floor(Math.random() * (9000 - 5000) + 5000)
  })),
  // 脸书
  ...Array.from({ length: 13 }, (_, i) => ({
    data: i === 12 ? '2025-01' : `2024-${String(i + 1).padStart(2, '0')}`,
    type: '脸书',
    value: Math.floor(Math.random() * (8000 - 4000) + 4000)
  })),
  // 电报
  ...Array.from({ length: 13 }, (_, i) => ({
    data: i === 12 ? '2025-01' : `2024-${String(i + 1).padStart(2, '0')}`,
    type: '电报',
    value: Math.floor(Math.random() * (5000 - 2000) + 2000)
  })),
  // 百度
  ...Array.from({ length: 13 }, (_, i) => ({
    data: i === 12 ? '2025-01' : `2024-${String(i + 1).padStart(2, '0')}`,
    type: '百度',
    value: Math.floor(Math.random() * (6000 - 3000) + 3000)
  })),
  // 谷歌
  ...Array.from({ length: 13 }, (_, i) => ({
    data: i === 12 ? '2025-01' : `2024-${String(i + 1).padStart(2, '0')}`,
    type: '谷歌',
    value: Math.floor(Math.random() * (7000 - 4000) + 4000)
  })),
  // 油管
  ...Array.from({ length: 13 }, (_, i) => ({
    data: i === 12 ? '2025-01' : `2024-${String(i + 1).padStart(2, '0')}`,
    type: '油管',
    value: Math.floor(Math.random() * (8000 - 5000) + 5000)
  }))
];

// 媒体舆情数据
const mediaData = [
  { type: '新闻网站', value: 40 },
  { type: '推特', value: 20 },
  { type: '脸书', value: 15 },
  { type: 'Telegram', value: 12 },
  { type: '百度', value: 8 },
  { type: '谷歌', value: 3 },
  { type: '微信公众号', value: 2 },
  { type: '微博', value: 2 },
  { type: '博客', value: 1 },
];

// 情绪分析数据
const emotionData = [
  { type: '积极', value: 45000 },
  { type: '中性', value: 35612 },
  { type: '消极', value: 20023 },
];

// 热词图谱数据
const hotwordsData = [
  { name: "中国海警", value: 8500 },
  { name: "钓鱼岛巡航", value: 7800 },
  { name: "南海维权", value: 7500 },
  { name: "日本海警", value: 7200 },
  { name: "美国海警", value: 6800 },
  { name: "海上执法", value: 6500 },
  { name: "印太战略", value: 6300 },
  { name: "领海巡逻", value: 6100 },
  { name: "护渔行动", value: 5900 },
  { name: "主权声明", value: 5700 },
  { name: "联合演习", value: 5500 },
  { name: "对峙事件", value: 5300 },
  { name: "军事合作", value: 5100 },
  { name: "海域监视", value: 4900 },
  { name: "装备升级", value: 4700 },
  { name: "航行自由", value: 4500 },
  { name: "联合巡航", value: 4300 },
  { name: "海域划界", value: 4100 },
  { name: "渔业纠纷", value: 3900 },
  { name: "联合执法", value: 3700 },
  { name: "舰船建造", value: 3500 },
  { name: "海洋法规", value: 3300 },
  { name: "战略博弈", value: 3100 },
  { name: "技术革新", value: 2900 },
  { name: "救援行动", value: 2700 }
];

// 添加 RankList 组件
const RankList = ({ data }) => {
  return (
    <ul className={styles.rankList}>
      {data?.map((item, index) => (
        <li key={item.id || index} className={styles.rankItem}>
          <span className={`${styles.rankNum} ${index < 3 ? styles.top3 : ''}`}>
            {index + 1}
          </span>
          <span className={styles.rankTitle}>{item.title}</span>
          <span className={styles.rankValue}>{item.value}</span>
        </li>
      ))}
    </ul>
  );
};

// 添加中文字体支持
const addFontToJsPDF = async (pdf) => {
  try {
    // 注意：需要将字体文件放在 public 目录下
    const fontResponse = await fetch('/fonts/SourceHanSansCN-Normal.ttf');
    const fontBuffer = await fontResponse.arrayBuffer();
    
    // 直接添加字体到 pdf 实例
    pdf.addFont('/fonts/SourceHanSansCN-Normal.ttf', 'SourceHanSans', 'normal');
    pdf.setFont('SourceHanSans');
    
    return true;
  } catch (error) {
    console.error('加载字体失败:', error);
    return false;
  }
};

const Monitoring = () => {
  // 添加发布地域和作者地域的数据
  const publishRegionData = [
    { region: '中国', value: 2345 },
    { region: '美国', value: 1234 },
    { region: '韩国', value: 876 },
    { region: '日本', value: 654 }
  ];

  const authorRegionData = [
    { region: '中国', value: 1876 },
    { region: '美国', value: 987 },
    { region: '韩国', value: 654 },
    { region: '日本', value: 432 }
  ];

  // 将数据移到组件内部
  const websiteTop10 = [
    { title: '路透社', value: 8900 },
    { title: '美联社', value: 8500 },
    { title: '法新社', value: 8100 },
    { title: '英国广播公司', value: 7800 },
    { title: '美国有线电视新闻网', value: 7500 },
    { title: '半岛电视台', value: 7200 },
    { title: '纽约时报', value: 6900 },
    { title: '华尔街日报', value: 6600 },
    { title: '金融时报', value: 6300 },
    { title: '经济学人', value: 6000 }
  ];

  const authorTop10 = [
    { title: '海上保安厅', value: 156 },
    { title: '日本海事新聞社', value: 143 },
    { title: '海上自卫队', value: 138 },
    { title: '护卫舰球磨后援会', value: 127 },
    { title: '横滨水警署', value: 119 },
    { title: '关岛海岸警卫队', value: 112 },
    { title: '台湾英文新闻', value: 98 },
    { title: '美国海岸警卫队', value: 87 },
    { title: '海巡署東部分署 ', value: 76 },
    { title: '海洋警察厅', value: 65 }
  ];

  const wechatTop10 = [
    { title: '环球军事', value: 8800 },
    { title: '中国军网', value: 8500 },
    { title: '解放军报', value: 8200 },
    { title: '央视军事', value: 7900 },
    { title: '军事观察', value: 7600 },
    { title: '国防时报', value: 7300 },
    { title: '军事前沿', value: 7000 },
    { title: '国防科技', value: 6700 },
    { title: '军事研究', value: 6400 },
    { title: '海疆在线', value: 6100 }
  ];

  const weiboTop10 = [
    { title: '人民日报', value: 2345 },
    { title: '新华社', value: 2156 },
    { title: '央视新闻', value: 1987 },
    { title: '环球时报', value: 1876 },
    { title: '澎湃新闻', value: 1765 },
    { title: '中国新闻网', value: 1654 },
    { title: '新京报', value: 1543 },
    { title: '财经网', value: 1432 },
    { title: '第一财经', value: 1321 },
    { title: '科技日报', value: 1210 }
  ];

  const hotinfoTop10 = [
    { title: '中国海警舰艇编队在钓鱼岛海域巡航', value: 9200 },
    { title: '日本海上保安厅扩充巡逻船只规模', value: 8800 },
    { title: '美国海岸警卫队加强印太地区部署', value: 8500 },
    { title: '中日海警船在东海相遇对峙事件', value: 8200 },
    { title: '中国海警发布最新海上维权报告', value: 7900 },
    { title: '美日海警联合巡航训练行动开展', value: 7600 },
    { title: '中国海警护渔行动取得显著成效', value: 7300 },
    { title: '日本海保厅新型巡逻舰投入使用', value: 7000 },
    { title: '美国海警战略部署东移引关注', value: 6700 },
    { title: '三国海警装备技术升级竞争加剧', value: 6400 }
  ];

  // 添加数据分析文本生成函数
  const generateAnalysisText = () => {
    const texts = {
      trend: `信息走势分析：2024年1月至12月期间，各类信息源呈现稳步上升趋势。其中，社交媒体信息量最大，从1月的520条增长至12月的1300条，增幅达150%。新闻信息次之，从350条增至980条。`,
      media: `媒体舆情分布：新闻网站占比最高(40%)，其次是推特(20%)和脸书(15%)，表明传统新闻媒体仍是主要信息来源。`,
      emotion: `情绪分析：舆情整体呈现积极态势，积极情绪占比45%，中性情绪35.6%，消极情绪19.4%。`,
      hotwords: `热词分析：经济发展、科技创新、乡村振兴是最受关注的三大主题，反映了当前社会发展重点方向。`,
      region: `地域分布：信息发布和作者主要集中在中国和美国两个地区，其中中国地区发布量最大，占比超过40%。`
    };
    return texts;
  };

  // 修改PDF导出功能
  const exportToPDF = async () => {
    try {
      message.loading('正在生成PDF报告...');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // 添加中文字体
      const fontLoaded = await addFontToJsPDF(pdf);
      if (!fontLoaded) {
        // 如果字体加载失败，使用默认字体
        pdf.setFont('helvetica');
      }

      const element = document.querySelector('.'+styles.container);
      
      // 获取所有需要导出的内容（包括Tabs内容）
      const tabPanes = element.querySelectorAll('.ant-tabs-tabpane');
      tabPanes.forEach(pane => {
        if (pane.classList.contains('ant-tabs-tabpane-hidden')) {
          pane.classList.remove('ant-tabs-tabpane-hidden');
        }
      });

      const originalHeight = element.style.height;
      const originalOverflow = element.style.overflow;
      element.style.height = 'auto';
      element.style.overflow = 'visible';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        height: element.scrollHeight,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('.'+styles.container);
          clonedElement.style.height = 'auto';
          clonedElement.style.overflow = 'visible';
          // 确保克隆文档中的所有tab内容都可见
          const clonedPanes = clonedElement.querySelectorAll('.ant-tabs-tabpane');
          clonedPanes.forEach(pane => {
            pane.classList.remove('ant-tabs-tabpane-hidden');
            pane.style.display = 'block';
            pane.style.visibility = 'visible';
          });
        }
      });

      // 恢复原始状态
      element.style.height = originalHeight;
      element.style.overflow = originalOverflow;
      tabPanes.forEach(pane => {
        if (!pane.getAttribute('aria-hidden')) {
          pane.classList.add('ant-tabs-tabpane-hidden');
        }
      });

      const texts = generateAnalysisText();
      
      // 添加标题
      pdf.setFontSize(20);
      pdf.text('数据分析报告', 105, 15, { align: 'center' });
      
      // 添加分析文本
      pdf.setFontSize(12);
      Object.values(texts).forEach((text, index) => {
        pdf.text(text, 20, 30 + index * 20, {
          maxWidth: 170,
          align: 'justify'
        });
      });
      
      // 添加图表，根据图表实际高度计算PDF页面
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 297; // A4页面高度
      
      // 添加新页面放置图表
      pdf.addPage();
      
      let heightLeft = imgHeight;
      let position = 10;
      let page = 1;

      // 如果图表高度超过一页，分多页显示
      while (heightLeft > 0) {
        pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - 20);
        if (heightLeft > 0) {
          pdf.addPage();
          position = 10 - (imgHeight - heightLeft);
          page++;
        }
      }
      
      pdf.save('数据分析报告.pdf');
      message.success('PDF报告生成成功！');
    } catch (error) {
      message.error('PDF生成失败，请重试');
      console.error('PDF生成错误:', error);
    }
  };

  // 修改Word导出功能
  const exportToWord = async () => {
    try {
      message.loading('正在生成Word报告...');
      const element = document.querySelector('.'+styles.container);
      
      // 保存所有标签页的原始状态
      const allTabs = element.querySelectorAll('.ant-tabs');
      const tabsStates = new Map();
      
      // 处理所有的 Tabs 组件
      allTabs.forEach((tabComponent, index) => {
        const tabPanes = tabComponent.querySelectorAll('.ant-tabs-tabpane');
        const activeTab = tabComponent.querySelector('.ant-tabs-tab-active');
        const activeKey = activeTab ? activeTab.getAttribute('data-node-key') : null;
        
        tabsStates.set(tabComponent, {
          panes: Array.from(tabPanes).map(pane => ({
            element: pane,
            hidden: pane.classList.contains('ant-tabs-tabpane-hidden'),
            display: pane.style.display,
            visibility: pane.style.visibility,
            height: pane.style.height,
            position: pane.style.position
          })),
          activeKey
        });
      });

      // 临时修改样式以显示所有内容
      const originalStyle = {
        height: element.style.height,
        overflow: element.style.overflow,
        position: element.style.position
      };

      // 设置容器样式
      element.style.height = 'auto';
      element.style.overflow = 'visible';
      element.style.position = 'relative';

      // 显示所有标签页内容
      allTabs.forEach(tabComponent => {
        const tabPanes = tabComponent.querySelectorAll('.ant-tabs-tabpane');
        tabPanes.forEach(pane => {
          pane.classList.remove('ant-tabs-tabpane-hidden');
          pane.style.display = 'block';
          pane.style.visibility = 'visible';
          pane.style.height = 'auto';
          pane.style.position = 'relative';
          pane.style.opacity = '1';
        });
      });

      // 等待内容完全渲染
      await new Promise(resolve => setTimeout(resolve, 2000));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        height: element.scrollHeight,
        windowHeight: element.scrollHeight,
        allowTaint: true,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('.'+styles.container);
          clonedElement.style.height = 'auto';
          clonedElement.style.overflow = 'visible';
          clonedElement.style.position = 'relative';
          
          // 处理克隆文档中的所有标签页
          const clonedTabs = clonedElement.querySelectorAll('.ant-tabs');
          clonedTabs.forEach(tabComponent => {
            const tabPanes = tabComponent.querySelectorAll('.ant-tabs-tabpane');
            tabPanes.forEach(pane => {
              pane.classList.remove('ant-tabs-tabpane-hidden');
              pane.style.display = 'block';
              pane.style.visibility = 'visible';
              pane.style.height = 'auto';
              pane.style.position = 'relative';
              pane.style.opacity = '1';
            });
          });
        }
      });

      // 恢复原始状态
      element.style.height = originalStyle.height;
      element.style.overflow = originalStyle.overflow;
      element.style.position = originalStyle.position;

      // 恢复所有标签页的原始状态
      allTabs.forEach(tabComponent => {
        const state = tabsStates.get(tabComponent);
        state.panes.forEach(paneState => {
          const pane = paneState.element;
          if (paneState.hidden) {
            pane.classList.add('ant-tabs-tabpane-hidden');
          }
          pane.style.display = paneState.display;
          pane.style.visibility = paneState.visibility;
          pane.style.height = paneState.height;
          pane.style.position = paneState.position;
        });
      });

      // 分割图片以避免 Word 文档限制
      const maxHeight = 1500; // Word 对图片有大小限制
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const numParts = Math.ceil(imgHeight / maxHeight);
      
      const texts = generateAnalysisText();
      const children = [
        new Paragraph({
          text: '数据分析报告',
          heading: 'Heading1'
        }),
        ...Object.values(texts).map(text => 
          new Paragraph({ text: text })
        )
      ];

      // 将大图片分割成多个部分
      for (let i = 0; i < numParts; i++) {
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        const partHeight = Math.min(maxHeight, imgHeight - i * maxHeight);
        
        tempCanvas.width = imgWidth;
        tempCanvas.height = partHeight;
        
        ctx.drawImage(
          canvas,
          0, i * maxHeight, // 源图片的起始位置
          imgWidth, partHeight, // 源图片的宽高
          0, 0, // 目标位置
          imgWidth, partHeight // 目标宽高
        );

        children.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: tempCanvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, ''),
                transformation: {
                  width: 600,
                  height: (partHeight * 600) / imgWidth
                }
              })
            ]
          })
        );
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children: children
        }]
      });

      const buffer = await Packer.toBlob(doc);
      saveAs(buffer, '数据分析报告.docx');
      message.success('Word报告生成成功！');
    } catch (error) {
      message.error('Word生成失败，请重试');
      console.error('Word生成错误:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.dataAnalysis}>
        {/* 添加导出按钮 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              onClick={exportToPDF}
              style={{ marginRight: 8 }}
            >
              导出PDF版分析报告
            </Button>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              onClick={exportToWord}
            >
              导出Word版分析报告
            </Button>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
          {/* 信息走势 */}
          <Col span={24}>
            <Card title="信息走势分析">
              <div style={{ height: '400px' }}>
                <Line 
                  data={trendData}
                  xField="data"
                  yField="value"
                  seriesField="type"
                  height={350}
                />
              </div>
            </Card>
          </Col>
          
          {/* 媒体舆情与热词图谱 */}
          <Col span={12}>
            <Card title="媒体舆情分布">
              <div style={{ height: '400px' }}>
                <Pie 
                  data={mediaData}
                  angleField="value"
                  colorField="type"
                  height={350}
                />
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="热词图谱">
              <div style={{ height: '400px' }}>
                <WordCloud
                  data={hotwordsData}
                  wordField="name"
                  weightField="value"
                  colorField="name"
                  height={350}
                  wordStyle={{
                    fontFamily: 'Verdana',
                    fontSize: [12, 32],
                    rotation: 0
                  }}
                  random={() => 0.5}
                />
              </div>
            </Card>
          </Col>
          
          {/* 情绪分析与地域分布 */}
          <Col span={24}>
            <Card title="情绪分析">
              <div style={{ height: '400px' }}>
                <Column 
                  data={emotionData}
                  xField="type"
                  yField="value"
                  height={350}
                  xAxis={{
                    label: {
                      style: {
                        fill: '#fff',
                        fontSize: 14,  // 增加字体大小
                        fontWeight: 700  // 增加字体粗细以提高可读性
                      },
                    }
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="发布地域分布">
              <div style={{ height: '400px' }}>
                <Column 
                  data={publishRegionData}
                  xField="region"
                  yField="value"
                  height={350}
                  label={{
                    position: 'top',
                    style: { fill: '#fff' }
                  }}
                  xAxis={{
                    label: {
                      style: {
                        fill: '#fff',
                        fontSize: 14,  // 增加字体大小
                        fontWeight: 700  // 增加字体粗细以提高可读性
                      },
                    }
                  }}
                  yAxis={{
                    label: {
                      style: { fill: '#fff' }
                    }
                  }}
                  color="#1890ff"
                  // columnStyle={{
                    // radius: [20, 20, 0, 0]
                  // }}
                />
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="作者地域分布">
              <div style={{ height: '400px' }}>
                <Column 
                  data={authorRegionData}
                  xField="region"
                  yField="value"
                  height={350}
                  label={{
                    position: 'top',
                    style: {
                        fill: '#fff',
                        fontSize: 14,  // 增加字体大小
                        fontWeight: 700  // 增加字体粗细以提高可读性
                    },
                  }}
                  xAxis={{
                    label: {
                      style: {
                        fill: '#fff',
                        fontSize: 14,  // 增加字体大小
                        fontWeight: 700  // 增加字体粗细以提高可读性
                      },
                    }
                  }}
                  yAxis={{
                    label: {
                      style: { fill: '#fff' }
                    }
                  }}
                  color="#52c41a"
                  // columnStyle={{
                    // radius: [20, 20, 0, 0]
                  // }}
                />
              </div>
            </Card>
          </Col>
          
          {/* 拆分后的 TOP10 展示 */}
          <Col span={24}>
            <Card title="网站TOP10">
              <div style={{ height: '450px', width: '100%', position: 'relative' }}>
                <Column 
                  data={websiteTop10}
                  xField="title"
                  yField="value"
                  height={400}
                  autoFit={true}
                  label={{
                    position: 'top',
                    style: { fill: '#fff' }
                  }}
                  xAxis={{
                    label: {
                      style: {
                        fill: '#fff',
                        fontSize: 14,  // 增加字体大小
                        fontWeight: 700  // 增加字体粗细以提高可读性
                      },
                      autoRotate: true,
                      angle: 45
                    }
                  }}
                  yAxis={{
                    label: {
                      style: { fill: '#fff' }
                    }
                  }}
                  color="#1890ff"
                  // columnStyle={{
                  //   radius: [20, 20, 0, 0]
                  // }}
                />
              </div>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="作者TOP10">
              <div style={{ height: '450px', width: '100%', position: 'relative' }}>
                <Column 
                  data={authorTop10}
                  xField="title"
                  yField="value"
                  height={400}
                  autoFit={true}
                  label={{
                    position: 'top',
                    style: { fill: '#fff' }
                  }}
                  xAxis={{
                    label: {
                      style: {
                        fill: '#fff',
                        fontSize: 14,  // 增加字体大小
                        fontWeight: 700  // 增加字体粗细以提高可读性
                      },
                      autoRotate: true,
                      angle: 45
                    }
                  }}
                  yAxis={{
                    label: {
                      style: { fill: '#fff' }
                    }
                  }}
                  color="#52c41a"
                  // columnStyle={{
                  //   radius: [20, 20, 0, 0]
                  // }}
                />
              </div>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="微信公众号TOP10">
              <div style={{ height: '450px', width: '100%', position: 'relative' }}>
                <Column 
                  data={wechatTop10}
                  xField="title"
                  yField="value"
                  height={400}
                  autoFit={true}
                  label={{
                    position: 'top',
                    style: { fill: '#fff' }
                  }}
                  xAxis={{
                    label: {
                      style: {
                        fill: '#fff',
                        fontSize: 14,  // 增加字体大小
                        fontWeight: 700  // 增加字体粗细以提高可读性
                      },
                      autoRotate: true,
                      angle: 45
                    }
                  }}
                  yAxis={{
                    label: {
                      style: { fill: '#fff' }
                    }
                  }}
                  color="#faad14"
                  // columnStyle={{
                  //   radius: [20, 20, 0, 0]
                  // }}
                />
              </div>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="微博账号TOP10">
              <div style={{ height: '450px', width: '100%', position: 'relative' }}>
                <Column 
                  data={weiboTop10}
                  xField="title"
                  yField="value"
                  height={400}
                  autoFit={true}
                  label={{
                    position: 'top',
                    style: { fill: '#fff' }
                  }}
                  xAxis={{
                    label: {
                      style: {
                        fill: '#fff',
                        fontSize: 14,  // 增加字体大小
                        fontWeight: 700  // 增加字体粗细以提高可读性
                      },
                      autoRotate: true,
                      angle: 45
                    }
                  }}
                  yAxis={{
                    label: {
                      style: { fill: '#fff' }
                    }
                  }}
                  color="#f5222d"
                  // columnStyle={{
                  //   radius: [20, 20, 0, 0]
                  // }}
                />
              </div>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="热点信息TOP10">
              <div style={{ height: '450px', width: '100%', position: 'relative' }}>
                <Column 
                  data={hotinfoTop10}
                  xField="title"
                  yField="value"
                  height={400}
                  autoFit={true}
                  label={{
                    position: 'top',
                    style: { fill: '#fff' }
                  }}
                  xAxis={{
                    label: {
                      style: {
                        fill: '#fff',
                        fontSize: 14,  // 增加字体大小
                        fontWeight: 700  // 增加字体粗细以提高可读性
                      },
                      autoRotate: true,
                      angle: 45
                    }
                  }}
                  yAxis={{
                    label: {
                      style: { fill: '#fff' }
                    }
                  }}
                  color="#722ed1"
                  // columnStyle={{
                  //   radius: [20, 20, 0, 0]
                  // }}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Monitoring;

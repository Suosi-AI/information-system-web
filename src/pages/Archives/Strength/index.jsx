import React, { useState, useMemo } from 'react';
import { AimOutlined } from '@ant-design/icons';
import styles from './index.less';
import { Button, Modal, Radio, Space, Tabs, Image, Timeline, Empty } from 'antd';
import SecurityDepartmentsTabs from './SecurityDepartmentsTabs';

import EChartComponent from '@/components/common/EChartComponent';

export default function Strength({ strengthData }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDetailVisible, setIsModalDetailVisible] = useState(false);
  const [currentShip, setCurrentShip] = useState(null);
  const tabsKeys = Object.keys(strengthData);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const showModalInfo = ship => {
    setCurrentShip(ship);
    setIsModalDetailVisible(true);
  };
  const handleCancelInfo = () => {
    setIsModalDetailVisible(false);
  };

  // 处理弹窗关闭的函数
  const handleOk = () => {
    setIsModalVisible(false);
  };

  // 处理弹窗取消的函数
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const { treeData, treeData1, treeData2 } = strengthData.t1;
  const handleNodeClick = nodeData => {};

  const chartOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove|click',
        position: function (point, params, dom, rect, size) {
          // 将 tooltip 显示在右侧
          return [point[0] + size.viewSize[0] / 2];
        },
        formatter: function (params) {
          // params 参数包含了当前项的所有信息，包括 name 和 data
          const name = params.name; // 获取当前节点的名称
          let description = ''; // 默认 description 为空

          // 检查 params.data 和 params.data.data 属性，并且获取 description 字段
          if (params.data && params.data.description) {
            description = params.data.description;
          } else if (params.data && params.data.data && params.data.data.description) {
            description = params.data.data.description;
          }

          // 构建 tooltip 的 HTML 结构
          let tooltipHtml = `
            <div style="max-width: 300px; padding: 10px; border-radius: 5px; background-color: rgba(0,0,0,0.7); color: #fff;">
              <p style="margin: 0;">${name}</p>
              ${
                description
                  ? `<pre style="color: #00EDD8; width: 300px; white-space: pre-wrap; word-wrap: break-word; font-size: 12px; line-height: 26px;">${description}</pre>`
                  : ''
              }
            </div>
          `;

          return tooltipHtml.trim();
        },
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 5,
        padding: [10, 10],
      },
      series: [
        {
          type: 'tree',
          data: [treeData],
          roam: true,
          left: '2%',
          right: '2%',
          top: '8%',
          bottom: '20%',
          symbol: 'emptyCircle',
          orient: 'vertical',
          expandAndCollapse: true, // 允许展开和折叠
          initialTreeDepth: 3, // 默认展开到第三层
          label: {
            position: 'left',
            rotate: 0,
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 16,
            color: '#00EDD8',
          },
          leaves: {
            label: {
              position: 'bottom',
              rotate: 0,
              verticalAlign: 'middle',
              align: 'left',
            },
          },
          animationDurationUpdate: 750,
        },
      ],
    }),
    [treeData]
  );

  const chartOption1 = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        position: function (point, params, dom, rect, size) {
          // 将 tooltip 显示在右侧
          return [point[0] + size.viewSize[0] / 2];
        },
        formatter: function (params) {
          const data = params.data || {}; // 确保数据对象存在
          const detail = data.data.detail;

          let tooltipHtml = `
          <div style="max-width: 300px; padding: 10px; border-radius: 5px; background-color: rgba(0,0,0,0.7); color: #fff;">
        `;

          // 如果存在detail数组，则展示数组中的内容
          if (Array.isArray(detail) && detail.length > 0) {
            tooltipHtml += `
            <div style="margin: 0;">
          `;
            detail.forEach((item, index) => {
              tooltipHtml += `
              <p style="color: #00EDD8; margin: 5px 0;">${item.item}</p>
            `;
            });
            tooltipHtml += `
            </div>
          `;
          } else {
            // 如果没有detail数组或数组为空，则不展示任何内容
            tooltipHtml += `<p style="color: #00EDD8; margin: 5px 0;">无详细信息</p>`;
          }

          // 关闭 tooltip 的 HTML 结构
          tooltipHtml += `
          </div>
        `;

          return tooltipHtml.trim();
        },
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 5,
        padding: [10, 10],
      },
      series: [
        {
          type: 'tree',
          data: [treeData1],
          roam: true,
          left: '2%',
          right: '2%',
          top: '8%',
          bottom: '20%',
          symbol: 'emptyCircle',
          orient: 'vertical',
          expandAndCollapse: true,
          label: {
            position: 'left',
            rotate: 0,
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 16,
            color: '#00EDD8',
          },
          leaves: {
            label: {
              position: 'bottom',
              rotate: 0,
              verticalAlign: 'middle',
              align: 'left',
            },
          },
          animationDurationUpdate: 750,
        },
      ],
    }),
    [treeData1]
  );

  const chartOption2 = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        position: function (point, params, dom, rect, size) {
          // 将 tooltip 显示在右侧
          return [point[0] + size.viewSize[0] / 2];
        },
        formatter: function (params) {
          const data = params.data || {}; // 确保数据对象存在
          const detail = data.data.detail;

          let tooltipHtml = `
          <div style="max-width: 300px; padding: 10px; border-radius: 5px; background-color: rgba(0,0,0,0.7); color: #fff;">
        `;

          // 如果存在detail数组，则展示数组中的内容
          if (Array.isArray(detail) && detail.length > 0) {
            tooltipHtml += `
            <div style="margin: 0;">
          `;
            detail.forEach((item, index) => {
              tooltipHtml += `
              <p style="color: #00EDD8; margin: 5px 0;">${item.item}</p>
            `;
            });
            tooltipHtml += `
            </div>
          `;
          } else {
            // 如果没有detail数组或数组为空，则不展示任何内容
            tooltipHtml += `<p style="color: #00EDD8; margin: 5px 0;">无详细信息</p>`;
          }

          // 关闭 tooltip 的 HTML 结构
          tooltipHtml += `
          </div>
        `;

          return tooltipHtml.trim();
        },
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 5,
        padding: [10, 10],
      },
      series: [
        {
          type: 'tree',
          data: [treeData2],
          roam: true,
          left: '2%',
          right: '2%',
          top: '8%',
          bottom: '20%',
          symbol: 'emptyCircle',
          orient: 'vertical',
          expandAndCollapse: true,
          label: {
            position: 'left',
            rotate: 0,
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 16,
            color: '#00EDD8',
          },
          leaves: {
            label: {
              position: 'bottom',
              rotate: 0,
              verticalAlign: 'middle',
              align: 'left',
            },
          },
          animationDurationUpdate: 750,
        },
      ],
    }),
    [treeData2]
  );

  return (
    <div className={styles.container}>
      <Tabs
        defaultActiveKey={tabsKeys[0]} // 默认激活第一个标签页
        style={{ color: 'white', width: '100%', marginTop: '-30px' }}
      >
        {tabsKeys.map(key => {
          const tabData = strengthData[key];
          const { departmentsData = [], shipsData = {} } = tabData.guanquTabs?.[0] || {};
          // debugger;
          const jianjie = tabData.jianjie || [];

          const image = jianjie.find(item => item.type === 'image');
          const title = jianjie.find(item => item.type === 'text');
          const iconData = jianjie.find(item => item.iconData);
          const guanqu = jianjie.find(item => item.guanqu);
          const info = jianjie.find(item => item.info);
          const addr = jianjie.find(item => item.addr);

          return (
            <Tabs.TabPane tab={tabData.title} key={key}>
              {tabData.jianjie && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '250px',
                      justifyContent: 'center',
                    }}
                  >
                    {image && <Image src={image.src} alt={image.alt} style={image.style} />}
                  </div>
                  <div
                    style={{
                      height: '200px',
                      margin: '0 20px',
                      overflow: 'hidden',
                      maxWidth: '600px',
                    }}
                  >
                    {title && (
                      <p
                        style={{
                          borderRadius: '25px',
                          backgroundColor: '#292B39',
                          color: '#EA9626',
                          padding: '5px',
                          textAlign: 'center',
                          maxWidth: '40%',
                          height: '30px',
                        }}
                      >
                        {title.title}
                      </p>
                    )}
                    <div style={{ display: 'flex', margin: '10px 0' }}>
                      {iconData?.iconData?.map((item, index) => (
                        <div
                          key={index}
                          style={{ marginRight: '30px', display: 'flex', alignItems: 'center' }}
                        >
                          <img
                            src={item.src}
                            alt={item.alt}
                            style={{ width: '20px', height: '20px', marginRight: '10px' }}
                          />
                          <span>{item.count}</span>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        overflow: 'auto',
                        flexWrap: 'wrap',
                        maxHeight: '120px',
                      }}
                    >
                      {guanqu?.guanqu?.map((item, index) => (
                        <p
                          key={index}
                          style={{
                            borderRadius: '10px',
                            border: '1px solid #4892FF',
                            textAlign: 'center',
                            fontSize: '12px',
                            padding: '6px',
                            height: '33px',
                            marginRight: index === guanqu.guanqu.length - 1 ? '0' : '10px',
                          }}
                        >
                          {item.name}
                        </p>
                      ))}
                    </div>
                  </div>
                  {!title && !iconData && !guanqu && info && addr && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '80%',
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          maxHeight: '150px',
                          overflow: 'auto',
                          backgroundColor: '#282B39',
                          padding: '20px 20px 0 20px ',
                        }}
                      >
                        <p>描述</p>
                        <pre
                          style={{
                            color: 'white',
                            width: '100%',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            color: '#D4D5D3',
                            fontSize: '12px',
                            maxHeight: '200px',
                            lineHeight: '26px',
                          }}
                        >
                          {info.info}
                        </pre>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          marginTop: '20px',
                          backgroundColor: '#282B39',
                          lineHeight: '40px',
                          paddingLeft: '20px',
                        }}
                      >
                        {' '}
                        地址：<span> {addr.addr}</span>
                      </div>
                    </div>
                  )}
                  {!title && !iconData && !guanqu && !addr && info && (
                    <div
                      style={{
                        width: '100%',
                        maxHeight: '150px',
                        overflow: 'auto',
                        backgroundColor: '#282B39',
                        padding: '20px 20px 0 20px ',
                      }}
                    >
                      <p>描述</p>
                      <pre
                        style={{
                          color: 'white',
                          width: '100%',
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                          color: '#D4D5D3',
                          fontSize: '12px',
                          maxHeight: '200px',
                          lineHeight: '26px',
                        }}
                      >
                        {info.info}
                      </pre>
                    </div>
                  )}
                  {title && iconData && guanqu && info && (
                    <div
                      style={{
                        width: '600px',
                        maxHeight: '200px',
                        overflow: 'auto',
                        backgroundColor: '#282B39',
                        padding: '20px',
                      }}
                    >
                      <p>描述</p>
                      <pre
                        style={{
                          color: 'white',
                          width: '100%',
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                          color: '#D4D5D3',
                          fontSize: '12px',
                          height: '200px',
                          lineHeight: '26px',
                        }}
                      >
                        {info.info}
                      </pre>
                    </div>
                  )}
                </div>
              )}
              {/*日本 总体实力 的树图 */}
              {key === 't1' && treeData && treeData1 && (
                <div
                  style={{
                    backgroundColor: '#171B28',
                    padding: '20px',
                    marginTop: '20px',
                    display: 'flex',
                    height: '100vh',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#282B39',
                      padding: '10px',
                    }}
                  >
                    <p
                      style={{
                        width: '100px',
                        borderLeft: '5px solid #02f3dd',
                        height: '25px',
                        paddingLeft: '4px',
                      }}
                    >
                      舰艇装备
                    </p>
                    {treeData && (
                      <div style={{ flex: 1 }}>
                        <EChartComponent
                          option={chartOption}
                          onClick={handleNodeClick}
                          style={{ width: '100%!important', height: '100%' }}
                        />
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: '20px',
                      backgroundColor: '#282B39',
                      padding: '10px',
                    }}
                  >
                    <p
                      style={{
                        width: '100px',
                        borderLeft: '5px solid #02f3dd',
                        height: '25px',
                        paddingLeft: '4px',
                      }}
                    >
                      飞机装备
                    </p>
                    {treeData1 && (
                      <div style={{ flex: 1 }}>
                        <EChartComponent
                          option={chartOption1}
                          onClick={handleNodeClick}
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {key === 't1' && treeData2 && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '20px',
                    backgroundColor: '#282B39',
                    padding: '10px',
                    height: '60vh',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <EChartComponent
                      option={chartOption2}
                      onClick={handleNodeClick}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                </div>
              )}

              {/* 台湾 总体实力   */}
              {key === 't1' && tabData.twDetails && (
                <div
                  style={{
                    backgroundColor: '#282B39',
                    padding: '20px 20px 20px 0',
                    marginTop: '20px',
                  }}
                  className={styles.box}
                >
                  {tabData.twDetails &&
                    tabData.twDetails.map((detail, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: '#282B39',
                          paddingLeft: '20px ',
                          // marginTop: '20px',
                        }}
                      >
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>
                          {detail.Technical}
                        </p>
                        {Array.isArray(detail.preContent) ? (
                          detail.preContent.map((pre, preIndex) => (
                            <div key={preIndex}>
                              <p style={{ color: 'white' }}>{pre.preContents}</p>
                              {pre.timeContent.length > 0 && (
                                <Timeline>
                                  {pre.timeContent.map((item, timeIndex) => (
                                    <Timeline.Item key={timeIndex}>{item.Technical1}</Timeline.Item>
                                  ))}
                                </Timeline>
                              )}
                            </div>
                          ))
                        ) : (
                          <div>
                            <p>{detail.preContents}</p>
                            {detail.timeContent.length > 0 && (
                              <Timeline>
                                {detail.timeContent.map((item, timeIndex) => (
                                  <Timeline.Item key={timeIndex}>{item.Technical1}</Timeline.Item>
                                ))}
                              </Timeline>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* 管区图片 */}
              {key !== 't1' && (
                <div
                  style={{
                    backgroundColor: '#282B39',
                    padding: '20px 20px 20px 0',
                    marginTop: '20px',
                  }}
                  className={styles.box}
                >
                  {/* 日本管区图片 */}
                  {tabData.guanquTabs && (
                    <SecurityDepartmentsTabs
                      departmentsData={departmentsData}
                      ships={shipsData}
                      showModal={showModal}
                      showModalInfo={showModalInfo}
                    />
                  )}

                  {/* 美国 管区图片 */}
                  {tabData.details && (
                    <div className={styles.timeStyle}>
                      {tabData.details[0].title && (
                        <p style={{ color: '#02f3dd' }}>{tabData.details[0].title?.title}</p>
                      )}
                      <Timeline style={{ paddingLeft: '20px' }}>
                        {tabData.details.slice(1).map((detail, index) => (
                          <Timeline.Item key={index}>
                            <p style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>
                              {detail.Technical}
                            </p>

                            {/* 遍历 mixBox 中的每个对象 */}
                            {detail.mixBox &&
                              detail.mixBox.map((box, boxIndex) => (
                                <div key={boxIndex}>
                                  {box.preContents && (
                                    <pre
                                      style={{
                                        color: '#D4D5D3',
                                        width: '100%',
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        fontSize: '12px',
                                        lineHeight: '26px',
                                      }}
                                    >
                                      {box.preContents}
                                    </pre>
                                  )}

                                  {/* 嵌套的 Timeline 组件 */}
                                  {box.timeContent && (
                                    <Timeline
                                      style={{ borderLeft: '0!important', marginTop: '10px' }}
                                    >
                                      {box.timeContent.map((timeDetail, timeIndex) => (
                                        <Timeline.Item key={timeIndex}>
                                          <p style={{ fontSize: '12px', color: 'white' }}>
                                            {timeDetail.Technical1}
                                          </p>
                                          <pre
                                            style={{
                                              color: '#D4D5D3',
                                              width: '100%',
                                              whiteSpace: 'pre-wrap',
                                              wordWrap: 'break-word',
                                              fontSize: '12px',
                                              lineHeight: '26px',
                                            }}
                                          >
                                            {timeDetail.preContent}
                                          </pre>
                                        </Timeline.Item>
                                      ))}
                                    </Timeline>
                                  )}
                                </div>
                              ))}
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </div>
                  )}
                  {tabData.detailsContent &&
                    tabData.detailsContent.map((item, index) => (
                      <div key={index} style={{ paddingLeft: '20px' }}>
                        <p style={{ fontWeight: 'bold' }}>{item.name}</p>
                        <Timeline>
                          {item.box.map((boxItem, boxIndex) => (
                            <Timeline.Item key={boxIndex}>
                              <p style={{ fontSize: '12px', color: 'white' }}>
                                {boxItem.preContents}
                              </p>
                              <pre
                                style={{
                                  color: '#D4D5D3',
                                  width: '100%',
                                  whiteSpace: 'pre-wrap',
                                  wordWrap: 'break-word',
                                  fontSize: '12px',
                                  lineHeight: '26px',
                                }}
                              >
                                {boxItem.timeContent[0].Technical1}
                              </pre>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      </div>
                    ))}

                  {tabData.context &&
                    tabData.context.map((item, index) => (
                      <div key={index}>
                        {item.title && (
                          <p style={{ paddingLeft: '20px', color: '#02f3dd' }}>{item.title}</p>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', paddingLeft: '20px' }}>
                          {item.shipsData?.length > 0 &&
                            item.shipsData.map((ship, shipIndex) => (
                              <div
                                key={shipIndex}
                                style={{ margin: '10px 20px 0 0', cursor: 'pointer' }}
                                onClick={() => showModalInfo(ship)} // 假设 showModalInfo 是一个处理点击事件的函数
                              >
                                <img
                                  src={ship.image}
                                  alt={ship.name}
                                  style={{ width: '200px', height: '150px' }}
                                />
                                <p style={{ width: '200px', textAlign: 'center' }}>{ship.title}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}

                  {!tabData.context ||
                    (tabData.context.length > 0 &&
                      !tabData.context.some(item => item.shipsData?.length > 0) && (
                        <div className={styles.centeredEmpty}>
                          <Empty />
                        </div>
                      ))}

                  <Modal
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={false}
                    width={800}
                    style={{ textAlign: 'center', background: '#282B39!important' }}
                  >
                    <img
                      src={tabData.jianjie[0].src}
                      alt="位置"
                      style={{ width: '100%', marginTop: '30px' }}
                    />
                  </Modal>
                </div>
              )}
            </Tabs.TabPane>
          );
        })}
      </Tabs>

      <Modal
        visible={isModalDetailVisible}
        onCancel={handleCancelInfo}
        footer={false}
        style={{ color: 'white' }}
        width={800}
      >
        {currentShip && (
          <div style={{ display: 'flex', color: 'white', margin: '10px 10px', flexWrap: 'wrap' }}>
            名称 : <span style={{ marginRight: '20px' }}>{currentShip.name}</span>
            {currentShip.dai && (
              <span>
                代号:<span style={{ marginRight: '20px' }}>{currentShip.dai}</span>
              </span>
            )}
            {currentShip.jibie && (
              <span>
                级别:<span style={{ marginRight: '20px' }}>{currentShip.jibie}</span>
              </span>
            )}
            型号：<span style={{ marginRight: '20px' }}>{currentShip.model}</span>
            {currentShip.type && (
              <span>
                类型：<span style={{ marginRight: '20px' }}>{currentShip.type}</span>
              </span>
            )}
            {currentShip.length && (
              <span>
                总长：<span style={{ marginRight: '20px' }}>{currentShip.length}</span>
              </span>
            )}
            {currentShip.miaoshu && (
              <span>
                {' '}
                描述：<span style={{ marginRight: '20px' }}>{currentShip.miaoshu}</span>
              </span>
            )}
          </div>
        )}
        {currentShip && <img src={currentShip.image} alt="" style={{ width: '100%' }} />}
      </Modal>
    </div>
  );
}

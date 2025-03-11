import React from 'react';
import { Tabs, Timeline } from 'antd';
import styles from './index.less';

const Documentation = documentationData => {
  const tabsKeys = Object.keys(documentationData);

  return (
    <div className={styles.container}>
      <Tabs
        defaultActiveKey={tabsKeys[0]}
        style={{
          color: 'white',
          width: '100%',
          marginTop: '-20px',
          paddingLeft: '20px',
          height: '85vh',
          overflow: 'hidden',
        }}
      >
        {tabsKeys.map(key => {
          const tabs = documentationData[key];
          return Object.keys(tabs).map(tabKey => {
            const tabData = tabs[tabKey];
            return (
              <Tabs.TabPane
                tab={tabData.title}
                key={tabKey}
                style={{
                  height: '74vh',
                  overflow: 'auto',
                  paddingTop: '20px',
                }}
              >
                <Timeline>
                  {tabData.details.map((detail, index) => (
                    <Timeline.Item key={index}>
                      <a
                        href={detail.altLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}
                      >
                        {detail.Technical}
                      </a>
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
                        {detail.preContent}
                      </pre>
                    </Timeline.Item>
                  ))}
                </Timeline>
                {/* </div> */}
              </Tabs.TabPane>
            );
          });
        })}
      </Tabs>
    </div>
  );
};

export default Documentation;

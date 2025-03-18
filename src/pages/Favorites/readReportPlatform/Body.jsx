import React from 'react';
import { Button } from 'antd';

export default function ReadReportPlatform(props) {
  const {
    rawReportBody = () => <div>No main content</div>,
    rawReportTitle = () => <div>No main content</div>,
    transformReportTitle = () => <div>No main content</div>,
    transformReportBody = () => <div>No main content</div>,
    summary = () => <div>No main content</div>,
    aside,
  } = props;

  const reportStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridAutoRows: 'min-content',
    rowGap: '1rem',
  };

  const reportHeaderStyle = {
    width: '50%',
    justifySelf: 'center',
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 350px',
        gap: '2rem',
        background: 'white',
        padding: '2rem',
      }}
    >
      <main>
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '2rem' }}>
          <div style={reportStyle}>
            <header style={reportHeaderStyle}>{rawReportTitle}</header>
            <main>{rawReportBody}</main>
          </div>

          <div style={reportStyle}>
            <header style={reportHeaderStyle}>{transformReportTitle}</header>
            <main>{transformReportBody}</main>
          </div>
        </section>

        <section style={{ marginTop: '5rem' }}>
          <h1 style={{ color: 'black', fontWeight: 'bold' }}>摘要结果：</h1>
          {summary}
        </section>
      </main>

      <aside style={{ background: 'white', maxHeight: 'fit-content' }}>{aside}</aside>
    </div>
  );
}

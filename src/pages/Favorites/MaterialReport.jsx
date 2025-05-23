import React from 'react';
import ReportList from 'src/components/common/ReportList';

export default function MaterialReport(props) {
  const { left, right } = props || {};
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', columnGap: '2rem' }}>
      <div>
        <header style={{ display: 'flex', justifyContent: 'center' }}>{left.header}</header>
        <section style={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: '20px' }}>
          {left.main}
        </section>
      </div>

      <div>{right}</div>
    </div>
  );
}

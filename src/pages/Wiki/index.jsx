import React, { useState } from 'react';

const Wiki = ({ site, wikiData }) => {
  const [error, setError] = useState(null);

  const handleIframeLoad = e => {
    const iframe = e.target;
    try {
      const content = iframe.contentDocument.body.innerHTML;
    } catch (err) {
      console.error('Failed to access iframe content: ', err);
      // setError('Failed to access iframe content');
    }
  };

  return (
    <div style={{ backgroundColor: 'black', height: '100vh', color: 'white' }}>
      {error && <div>Error: {error}</div>}
      <iframe
        src={site === 'wiki' ? wikiData.wikiSrc : wikiData.baikeSrc}
        style={{ width: '100%', height: '92vh', border: 'none' }}
        onLoad={handleIframeLoad}
        title={wikiData.title}
      />
    </div>
  );
};

Wiki.defaultProps = {
  title: 'Embedded Page',
  src: 'https://zh.wikipedia.org/wiki/%E6%B5%B7%E4%B8%8A%E4%BF%9D%E5%AE%89%E5%BB%B3',
};

export default Wiki;

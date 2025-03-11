import React, { useState } from 'react';

const Monitoring = () => {
  const [error, setError] = useState(null);

  // 使用 iframe 嵌入页面
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
    <div>
      {error && <div>Error: {error}</div>}
      <iframe
        // src="http://192.168.101.29:9006"
        src="http://180.167.238.140:18883"
        style={{ width: '100%', height: '92vh', border: 'none' }}
        onLoad={handleIframeLoad}
        title="Embedded Page"
      />
    </div>
  );
};

export default Monitoring;

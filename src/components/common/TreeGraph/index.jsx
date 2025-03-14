import React, { useEffect, useRef } from 'react';
import G6 from '@antv/g6';

const TreeGraph = ({ data }) => {
  console.log('====================================');
  console.log(data);
  console.log('====================================');
  const graphRef = useRef(null);

  useEffect(() => {
    if (!graphRef.current) return;

    try {
      const graph = new G6.TreeGraph({
        container: graphRef.current,
        width: 800,
        height: 600,
        // 其他配置...
      });

      if (data && data.nodes && data.edges) {
        graph.data(data);
        graph.render();
      } else {
        console.error('Invalid graph data:', data);
      }

      return () => {
        graph.destroy();
      };
    } catch (error) {
      console.error('Error rendering graph:', error);
    }
  }, [data]);

  return <div ref={graphRef} />;
};

export default TreeGraph;

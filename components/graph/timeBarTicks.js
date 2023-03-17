import React, { useState, useEffect } from "react";


const TimeBarTicks = () => {
    const ref = React.useRef(null)
    const [graph, setGraph] = useState(null);
    const [timeBar, setTimeBar] = useState(null);
  

    useEffect(() => {
      const G6 = require('@antv/g6');
      
      const data = {                   
        nodes: [{ id: 'node01', date:20230104 },
                { id: 'node02', date:20230108 },
                { id: 'node03', date:20230109 },
                { id: 'node04', date:20230110 },
                { id: 'node05', date:20230111 }, 
                { id: 'node06', date:20230117 },
                { id: 'node07', date:20230118 },
                { id: 'node08', date:20230119 },
                { id: 'node09', date:20230120 },
                { id: 'node10', date:20230121 },
                ],
        edges: [ {source: 'node01', target: 'node02' },  ],
      };
      

      
      const container = ref.current;
      const width = container.scrollWidth;
      const height = (container.scrollHeight || 500) - 100;
      const timeBarData = [];

      
      for (let i = 1; i < 31; i++) {
        const day = i < 10 ? `0${i.toString()}` : `${i.toString()}`;
        timeBarData.push({
          date: parseInt(`202301${day}`),
          value: Math.round(1),
        });
      }


      const nodeSize = 20;
    
      
      let count = 0;
      const newTimebar = new G6.TimeBar({
        x: 0,
        y: 0,
        width,
        height: 150,
        padding: 10,
        type: 'tick',
        tick: {
          data: timeBarData,
          width: width,
          height: 42,
          padding: 2,
          tickLabelFormatter: (d) => {
            count++;
            const dateStr = `${d.date}`;
            if ((count - 1) % 10 === 0) {
              return `${dateStr.substr(0, 4)}-${dateStr.substr(4, 2)}-${dateStr.substr(6, 2)}`;
            }
            return false;
          },
          tooltipFomatter: (d) => {
            const dateStr = `${d}`;
            return `${dateStr.substr(0, 4)}-${dateStr.substr(4, 2)}-${dateStr.substr(6, 2)}`;
          },
        },
      });
      
      // constrained the layout inside the area
      const constrainBox = { x: 10, y: 10, width: 800, height: 400 };
      
      const onTick = () => {
        let minx = 99999999;
        let maxx = -99999999;
        let miny = 99999999;
        let maxy = -99999999;
        let maxsize = -9999999;
        data.nodes.forEach((node) => {
          if (minx > node.x) {
            minx = node.x;
          }
          if (maxx < node.x) {
            maxx = node.x;
          }
          if (miny > node.y) {
            miny = node.y;
          }
          if (maxy < node.y) {
            maxy = node.y;
          }
        });
        const scalex = (constrainBox.width - nodeSize / 4) / (maxx - minx);
        const scaley = (constrainBox.height - nodeSize / 2) / (maxy - miny);
        data.nodes.forEach((node) => {
          node.x = (node.x - minx) * scalex + constrainBox.x;
          node.y = (node.y - miny) * scaley + constrainBox.y;
        });
      };
      
      const newGraph = new G6.Graph({
        container: ref.current,
        width: 1300,
        height: 700,
        linkCenter: true,
        plugins: [newTimebar],
        layout: {
          type: 'force',
          preventOverlap: true,
          onTick,
        },
        defaultNode: {
          size: nodeSize,
          type: 'circle',
          style: {
            fill: '#DEE9FF',
            stroke: '#5B8FF9',
          },
        },
        modes: {
          default: ['drag-node'],
        },
      });
      newGraph.data(data);
      newGraph.render();
      
      /* if (typeof window !== 'undefined')
        window.onresize = () => {
          if (!newGraph || newGraph.get('destroyed')) return;
          if (!container || !container.scrollWidth || !container.scrollHeight) return;
          newGraph.changeSize(container.scrollWidth, container.scrollHeight - 100);
        }; */
      
      setGraph(newGraph);
      setTimeBar(newTimebar);
    }, [])
  
    return <div ref={ref}></div>
  }
  
  export default TimeBarTicks
  
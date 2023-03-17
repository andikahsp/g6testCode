import React, { useState, useEffect } from "react";
import { data as jsonData } from './source';

function toUTCTimeString(logSourceTime){
  const actualTime = new Date(0);
  actualTime.setUTCSeconds(logSourceTime);
 return actualTime.toUTCString();
}

function toDateAndTimeNumber(logSourceTime){
  const actualDateTime = new Date(0);
  actualDateTime.setUTCSeconds(logSourceTime);
  const dateString = actualDateTime.toISOString().slice(0,10);
  const dateInteger = parseInt(dateString.replace(/-/g, ""));
  
  const epochTimeForDay = new Date(dateString);
  const dayElapsedInSeconds = logSourceTime - ( epochTimeForDay.getTime() / 1000 );
  const dayElapsedInFractionString = ( dayElapsedInSeconds / 86400 ).toFixed(5); // <-- no effect, depends on smallest unit of timeBar
  let dateAndTimeDecimal;
  if(dayElapsedInSeconds !== 0){
    dateAndTimeDecimal = dateInteger + parseFloat(dayElapsedInFractionString);
    return dateAndTimeDecimal;
  } else 
  { dateAndTimeDecimal = parseFloat(`${dateInteger.toString()}.0000001`);
    return dateAndTimeDecimal;
  }
}

function populateNodesEdges (jsonData){
  const loggedDate = toDateAndTimeNumber(jsonData.logsourceTime);
  const displayedTime = toUTCTimeString(jsonData.logsourceTime);
  const loggedDate2 = toDateAndTimeNumber(1636243200);
  const displayedTime2 = toUTCTimeString(1636243200);
 
  // This format if we want custom shapes and sizes according
  // to data
  const circle = { type: 'circle', 
                   size: 48 };
  
  const triangle = { type: 'triangle',
                     size: 20, 
                     direction: 'up'};
                       

   const data = {
     nodes:[
       { id: 'node0', ...circle, label: jsonData.computerName, date: loggedDate  },
       { id: 'node1', ...circle, label: jsonData.originatingComputer, date: loggedDate },
       { id: 'node2', ...triangle, label: jsonData.logonProcess, date: loggedDate2 },
       { id: 'node3', ...circle, label: 'newThreat', date: toDateAndTimeNumber(1636367215) },
     ],
     edges: [
       { source: 'node0', target: 'node1', label: `${jsonData.message}\n ${displayedTime}` },
       { source: 'node2', target: 'node1', label: `calls to\n ${displayedTime2}` },
       { source: 'node3', target: 'node0', label: `sent to\n ${toUTCTimeString(1636367215)}` },
     ],
   } 
   return data;
 }



const TimeBarTrendDays = () => {
    const ref = React.useRef(null)
    const [graph, setGraph] = useState(null);
    const [timeBar, setTimeBar] = useState(null);
  

    useEffect(() => {
      const G6 = require('@antv/g6');
      
      
      const nodeEdgeData = populateNodesEdges(jsonData);

      const container = ref.current;
      const width = container.scrollWidth;
      const height = (container.scrollHeight || 700) - 100;
      const timeBarData = [];

      // Scale: Days | Window: 15 days
      for (let i = 1; i < 16; i++) {
        const zero = 0;
        const day = i < 10 ? `${zero.toString()}${i.toString()}` : `${i.toString()}`;
        const dateInNumber = parseInt(`202111${day}`);
        timeBarData.push({
          date: dateInNumber,
          value: Math.round(Math.random() * 300),
        });
      }


      const nodeSize = 36;
    
      const newTimebar = new G6.TimeBar({
        x: 0,
        y: 0,
        width,
        height: 180,
        padding: 20,
        type: 'trend',
        trend: {
          data: timeBarData,
        },
        slider: {
          start: 0.1,
          end: 0.5,
        }
      });
      
      // constrained the layout inside the area
      // x: offset dist from left in px
      // y: offset dist from top in px
      const constrainBox = { x: 60, y: 50, width: 800, height: 500 };
      
      const onTick = () => {
        let minx = 99999999;
        let maxx = -99999999;
        let miny = 99999999;
        let maxy = -99999999;
        let maxsize = -9999999;
        nodeEdgeData.nodes.forEach((node) => {
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
        const scalex = (constrainBox.width - nodeSize / 2) / (maxx - minx);
        const scaley = (constrainBox.height - nodeSize / 2) / (maxy - miny);
        nodeEdgeData.nodes.forEach((node) => {
          node.x = (node.x - minx) * scalex + constrainBox.x;
          node.y = (node.y - miny) * scaley + constrainBox.y;
        });
      };
      
      const newGraph = new G6.Graph({
        container: ref.current,
        width: width,
        height: height,
        linkCenter: false,
        plugins: [newTimebar],
        layout: {
          type: 'force2',
          preventOverlap: true,
          linkDistance: d => {
            if (d.source.id === 'node0') {
              return 400;
            }
            return 250;
          },
          onTick,
          
        },
        /* layout: {
          center: [700,500],
          type: 'mds',
          linkDistance: 200,
          workerEnabled: true,
          onTick,
        }, */
        defaultNode: {
          size: nodeSize,
          type: 'circle',
          style: {
            stroke: '#4fdcff',
            fill: '#DEE9FF',
            lineWidth: 6
          },
          labelCfg: {
            position: 'bottom',
            offset: 6,
            style: {
              fill: '#000000A6',
              fontFamily: 'Arial',
              fontSize: 11
            }
          },
        },
        defaultEdge: {
          type: 'quadratic',
          style: {
            stroke: '#5f6466',
            lineWidth: 2.67,
            endArrow: {
            path: G6.Arrow.triangle(5, 6, 6), // (width, length, offset (wrt d))
            fill: '#5f6466',
            d: 6 // offset
          },
          },
          
        },
        modes: {
          default: ['drag-node'],
        },
        labelCfg: {
          position: 'bottom',
          offset: 6,
          style: {
            fill: '#000000A6',
            fontFamily: 'Arial',
            fontSize: 12
          }
        },
        nodeStateStyles: {
          hover: {
            stroke: 'red',
            lineWidth: 3
          }
        },
        edgeStateStyles: {
          hover: {
            stroke: 'blue',
            lineWidth: 3
          }
        }
      });
      newGraph.data(nodeEdgeData);
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
  
  export default TimeBarTrendDays
  
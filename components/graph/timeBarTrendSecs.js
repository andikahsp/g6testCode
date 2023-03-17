import React, { useState, useEffect } from "react";
import { data as jsonData } from './source';

function toUTCTime(logSourceTime){
  const actualTime = new Date(0);
  actualTime.setUTCSeconds(logSourceTime);
 return actualTime.toUTCString();
}

function toUTCMinutesSeconds(logSourceTime){
  const actualDateTime = new Date(0);
  actualDateTime.setUTCSeconds(logSourceTime);
  const hours = actualDateTime.getUTCHours();
  const minutes = actualDateTime.getUTCMinutes();
  const seconds = actualDateTime.getUTCSeconds();
  const hourString = hours.toString(); 
  const minutesString = minutes < 10 ? `0${minutes.toString()}` : `${minutes.toString()}`;
  const secondsString = seconds < 10 ? `0${seconds.toString()}` : `${seconds.toString()}`;
  const minutesSeconds = `${minutesString}.${secondsString}`;

  return `${hourString}${minutesSeconds}`;
}

function make2Entities1Relation (jsonData){
  const loggedDate = toUTCMinutesSeconds(jsonData.logsourceTime);
  const displayedTime = toUTCTime(jsonData.logsourceTime);
  const loggedDate2 = toUTCMinutesSeconds(1636286400);
  const displayedTime2 = toUTCTime(1636286400);
 
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
     ],
     edges: [
       { source: 'node0', target: 'node1', label: `${jsonData.message}\n ${displayedTime}`},
     ],
   } 
   return data;
 }



const TimeBarTrendMins = () => {
    const ref = React.useRef(null)
    const [graph, setGraph] = useState(null);
    const [timeBar, setTimeBar] = useState(null);
  

    useEffect(() => {
      const G6 = require('@antv/g6');
      
      
      const nodeEdgeData = make2Entities1Relation(jsonData);

      const container = ref.current;
      const width = container.scrollWidth;
      const height = (container.scrollHeight || 700) - 100;
      const timeBarData = [];

      // Scale: Minutes | 
      // time= 6.59
      // window: 6.55 am  - 7.05 am (10minutes)
/*       for (let i = 415; i < 425; i++) {
        const hour = Math.floor(i / 60);
        //const hourString = hour.toString();
        const hourString = hour < 10 ? `0${hour.toString()}`: `${hour.toString()}`;
        const minute = i % 60; 
        const minuteString = minute < 10 ?  `0${minute.toString()}`: `${minute.toString()}`;
        const timeString = `${hourString}${minuteString}`;
        timeBarData.push({
          date: `${timeString}`,
          value: Math.round(Math.random() * 200)
        });
        console.log(`${i}seconds, timeString=${timeString}`)
      } */

      // Scale: Seconds | 
      // time= 6:59.08 am
      // window: 6:58.38am  - 6:59.38 am (60seconds)
      // 58mins38secs (3518secs) to 59mins38secons(3578secs)  
      for (let i = 3518; i < 3578; i++) {
        const minute = Math.floor(i / 60);
        //const minuteString = minute.toString();
        const minuteString = minute < 10 ? `0${minute.toString()}`: `${minute.toString()}`;
        const seconds = i % 60; 
        const secondsString = seconds < 10 ?  `0${seconds.toString()}`: `${seconds.toString()}`;
        const timeString = `${minuteString}.${secondsString}`;
        timeBarData.push({
          date: `06${timeString}`,
          value: Math.round(Math.random() * 200),
        });
        console.log(`${i}seconds, timeString=${timeString}`)
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
          end: 0.9,
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
  
  export default TimeBarTrendMins
  
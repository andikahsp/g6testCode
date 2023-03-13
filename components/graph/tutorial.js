import React, { useState, useEffect } from "react";

function make2Entities1Relation (jsonData){
    const utcSeconds = jsonData.logsourceTime;
    const logSourceTime = new Date(0); // use 0 to set date to epoch
    logSourceTime.setUTCSeconds(utcSeconds);
   
     const data = {
       nodes:[
         /* { id: 'node0', size: 100, label: jsonData.computerName },
         { id: 'node1', size: 100, label: jsonData.originatingComputer },  */
         { id: 'node0', size: 100, label: jsonData.computerName },
         { id: 'node1', size: 100, label: jsonData.originatingComputer },
       ],
       edges: [
         { source: 'node0', target: 'node1', label: `${jsonData.message}\n ${logSourceTime}` },
       ],
     } 
     return data;
   }

const Tutorial = ({logEventJSON}) => {
    const ref = React.useRef(null)
    const [graph, setGraph] = useState(null);
  
    
    useEffect(() => {
      const G6 = require('@antv/g6');
      
      // Instantiate Graph
      const newGraph = new G6.Graph({
        container: ref.current,
        width: 1200,
        height: 800,
        modes: {
          default: ['drag-canvas', 'zoom-canvas']
        },
        defaultNode: {
          type: 'circle',
          labelCfg: {
            style: {
              fill: '#000000A6',
              fontSize: 10
            }
          },
          style: {
            stroke: '#72CC4A',
            width: 150
          }
        },
        defaultEdge: {
          type: 'line'
        },
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: d => {
            if (d.source.id === 'node0') {
              return 600;
            }
            return 400;
          },
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
      })
      
      const nodeEdgeData = make2Entities1Relation(logEventJSON);
      newGraph.data(nodeEdgeData)
    
      newGraph.render()
  
      newGraph.on('node:mouseenter', evt => {
        newGraph.setItemState(evt.item, 'hover', true)
      })
  
      newGraph.on('node:mouseleave', evt => {
        newGraph.setItemState(evt.item, 'hover', false)
      })
  
      newGraph.on('edge:mouseenter', evt => {
        newGraph.setItemState(evt.item, 'hover', true)
      })
  
      newGraph.on('edge:mouseleave', evt => {
        newGraph.setItemState(evt.item, 'hover', false)
      })

      setGraph(newGraph);
    }, [logEventJSON])
  
    return <div ref={ref}></div>
  }
  
  export default Tutorial
  
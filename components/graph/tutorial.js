import React, { useState, useEffect } from "react";

function make2Entities1Relation (jsonData){
    const utcSeconds = jsonData.logsourceTime;
    const logSourceTime = new Date(0); // use 0 to set date to epoch
    logSourceTime.setUTCSeconds(utcSeconds);
   
    // This format if we want custom shapes and sizes according
    // to data
    const circle = { type: 'circle', 
                     size: 48 };

    const ellipse = { type: 'ellipse',
                      size: [100, 60] };
    
    const triangle = { type: 'triangle',
                       size: 20, 
                       direction: 'up'};
                         

     const data = {
       nodes:[
         { id: 'node0', ...circle, label: jsonData.computerName },
         { id: 'node1', ...circle, label: jsonData.originatingComputer },
         { id: 'node2', ...triangle, label: jsonData.logonProcess },
         
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
        height: 600,
        modes: {
          default: ['drag-canvas', 'zoom-canvas']
        },
        defaultNode: {
          // type: 'circle',
          labelCfg: {
            position: 'bottom',
            offset: 6,
            style: {
              fill: '#000000A6',
              fontFamily: 'Arial',
              fontSize: 12
            }
          },
          style: {
            stroke: '#4fdcff',
            lineWidth: 3.5
          }
        },
        defaultEdge: {
          type: 'quadratic',
          style: {
            //endArrow: true,
            endArrow: {
              path: G6.Arrow.triangle(8, 8, 3), // (width, length, offset (wrt d))
              fill: '#5f6466',
              d: 3 // offset
              },
            stroke: '#5f6466',
            lineWidth: 2
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
        /* layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: d => {
            if (d.source.id === 'node0') {
              return 600;
            }
            return 400;
          },
        }, */
        layout: {
          center: [700,500],
          type: 'mds',
          linkDistance: 200,
          workerEnabled: true,
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
  
/*       newGraph.on('node:mouseenter', evt => {
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
      }) */

      setGraph(newGraph);
    }, [logEventJSON])
  
    return <div ref={ref}></div>
  }
  
  export default Tutorial
  
import React, { useState, useEffect } from "react";
import { data as jsonData } from './source';


function getUTCDateObject(logsourceTime){
  const actualTime = new Date(0);
  actualTime.setUTCSeconds(logsourceTime);
  return actualTime;
}


function toUTCTimeString(logsourceTime){
  const dateObjUTC = getUTCDateObject(logsourceTime);
 return dateObjUTC.toUTCString();
}

function toTimeString(number){
  return number < 10 ? `0${number.toString()}` : `${number.toString()}`;
}
function getUTCHrMinSec(logsourceTime){
  const dateObjUTC = getUTCDateObject(logsourceTime);
  const hours = dateObjUTC.getUTCHours();
  const minutes = dateObjUTC.getUTCMinutes();
  const seconds = dateObjUTC.getUTCSeconds();

  const hoursString = toTimeString(hours);
  const minutesString = toTimeString(minutes);
  const secondsString = toTimeString(seconds); 

  return hoursString + `:` + minutesString + `.` + secondsString;
}

function populateNodesEdges (jsonData){
  const displayedTime = toUTCTimeString(jsonData.logsourceTime);
 
  // This format if we want to customise shapes and sizes according
  // to data
  const circle = { type: 'circle', 
                   size: 48 };
  
  const triangle = { type: 'triangle',
                     size: 20, 
                     direction: 'up'};
   
   // node and edge definition will be based on backend logic                  
   const data = {
      nodes:[
       { id: 'node0', ...circle, label: jsonData.computerName, date: jsonData.logsourceTime },
       { id: 'node1', ...circle, label: jsonData.originatingComputer, date: jsonData.logsourceTime },
       { id: 'node2', ...triangle, label: jsonData.logonProcess, date: 1636095550 },    
       { id: 'node3', ...triangle, label: `vector`, date: 1636095554 },    
      ], 
     edges: [
       { source: 'node0', 
         target: 'node1', 
         label: `${jsonData.message}\n ${displayedTime} `, 
      },
      { source: 'node2', 
         target: 'node3', 
         label: `sent 3 files to \n ${toUTCTimeString(1636095555)} `, 
      },
     ],
   } 
   return data;
 }


let nodeA = "";
let nodeB = "";
let comboNumber = 0;
let selectedComboId = "";
let callBackComboHas1NodeOrLess = "";

const TimeBarTrendSecs = () => {
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

      const range = 18; // number of units that window will show
      const axisMin = jsonData.logsourceTime - (range / 2);
      const axisMax = jsonData.logsourceTime + (range / 2) + 1;
     

      // Scale: Seconds | Cyvestigo 18 seconds window for seconds scale
      // time = 6:59.08 am
      // window: 6:58.59am  - 6:59.17 am (60seconds)
      for (let i = axisMin; i < axisMax; i++) {
        //console.log(`i = ${i}`);
        timeBarData.push({
          date: i,
          value: Math.round(Math.random() * 200),
        });
        //console.log(`${i}seconds, timeString=${timeString}`)
      }


      const nodeSize = 36;
      //console.log(G6.TimeBar);
      const newTimebar = new G6.TimeBar({
        x: 0,
        y: 0,
        width,
        height: 150,
        padding: 20,
        type: 'trend',
        tick: {
          tickLabelFormatter: (d) => {
            // convert the data accordingly
           // console.log(`d => ${JSON.stringify(d, null, 3)}`);
            return getUTCHrMinSec(d.date);
        },
          tickLabelStyle:{ 
            fontSize: 13, 
            fontFamily: 'Arial',
            fillOpacity: 0.9,
            stroke: 'blue',
            strokeOpacity: 0.9,
          },
          tickLineStyle: {
            width: 30, //<<==== no effect, not working
            height: 15, //<===== no effect, not working 
            //offset: 250, //<===== no effect, not working
            stroke: 'orange',
            lineWidth: 5,  
            strokeOpacity: 1,
          }
      },
        trend: {
          height: 60,

          data: timeBarData,
          smooth: false,
          lineStyle: {
            stroke: 'blue',
            lineWidth: 10,
          },
          isArea: true,
          areaStyle:{
            fill: 'pink',
          },
        },
        slider: { 
          backgroundStyle: { // ShapeStyle object format
            fill: 'transparent', 
          },
          foregroundStyle: { // ShapeStyle object format
            fill: 'cyan', 
            fillOpacity: 0.3,
          }, 
          height: 60,
          start: 0.25,
          end: 0.75,
          handlerStyle:{
            height: 500, // <===== not working
            width: 2, 
            fill:'gray',
            fillOpacity:0.7,
            stroke: 'lightgray',
            strokeOpacity: 0.7,
            /* style:{  //<========== not working
            }, */
          },
        },
        /* textStyle of slider display texts */
        textStyle: { 
          fill: 'black',
          fontFamily: 'Arial',
          fontSize: 0, // <=== turn off displayed text with 0.
        },
        backgroundStyle: {
          fill: 'black'
        },
        controllerCfg:{
          fontFamily: 'Arial',
          fontSize: 10,
          fill: 'yellow',
          stroke: 'red',
          preBtnStyle: {
            fill: 'purple',
            stroke: 'blue'
          },
          nextBtnStyle: {
            fill: 'red',
            stroke: 'blue'
          },
          playBtnStyle: {
            stroke: 'teal'
          },
          speedControllerStyle: {
            pointer: {
              fill:`red`,
              fillOpacity:1,
              stroke: 'red',
            },
            scroller: {
              fill: `white`,
              fillOpacity:0,
              stroke: 'blue',
            },
            text: {
              fill: `red`,
              fillOpacity:0,
              stroke: 'black',
            }, 
          },
          /** whether hide the 'time type controller' on the right-bottom */
          hideTimeTypeController: true,
          timeTypeControllerStyle: {
            text:{
              fillOpacity:0.0, 
              stroke: 'purple',
              fontFamily:'Arial',
            },
            box: {
              fillOpacity:0.0,
              stroke: 'gray',
            }
          },
          timePointControllerText:'time point',
          timeRangeControllerText:'time range',
        }
      });

    
      
      // constrained the layout inside the area
      // x: offset dist from left in px ? X-coordinate of the first node?
      // y: offset dist from top in px ? Y-coordinate of the first node?
      const constrainBox = { x: 60, y: 50, width: 800, height: 500 };
      
      const onTick = () => {
        let minx = 99999999;
        let maxx = -99999999;
        let miny = 99999999;
        let maxy = -99999999;
        let maxsize = -9999999; //<---- need to follow up
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
      
      //console.log(G6.Graph);
      const newGraph = new G6.Graph({
        container: ref.current,
        width: width,
        height: height,
        linkCenter: false,
        plugins: [newTimebar],
        layout: {
          type: 'force',
          center: [200, 200],
          preventOverlap: true,
          linkDistance: d => {
            if (d.source.id === 'node0') {
              return 200;
            }
            return 150;
          },
          nodeStrength: 30,
          edgeStrength: 0.1,
          collideStrength: 0.8,
          onTick,
          
        },
        defaultNode: {
          size: nodeSize,
          type: 'circle',
          style: {
            position: 'top',
            stroke: '#4fdcff',
            fill: 'transparent',
            lineWidth: 4,
          },
          labelCfg: {
            position: 'bottom',
            //offset: 6,
            style: {
              fill: '#000000A6',
              fontFamily: 'Arial',
              fontSize: 11
            }
          },
        },
        // Set groupByTypes to false to get rendering result with reasonable visual zIndex for combos
        groupByTypes: false,
        defaultCombo: {
          type: 'circle',
          size: [16], // The minimum size of the Combo
          padding: [16, 10, 3, 10],
          style: {
            position:'bottom',
            stroke: 'gray',
            fill: 'transparent',
            lineWidth: 1,
          },
          labelCfg: {
            refY: 15,
            position: 'bottom',
            style: {
              fill: '#000000A6',
              fontFamily: 'Arial',
              fontSize: 11
            }
          },
        },
        comboStateStyles: {
          dragenter: {
            lineWidth: 4,
            stroke: '#FE9797',
          },
        },
        defaultEdge: {
          type: 'line',
          style: {
            stroke: '#5f6266',
            lineWidth: 2.2,
              endArrow: {
              path: G6.Arrow.triangle(6.5, 7, 6), // (width, length, offset (wrt d))
              fill: '#5f6466',
              d: 6 // offset
            },
          },
          labelCfg: {
            autoRotate: false, 
            position: 'top',
            style: {
              fill: '#000000A6',
              fontFamily: 'Arial',
              fontSize: 11
            }
          },
          
        },
        modes: {
          default: [
            'drag-node',
            {
              type: 'drag-canvas',
              enableOptimize: false, // enable the optimize to hide the shapes beside nodes' keyShape
            },
            {
              type: 'zoom-canvas',
              enableOptimize: false, // enable the optimize to hide the shapes beside nodes' keyShape
            },
            'drag-combo', 
            'collapse-expand-combo'
          ],
        },
        labelCfg: {
          position: 'bottom',
          offset: 6,
          style: {
            fill: '#000000A6',
            fontFamily: 'Arial',
            fontSize: 50
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

      newGraph.on('node:mouseenter', (evt, e) => {
        newGraph.setItemState(evt.item, 'hover', true)
      })
      
      newGraph.on('node:mouseenter', (e) => {
        console.log('node:mouseenter e =', e);
        console.log(`mouseenter node ID = ${e.item._cfg.id}`)
          nodeA = e.item._cfg.id;
        //console.log(`mouseentered\n x: ${e.x}, y: ${e.y}`)
      })
      
      newGraph.on('node:mouseleave', evt => {
        newGraph.setItemState(evt.item, 'hover', false)
      })

      // check that the node that is being dragged, does not have a  comboId,  
      newGraph.on('node:dragenter', (e) => {
        console.log(`dragEnter node ID = ${e.item._cfg.id}`);
        if ( !('comboId' in e.item._cfg.model) || e.item._cfg.model.comboId === undefined ) { // if it has a comboId, do not create combo
          if(nodeA !== "" && e.item._cfg.id !== nodeA ){ 
            nodeB = e.item._cfg.id;
            newGraph.createCombo({
              id: `combo${comboNumber}`,   
            }, [`${nodeA}`, `${nodeB}`]);
            comboNumber += 1; // <=== this is causing uncontrolled propagation.
          }
        }
      });

      newGraph.on('node:dragend', (e) => {
        newGraph.getCombos().forEach((combo) => {
          newGraph.setItemState(combo, 'dragenter', false);
        });
        console.log(`node dragend ID = ${e.item._cfg.id}`);
        //console.log(`x: ${e.x}, y: ${e.y}`)
      });


      newGraph.on('edge:mouseenter', evt => {
        newGraph.setItemState(evt.item, 'hover', true)
      })
  
      newGraph.on('edge:mouseleave', evt => {
        newGraph.setItemState(evt.item, 'hover', false)
      })

      newGraph.on('combo:mouseenter', (evt) => {
        const { item } = evt;
        selectedComboId = item._cfg.id;
        console.log(`selectedComboId = ${selectedComboId}`);
        callBackComboHas1NodeOrLess = comboHas1NodeOrLess(evt.currentTarget.cfg.nodes, selectedComboId);
        newGraph.setItemState(item, 'active', true);
      });
      
      newGraph.on('combo:mouseleave', (evt) => {
        const { item } = evt;
        newGraph.setItemState(item, 'active', false);
      });
      
      newGraph.on('combo:dragenter', (e) => {
        newGraph.setItemState(e.item, 'dragenter', true);
      });
      
      
      newGraph.on('combo:dragleave', (e) => {
        console.log(`dragleave combo id = ${e.item._cfg.id}`)
        newGraph.setItemState(e.item, 'dragenter', false);
      });

      newGraph.on(`combo:mousedown`, (e) => {
        console.log(`...MOUSE UP`);
        // there is only 1 node left in the array, then we can uncombo
        if(callBackComboHas1NodeOrLess === true) {
          console.log(`selectedComboId on node:mouseup = ${selectedComboId}`);
          newGraph.uncombo(`${selectedComboId}`);
          selectedComboId = "";
        } 
      });
      // this function fails whenever there are no combo assignments
      // we  allow uncombo, if selected combo has only 1 node
      const comboHas1NodeOrLess = (nodesArray, selectedComboId) => {
        let counter = 0;
        for(let i = 0; i < nodesArray.length; i += 1){
          if('comboId' in nodesArray[i]._cfg.model){
            if(nodesArray[i]._cfg.model.comboId === selectedComboId && nodesArray[i]._cfg.model.comboId !== undefined){
              counter += 1
            }
          }
        }
        console.log(`${selectedComboId} counter = ${counter}`);
        if(counter == 0){
          return true
        }
        return false
      }

  

/*       newGraph.on('combo:dblclick', (e) => {
        console.log(`combo double click e = ${e}`);
        
      }); */
      
      
      /* if (typeof window !== 'undefined')
        window.onresize = () => {
          if (!newGraph || newGraph.get('destroyed')) return;
          if (!container || !container.scrollWidth || !container.scrollHeight) return;
          newGraph.changeSize(container.scrollWidth, container.scrollHeight - 100);
        }; */
      
      setGraph(newGraph);
      setTimeBar(newTimebar);
      //console.log(newGraph);
    }, [])
  
    return <div ref={ref}></div>
  }
  
  export default TimeBarTrendSecs
  
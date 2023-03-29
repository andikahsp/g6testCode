import React, { useState, useEffect } from "react";
import { data as jsonData } from './source';
import { isObject } from '@antv/util';


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
  let edgeOccurence = 1;
  const displayedTime = toUTCTimeString(jsonData.logsourceTime);
 
  // This format if we want to customise shapes and sizes according
  // to data
  
  const image = { type: 'image', 
                   size: 48 };
  
  const circle = { type: 'circle', 
                   size: 48 };
  
  const triangle = { type: 'triangle',
                     size: 20, 
                     direction: 'up'};
   
   // node and edge definition will be based on backend logic                  
   const data = {
      nodes:[
       { id: 'node0', ...image, label: jsonData.computerName, date: jsonData.logsourceTime },
       { id: 'node1', ...image, label: jsonData.originatingComputer, date: jsonData.logsourceTime },
       { id: 'node2', ...image, label: jsonData.logonProcess, date: 1636095550 },    
       { id: 'node3', ...image, label: `vector`, date: 1636095554 },    
      ], 
     edges: [
       { source: 'node0', 
         target: 'node1', 
         data: {
          frequency: '3', 
          event: `${jsonData.message}`
         }
      },
      { source: 'node2', 
         target: 'node3', 
         data: {
          frequency: '7', 
          event: `Event B`
         }
      },
/*       { source: 'node0', 
         target: 'node2',
         data: {
          frequency: '', 
          event: `LabelZ`
         }
      }, */
     ],
   } 
   return data;
 }


let nodeA = "";
let nodeB = "";
let comboNumber = 0;
let selectedComboId = "";
let nodesInCombo = 0;
let callBackNodesInCombo = false;
let style = {};

let nodeMouseDown = false;
let comboDragLeave = false;

const TimeBarTrendSecs2 = () => {
    const ref = React.useRef(null)
    const [graph, setGraph] = useState(null);
    const [timeBar, setTimeBar] = useState(null);

    useEffect(() => {
      const G6 = require('@antv/g6');
      
      
      const nodeEdgeData = populateNodesEdges(jsonData);
      nodeEdgeData.nodes[0].img = `https://cdn.pixabay.com/photo/2013/07/13/11/47/computer-158675_960_720.png`;
      nodeEdgeData.nodes[0].clipCfg = {
        show: false,
        type: 'circle',
        // circle
        r: 25,
        // Coordinates
        x: 0,
        y: 0,
      };

      nodeEdgeData.nodes[1].img = `https://cdn.pixabay.com/photo/2017/07/07/02/06/symbol-2480165_960_720.png`;
      nodeEdgeData.nodes[1].clipCfg = {
        show: false,
        type: 'circle',
        // circle
        r: 25,
        // Coordinates
        x: 0,
        y: 0,
      };

      nodeEdgeData.nodes[2].img = `https://cdn.pixabay.com/photo/2013/07/13/12/33/computer-159837_960_720.png`;
      nodeEdgeData.nodes[2].clipCfg = {
        show: false,
        type: 'circle',
        // circle
        r: 25,
        // Coordinates
        x: 0,
        y: 0,
      };

      nodeEdgeData.nodes[3].img = `https://cdn.pixabay.com/photo/2018/01/26/15/41/the-horse-3108969_960_720.png`;
      nodeEdgeData.nodes[3].clipCfg = {
        show: true,
        type: 'circle',
        // circle
        r: 25,
        // Coordinates
        x: 0,
        y: 0,
      };

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

      /*  *********** CUSTOM COMBO  ***********   */
      
      // The symbols for the marker inside the combo
      const collapseIcon = (x, y, r) => {
        return [
          ['M', x - r, y],
          ['a', r, r, 0, 1, 0, r * 2, 0],
          ['a', r, r, 0, 1, 0, -r * 2, 0],
          ['M', x - r + 4, y],
        ];
      };
      const expandIcon = (x, y, r) => {
        return [
          ['M', x - r, y],
          ['a', r, r, 0, 1, 0, r * 2, 0],
          ['a', r, r, 0, 1, 0, -r * 2, 0],
          ['M', x - r + 4, y],
          ['M', x - r + r, y - r + 4],
        ];
      };

      G6.registerCombo(
        'cCircle',
        {
          drawShape: function draw(cfg, group) {
            const self = this;
            // Get the shape style, where the style.r corresponds to the R in the Illustration of Built-in Rect Combo
            style = self.getShapeStyle(cfg);
            // Add a circle shape as keyShape which is the same as the extended 'circle' type Combo
            const circle = group.addShape('circle', {
              attrs: {
                ...style,
                x: 0,
                y: 0,
                r: style.r,
              },
              draggable: true,
              // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
              name: 'combo-keyShape',
            });
            // Add the marker on the bottom
            const marker = group.addShape('marker', {
              attrs: {
                ...style,
                opacity: 1,
                x: 0,
                y: style.r,
                r: 15,
                //symbol: collapseIcon,
                fill: '#1890FF',
                stroke: 'grey',
              },
              draggable: true,
              // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
              name: 'combo-marker-shape',
            });
            // text that goes into the marker/badge
            group.addShape('text', {
              attrs: {
                  text:cfg.label,
                  x: style.r,
                  y: style.r,
                  fontFamily: 'Arial',
                  fontSize: 19,
                  fill: 'red',
                  stroke: 'black',
              },
              draggable: true, 
              name: 'combo-marker-label'
            });
            return circle;
          },
          // Define the updating logic for the marker
          afterUpdate: function afterUpdate(cfg, combo) {
            const self = this;
            // Get the shape style, where the style.r corresponds to the R in the Illustration of Built-in Rect Combo
            const style = self.getShapeStyle(cfg);
            const group = combo.get('group');
            // Find the marker shape in the graphics group of the Combo
            const marker = group.find((ele) => ele.get('name') === 'combo-marker-shape');
            //Find textLabel shape in the graphics group of the Combo
            const textLabel = group.find((ele) => ele.get('name') === 'combo-marker-label');

            // Update the marker shape
            marker.attr({
              x: style.r * 0.50,
              y: (style.r - 10) * -1,
              // The property 'collapsed' in the combo data represents the collapsing state of the Combo
              // Update the symbol according to 'collapsed'
              symbol: cfg.collapsed ? expandIcon : collapseIcon,
            });
            //Update the textlabel
            textLabel.attr({
              text: (nodesInCombo === 0) ? `${2}` : `${nodesInCombo}`,
              x: style.r * 0.50 - 4, 
              y: (style.r - 20) * - 1,
            });
          },
        },
        'circle',
      );

      /* ******* CUSTOM EDGE ******* */

      G6.registerEdge('fund-polyline', {
        itemType: 'edge',
        draw: function draw(cfg, group) {

          // custom edge 
          const stroke = cfg.style.stroke;

          const startPoint = cfg.startPoint;
          const endPoint = cfg.endPoint;
          
          let path = [
            ['M', startPoint.x, startPoint.y],
            ['L', endPoint.x, endPoint.y],
          ];
      
          const endArrow = cfg?.style && cfg.style.endArrow ? cfg.style.endArrow : false;
          if (isObject(endArrow)) endArrow.fill = stroke;
          const line = group.addShape('path', {
            attrs: {
              path,
              stroke: 'black',
              lineWidth: 1.2,
              endArrow,
            },
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: 'path-shape',
          });
      

          const midPointXY = {       
            x: (endPoint.x - startPoint.x) / 2,
            y: (endPoint.y - startPoint.y) / 2

          }

          const markerXOffset = 10;
          const markerYOffset = -15;
          const labelXOffset = 15;

          // Add the circular marker on the bottom
          group.addShape('marker', {
            attrs: {
              ...style,
              opacity: 1,
              x: startPoint.x + midPointXY.x + markerXOffset,
              y: startPoint.y + midPointXY.y + markerYOffset - 1.5,
              r: 10,
              symbol: collapseIcon,
              fill: 'orange',
              stroke: 'black',
              strokeWidth: 3.5,
              lineWidth: 1.5,
            },
            draggable: true,
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: 'combo-marker-shape',
          });   

          // freqency
          group.addShape('text', {
            attrs: {
              text: cfg.data && cfg.data.frequency,
              x: startPoint.x + midPointXY.x + markerXOffset - 3.5,
              y: startPoint.y + midPointXY.y + markerYOffset,
              fontSize: 14,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: 'white',
            },
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: 'text-shape-frequency',
          });
          
          // event
          group.addShape('text', {
            attrs: {
              text: cfg.data && cfg.data.event,
              x: startPoint.x + midPointXY.x + markerXOffset + labelXOffset,
              y: startPoint.y + midPointXY.y + markerYOffset,
              fontSize: 12,
              fontWeight: 300,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#000000D9',
            },
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: 'text-shape-date',
          });
          const edgeLabel = group.find((ele) => ele.get('name') === 'text-shape-frequency')
          edgeLabel.toFront();
               
          return line;
        },
      });

      /* *************************************************** */
      
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
          type: 'cCircle',
          size: [16], // The minimum size of the Combo
          padding: [16, 10, 3, 10],
          style: {
            position:'bottom',
            stroke: 'gray',
            fill: 'transparent',
            lineWidth: 1,
          },
          labelCfg: {
            style: {
              position: 'bottom',
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
          type: 'fund-polyline',
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
            position: 'top-right',
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

      newGraph.on('node:mouseenter', (e) => {
        newGraph.setItemState(e.item, 'hover', true)
        console.log('node:mouseenter e =', e);
        nodeA = e.item._cfg.id;
      })
      
      
      newGraph.on('node:mouseleave', (e) => {
        newGraph.setItemState(e.item, 'hover', false)
      })

      // check that the node that is being dragged, does not have a  comboId,  
      newGraph.on('node:dragenter', (e) => {
        if ( !('comboId' in e.item._cfg.model) || e.item._cfg.model.comboId === undefined ) { // if it has a comboId, do not create combo
          if(nodeA !== "" && e.item._cfg.id !== nodeA ){ 
            nodeB = e.item._cfg.id;
            newGraph.createCombo({
              id: `combo${comboNumber}`, 
              label:`Combo${comboNumber}`,  
            }, [`${nodeA}`, `${nodeB}`]);
            comboNumber += 1;
          }
        }
      });

      newGraph.on('node:dragend', (e) => {
        newGraph.getCombos().forEach((combo) => {
          newGraph.setItemState(combo, 'dragenter', false);
        });
        newGraph.refresh();
      });

      newGraph.on('node:mousedown', (e) => {
        nodeMouseDown = true;
        console.log(`nodeMouseDown = ${nodeMouseDown}`);
      })

      newGraph.on('node:mouseup', (e) => {
        nodeMouseDown = false;
        comboDragLeave === false
        console.log(`nodeMouseDown = ${nodeMouseDown}`);
      })

      newGraph.on('edge:mouseenter', (e) => {
        newGraph.setItemState(e.item, 'hover', true)
      })
  
      newGraph.on('edge:mouseleave', (e) => {
        newGraph.setItemState(e.item, 'hover', false)
      })

      newGraph.on('combo:mouseenter', (e) => {
        const { item } = e;
        selectedComboId = item._cfg.id;
        console.log(`selectedComboId = ${selectedComboId}`);
        newGraph.setItemState(item, 'active', true);
        
        nodesInCombo = countNodesInCombo(e.currentTarget.cfg.nodes, selectedComboId);
        console.log(`combo:mouseenter nodesInCombo == ${nodesInCombo}`);
        newGraph.refresh();
      });
      
      newGraph.on('combo:mouseleave', (e) => {
        const { item } = e;
        newGraph.setItemState(item, 'active', false);
        nodesInCombo = countNodesInCombo(e.currentTarget.cfg.nodes, selectedComboId);
        newGraph.refresh();
      });
      
      newGraph.on('combo:dragenter', (e) => {
        console.log(`combo:dragenter nodeCount = ${nodesInCombo}`);
        nodesInCombo = countNodesInCombo(e.currentTarget.cfg.nodes, selectedComboId);
        newGraph.setItemState(e.item, 'dragenter', true);
/*         if(nodeMouseDown === false) {
          newGraph.setItemState(e.item, 'dragenter', true);
          newGraph.refresh();
        } */
      });
      
      
      newGraph.on('combo:dragleave', (e) => {
        comboDragLeave = true;
        console.log(`combo:dragleave combo${e.item._cfg.id}`)
        newGraph.setItemState(e.item, 'dragenter', false);

        console.log(`nodeMouseDown = ${nodeMouseDown}`)
        // there is only 1 node left in the array, then we can uncombo
        // needs more conditions to ensure that we are sure the user wants to remove combo
        if(nodeMouseDown === true && comboDragLeave === true){
          if( nodesInCombo === 1 ){
              console.log(`selectedComboId on node:mouseup = ${selectedComboId}`);
              newGraph.uncombo(`${selectedComboId}`);
              selectedComboId = "";
          } else {
            nodesInCombo =  nodesInCombo - 1;
            newGraph.refresh();
          }
        }
      });


      const countNodesInCombo = (nodesArray, selectedComboId) => {
        let counter = 0;
        for(let i = 0; i < nodesArray.length; i += 1){
          if('comboId' in nodesArray[i]._cfg.model){
            if(nodesArray[i]._cfg.model.comboId === selectedComboId && nodesArray[i]._cfg.model.comboId !== undefined){
              counter += 1
            }
          }
        }
        console.log(`${selectedComboId} counter = ${counter}`);
        return counter;
      }

    
      /* 
      // RESIZING
      if (typeof window !== 'undefined')
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
  
  export default TimeBarTrendSecs2
  
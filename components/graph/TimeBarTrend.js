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

  // This format if we want to customise shapes and sizes according
  // to data
  
  const image = { type: 'image', 
                   size: 36};
  
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
       { id: 'edge0',
         ttp: true, 
         source: 'node0', 
         target: 'node1', 
         frequency: '3', 
         event: `${jsonData.message}`       
      },
      {  id: 'edge2',
         source: 'node1', 
         target: 'node0', 
         frequency: '7', 
         event: `some other Event`
      },
      {  id: 'edge1',
         ttp: true, 
         source: 'node2', 
         target: 'node3', 
         frequency: '7', 
         event: `Event B`
      },
     ],
   } 
   return data;
 }

let log = console.log; 
let nodeA = "";
let nodeB = "";
let style = {};
let nodeDrag = false;
let comboDragLeave = false;


const TimeBarTrend = () => {
    const ref = React.useRef(null)
    const [newGraph, setGraph] = useState(null);
    const [timeBar, setTimeBar] = useState(null);

    useEffect(() => {
      const G6 = require('@antv/g6');
      //const G6 = require('graphG6/packages/g6/src/index');
      
      //transform rawQuery jsonData into nodeEdgeData
      const nodeEdgeData = populateNodesEdges(jsonData);
      // for the edges inside nodeEdgeData provide for dual edges:
      const edges2 = Array.from(nodeEdgeData.edges);
      edges2.pop();
      // G6.Util.processParallelEdges(edges2);
      G6.Util.processParallelEdges(nodeEdgeData.edges, 32, 'quadratic-custom', 'fund-polyline', undefined);


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
        show: false,
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
        //log(`i = ${i}`);
        timeBarData.push({
          date: i,
          value: Math.round(Math.random() * 200),
        });
        //log(`${i}seconds, timeString=${timeString}`)
      }


      const nodeSize = 24;
      //log(G6.TimeBar);
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
           // log(`d => ${JSON.stringify(d, null, 3)}`);
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
            // Add the marker
            const marker = group.addShape('marker', {
              attrs: {
                ...style,
                opacity: 1,
                x: 0,
                y: style.r,
                r: 15,
                //symbol: collapseIcon,
                fill: '#FDFD96',
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
                  x: style.r - 1,
                  y: style.r,
                  fontFamily: 'Arial',
                  fontSize: 19,
                  fill: 'black',
                  stroke: 'grey',
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
              y: (style.r - 10) * - 1,
              // The property 'collapsed' in the combo data represents the collapsing state of the Combo
              // Update the symbol according to 'collapsed'
              symbol: cfg.collapsed ? expandIcon : collapseIcon,
            });
            //Update the textlabel
            textLabel.attr({
              text: cfg.label,
              x: style.r * 0.50 - 5, 
              y: (style.r - 20) * - 1,
            });
          },
        },
        'circle',
      );

      /* ******* CUSTOM EDGES ******* */

      G6.registerEdge('fund-polyline', {
        itemType: 'edge',
        draw: function draw(cfg, group) {

          const startPoint = cfg.startPoint;
          const endPoint = cfg.endPoint;          
          const stroke = cfg.style.stroke;
          //const stroke = (cfg.style && cfg.style.stroke) || this.options.style.stroke;

          let path = [
            ['M', startPoint.x, startPoint.y],
            ['L', endPoint.x, endPoint.y],
          ];
      
          const endArrow = cfg?.style && cfg.style.endArrow ? cfg.style.endArrow : false;
          if (isObject(endArrow)) endArrow.fill = stroke;
          
          const line = group.addShape('path', {
            attrs: {
              stroke,
              path,
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
          const freqMarkerOffset = 15;
          let ttpMarkerOffset = 0;


          if(cfg.ttp === true) {

            // distance in pixels that edge frequency marker and message label needs to move to the right
            ttpMarkerOffset = 23;

            // TTP: Add the circular marker on the bottom
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
              name: 'edge-ttp-shape',
            });   

            // TTP -text
            group.addShape('text', {
              attrs: {
                text: 'T',
                x: startPoint.x + midPointXY.x + markerXOffset - 4.85,
                y: startPoint.y + midPointXY.y + markerYOffset,
                fontFamily: 'Arial',
                fontWeight: "bold",
                fontSize: 14.5,
                textAlign: 'left',
                textBaseline: 'middle',
                fill: 'white',
              },
              // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
              name: 'edge-ttp-text',
            });

            const ttpLabel = group.find((ele) => ele.get('name') === 'edge-ttp-text')
          ttpLabel.toFront();
          }
         
          if(cfg.frequency !== undefined){
            // FREQUENCY Add the circular marker on the bottom
            group.addShape('marker', {
              attrs: {
                ...style,
                opacity: 1,
                x: startPoint.x + midPointXY.x + markerXOffset + ttpMarkerOffset,
                y: startPoint.y + midPointXY.y + markerYOffset - 1.5,
                r: 10,
                symbol: collapseIcon,
                fill: '#63666A',
                stroke: 'black',
                strokeWidth: 3.5,
                lineWidth: 1.5,
              },
              draggable: true,
              // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
              name: 'edge-frequency-shape',
            });   

            // freqency -text 
            group.addShape('text', {
              attrs: {
                text: cfg && cfg.frequency,
                x: startPoint.x + midPointXY.x + markerXOffset + ttpMarkerOffset - 3.5,
                y: startPoint.y + midPointXY.y + markerYOffset,
                fontSize: 14,
                textAlign: 'left',
                textBaseline: 'middle',
                fill: 'white',
              },
              // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
              name: 'edge-frequency-text',
            });
            const frequencyLabel = group.find((ele) => ele.get('name') === 'edge-frequency-text')
            frequencyLabel.toFront();
          }


          // event
          group.addShape('text', {
            attrs: {
              text: cfg && cfg.event,
              x: startPoint.x + midPointXY.x + markerXOffset + freqMarkerOffset + ttpMarkerOffset,
              y: startPoint.y + midPointXY.y + markerYOffset,
              fontSize: 12,
              fontWeight: 300,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#000000D9',
            },
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: 'edge-event-text',
          });
               
          return line;
        },
      });

      G6.registerEdge(
        'quadratic-custom',
        {
          afterDraw(cfg, group) {
            const startPoint = cfg.startPoint;
            const endPoint = cfg.endPoint;  

            // get the first shape in the graphics group of this edge, it is the path of the edge here
            const shape = group.get('children')[0];
            // get the coordinate of the mid point on the path
            const midPointXY = shape.getPoint(0.5);
            /* const midPointXY = {       
              x: (endPoint.x - startPoint.x) / 2,
              y: (endPoint.y - startPoint.y) / 2
            } */
            
            const markerXOffset = 0;
            const markerYOffset = 0;
            const labelXOffset = 15;
            let ttpMarkerOffset = 0;


          if(cfg.ttp === true) {

            // distance in pixels that edge frequency marker and message label needs to move to the right
            ttpMarkerOffset = 18;

            // TTP: Add the circular marker on the bottom
            group.addShape('marker', {
              attrs: {
                ...style,
                opacity: 1,
                x: midPointXY.x + markerXOffset,
                y: midPointXY.y + markerYOffset - 1.5,
                r: 10,
                symbol: collapseIcon,
                fill: 'orange',
                stroke: 'black',
                strokeWidth: 3.5,
                lineWidth: 1.5,
              },
              draggable: true,
              // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
              name: 'quadcurve-ttp-shape',
            });   

            // TTP -text
            group.addShape('text', {
              attrs: {
                text: 'T',
                x: midPointXY.x + markerXOffset - 4.85,
                y: midPointXY.y + markerYOffset,
                fontFamily: 'Arial',
                fontWeight: "bold",
                fontSize: 14.5,
                textAlign: 'left',
                textBaseline: 'middle',
                fill: 'white',
              },
              // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
              name: 'quadcurve-ttp-text',
            });

            const ttpLabel = group.find((ele) => ele.get('name') === 'quadcurve-ttp-text')
          ttpLabel.toFront();
          }
         
          if(cfg.frequency !== undefined){
            // FREQUENCY Add the circular marker on the bottom
            group.addShape('marker', {
              attrs: {
                ...style,
                opacity: 1,
                x: midPointXY.x + markerXOffset + ttpMarkerOffset,
                y: midPointXY.y + markerYOffset - 1.5,
                r: 10,
                symbol: collapseIcon,
                fill: '#63666A',
                stroke: 'black',
                strokeWidth: 3.5,
                lineWidth: 1.5,
              },
              draggable: true,
              // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
              name: 'quadcurve-frequency-shape',
            });   

            // freqency -text 
            group.addShape('text', {
              attrs: {
                text: cfg && cfg.frequency,
                x: midPointXY.x + markerXOffset + ttpMarkerOffset - 3.5,
                y: midPointXY.y + markerYOffset,
                fontSize: 14,
                textAlign: 'left',
                textBaseline: 'middle',
                fill: 'white',
              },
              // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
              name: 'quadcurve-frequency-text',
            });
            const frequencyLabel = group.find((ele) => ele.get('name') === 'quadcurve-frequency-text')
            frequencyLabel.toFront();
          }


          // event
          group.addShape('text', {
            attrs: {
              text: cfg && cfg.event,
              x: midPointXY.x + markerXOffset + labelXOffset + ttpMarkerOffset,
              y: midPointXY.y + markerYOffset,
              fontSize: 12,
              fontWeight: 300,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#000000D9',
            },
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: 'quadcurve-event-text',
          });
          },
          update: undefined,
        },
        'quadratic'
      );




      /* *************************************************** */
      
      //log(G6.Graph);
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
          nodeSpacing: 5, 
          linkDistance: d => {
            if (d.source.id === 'node0') {
              return 200;
            }
            return 150;
          },
          nodeStrength: 0.5,
          edgeStrength: 0.1,
          collideStrength: 1,
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
          size: [130], // The minimum size of the Combo
          padding: 20,
          style: {
            position:'bottom',
            stroke: 'gray',
            fill: 'transparent',
            lineWidth: 1.5,
          },
          labelCfg: {
            style: {
              position: 'bottom',
              fill: 'transparent',
              fontFamily: 'Arial',
              fontSize: 11
            }
          },
        },
        comboStateStyles: {
          dragenter: {
            lineWidth: 4,
            stroke: '#FF5349',
          },
          dragleave: {
            lineWidth: 4,
            stroke: '#FF5349',
            lineDash: [6, 18]
          },
        },
        defaultEdge: {
          type: 'fund-polyline',
          style: {
            stroke: '#5f6266',
            lineWidth: 1.2,
            endArrow: {
              path: G6.Arrow.triangle(6.0, 6.0, 20), // (width, length, offset (wrt d))
              fill: '#5f6466',
              d: 20 // offset
            },
            // startArrow style used for dual edges 
            startArrow: {
              path: G6.Arrow.triangle(0, 0, 20), // (width, length, offset (wrt d))
              fill: 'transparent',
              d: 30 // offset
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
            {
              type: 'collapse-expand-combo',
              trigger: 'click',
              relayout: false, // do not relayout after collapsing or expanding
            },
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
      // load graph data
      newGraph.data(nodeEdgeData);

      newGraph.render();


      /* *************** MOUSE EVENTS ************** */
      newGraph.on('node:mouseenter', (e) => {
        //log('node:mouseenter e =', e);
        newGraph.setItemState(e.item, 'hover', true)
        nodeA = e.item._cfg.id;
      })


      
      newGraph.on('node:mouseleave', (e) => {
        newGraph.setItemState(e.item, 'hover', false)
      })

      newGraph.on('node:mouseup', (e) => {
        comboDragLeave = false;
        newGraph.setItemState(e.item, 'hover', false)
      })

      newGraph.on('node:drag', (e) => {
        // we need this check when dragging nodes in or out of combo 
        // to differentiate when combo is moved (dragged)
        nodeDrag = true; 
      })

      newGraph.on('node:dragend', (e) => {
        // nodeDrag status variable needs to be reset
        nodeDrag = false;
      });

      // check that the node that is being dragged, does not have a  comboId,  
      newGraph.on('node:dragenter', (e) => {
        //log('node:dragenter');
        const nodeBModel = e.item._cfg.model;
        nodeB = e.item._cfg.id;
        let nodeAModel = {};
        newGraph.getNodes().forEach((node) => {
          if(node._cfg.id === nodeA){
            nodeAModel = node._cfg.model
            //log(`nodeAModel ID = ${nodeAModel.id}`);
          }
        });
        //log(nodeAModel);
        //log(nodeBModel);

        if ((('comboId' in nodeBModel !== true) || nodeBModel.comboId === undefined) && 
        (('comboId' in nodeAModel !== true) || nodeAModel.comboId === undefined)) { // if it has a comboId, do not create combo
          if(nodeA !== "" && nodeB !== nodeA ){ 
            //log(`CREATING NEW COMBO (selected item = ${e.item._cfg.id})`);
            //log(`nodeA = ${nodeA}`);
            //log(`nodeB = ${nodeB}`);
            const comboCount = newGraph.getCombos().length;
            const last = (comboCount === 0 ? '0' : newGraph.getCombos()[comboCount - 1].getID().substring(5) );
            const newComboId = `combo${parseInt(last) + 1}`
            newGraph.createCombo({
              id: newComboId,   
              label: ""
            }, [`${nodeA}`, `${nodeB}`]);
          }
        }
      });



      newGraph.on('edge:mouseenter', (e) => {
        newGraph.setItemState(e.item, 'hover', true)
      });
  
      newGraph.on('edge:mouseleave', (e) => {
        newGraph.setItemState(e.item, 'hover', false)
      });

      newGraph.on("node:mouseup", (e) => {
        if (e.item.getModel().comboId != undefined) {
          const comboIdOfNode = e.item.getModel().comboId;
          newGraph.setItemState(e.item, "dragenter", true);
          const currentNodeCount = countNodesInCombo(comboIdOfNode);
          if (e.item._cfg.model.label === "") {
            e.item._cfg.model.label = currentNodeCount;
          } else {
            if (nodeDrag === true) {
              const combo = newGraph.findById(comboIdOfNode);
              combo.getModel().label = currentNodeCount;
              newGraph.updateCombo(combo);
              } 
          }
        }
        const updatedCombos = newGraph.getCombos();
          updatedCombos.forEach((combo) => {
            newGraph.setItemState(combo, 'dragleave', false);
            newGraph.setItemState(combo, 'dragenter', false);
          })
      });
      
      newGraph.on(`combo:drag`,(e) => {
        // prevents dotted red border from showing when dragging combo
        newGraph.setItemState(e.item, 'dragleave', false);
      });

      newGraph.on('combo:dragover', (e) => {
        newGraph.setItemState(e.item, 'dragenter', true);
        //log(`combo:dragover`);
      });


      newGraph.on('combo:dragleave', (e) => {
        comboDragLeave = true;
        //log(`combo:dragleave`);
        const comboId = e.item._cfg.id;
        newGraph.setItemState(e.item, 'dragleave', true);
        const oldNodesCount = countNodesInCombo(comboId);
        //log(`combo:dragleave, # of  NODES #$#= ${oldNodesCount}`);
      
        //log(`SUBTRACTING COUNT`);
        if(nodeDrag === true){
          e.item._cfg.model.label = oldNodesCount - 1;
          if(e.item._cfg.model.label === 0){
            newGraph.uncombo(comboId);
          }
        }
      });

      newGraph.on('combo:mouseup', (e) =>{
        newGraph.setItemState(e.item, 'dragleave', false);
        newGraph.setItemState(e.item, 'dragenter', false);
      });

      newGraph.on("combo:contextmenu", (e) => {
        const comboId = e.item._cfg.id;
        newGraph.uncombo(comboId);
        });
      
      newGraph.on("combo:click", (e) => {
      // 1. grab combo
      // 2. from combo check collapsed state
      // 3. if state = collapsed
      // 4. get all the children (nodes & combos) inside the combo
      // 5. grab all the standard edges, if source or target of the edges are these children, 
      // 6. grab all the virtual edges from inside this combo, if source or target that is not equals to this comboId 
      //    is found inside the standard edges array, add frequency and event details from standard edge model into this virtual edge model

      const comboId = e.item.getID();
      const comboModel = e.item.getModel()
      const childrenIds = [];
      const edgesThruCombo = []
      
      const allNodeEdges = newGraph.getEdges();

      // all actions to take when combo is collapsed. 
      if(comboModel?.collapsed === true){
        comboModel.children.forEach((child) => {
          childrenIds.push(child.id)
        });
        // populate edgesThruCombo Array
        allNodeEdges.forEach((edge) => {
          const edgeModel = edge.getModel();
          childrenIds.forEach((childId) => {
            if(childId === edgeModel.source || childId === edgeModel.target){
              const edgeOfChild = {
                id: edgeModel.id,
                ttp: edgeModel.ttp,
                source: edgeModel.source, 
                target:edgeModel.target
              }
              edgesThruCombo.push(edgeOfChild)
            }
          })
          //log(`edgesThruCombo = ${edgesThruCombo}`)
        })

        const combo = newGraph.findById(comboId);
        //log(combo.get('edges'));
        const comboVEdges = combo.get('edges');

        //log(comboVEdges[0].getModel());
        comboVEdges.forEach((vedge) => {
          const vedgeModel = vedge.getModel();
          //grab Id of OutsideItem
          const IdOfOutsideItem = vedgeModel.source === comboId ? vedgeModel.target : vedgeModel.source
          //log(`IdOfOutsideItem = ${IdOfOutsideItem}`)
          edgesThruCombo.forEach((edgeOfChild) => {
            //log(`edgeOfChild.source = ${edgeOfChild.source} | edgeOfChild.target = ${edgeOfChild.target}`)
            if(edgeOfChild.source === IdOfOutsideItem || edgeOfChild.target === IdOfOutsideItem){
              //log(`vedgeModel.id = ${vedgeModel.id}`);
              const editedVEdge = newGraph.findById(vedgeModel.id);
              // TTP
              editedVEdge._cfg.model['ttp'] = edgeOfChild.ttp;
            }
            
          });
         })
        }
      });

      const countNodesInCombo = (comboId) => {
        let comboDetails = {};
        if(comboId !== undefined){
          const combos = newGraph.getCombos();
          combos.forEach((combo) => {
            if(combo._cfg.id === comboId){
              comboDetails = combo;
            }
          });
         return comboDetails._cfg.nodes.length;
        } 
        log(`ERROR: comboId is undefined when counting nodes in combo`)
      }

      // DO NOT DELETE - LESLIE's EXPERIMENTATION
      newGraph.on("node:dblclick", function (event) {
        const nodes = newGraph.getNodes();
        log(nodes);
        const edges = newGraph.getEdges();
        log(edges);
        const combos = newGraph.getCombos();
        log(combos);
        });

      // for Diagnosis
      newGraph.on('edge:dblclick', (e) => {
        log(`edge, event =${e}`)
        const edges = newGraph.getEdges();
        log(edges);
      });



      
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
      //log(newGraph);
    }, [])
  
    return <div ref={ref}></div>
  }
  
  export default TimeBarTrend
  


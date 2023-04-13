import React, { useState, useEffect } from "react";
import { data as jsonData } from './source';
import { cCircleComboShape, fundPolyline, customQuadratic} from "./parts/elements";
import { getUTCHrMinSec } from "./utilities/convertUTC";
import { populateNodesEdges } from "./parts/graphDataConfig";
//import { flatten } from "./utilities/flatten";

let log = console.log; 
let nodeA = "";
let nodeB = "";
let nodeDrag = false;
let allNodesCount = [];


const TimeBarTrend = () => {
    const ref = React.useRef(null)
    const [newGraph, setGraph] = useState(null);
    const [timeBar, setTimeBar] = useState(null);

    useEffect(() => {
      const G6 = require('@antv/g6');
      //const G6 = require('graphG6/packages/g6/src/index');
      
      //transform rawQuery jsonData into nodeEdgeData
      const nodeEdgeData = populateNodesEdges(jsonData);
      G6.Util.processParallelEdges(nodeEdgeData.edges, 32, 'quadratic-custom', 'fund-polyline', undefined);

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
        let maxsize = -9999999; //<---- need to follow up, usage unknown
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
      
      G6.registerCombo(
        'cCircle',
        cCircleComboShape,
        'circle', // built-in combo to extend from
      );

      /* ******* CUSTOM EDGES ******* */

      G6.registerEdge('fund-polyline', fundPolyline );

      G6.registerEdge(
        'quadratic-custom',
        customQuadratic,
        'quadratic' // built-in edge to extend from
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
          if (node._cfg.id === nodeA) {
            nodeAModel = node._cfg.model
          }
        });

        if ((('comboId' in nodeBModel !== true) || nodeBModel.comboId === undefined) && 
        (('comboId' in nodeAModel !== true) || nodeAModel.comboId === undefined)) { // if it has a comboId, do not create combo
          if (nodeA !== "" && nodeB !== nodeA ) { 
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
          const currentNodeCount = countChildrenInCombo(comboIdOfNode);
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
      });

      newGraph.on('combo:dragend', (e) => {
        newGraph.getCombos().forEach((combo) =>{
          newGraph.setItemState(combo, 'dragenter', false);
        });
      });

      /* newGraph.on('combo:drop', (e) => {
        newGraph.setItemState(e.item, 'dragenter', false);
      }); */

      newGraph.on('combo:dragleave', (e) => {
        const comboId = e.item._cfg.id;
        newGraph.setItemState(e.item, 'dragleave', true);
        const oldNodesCount = countChildrenInCombo(comboId);
      
        //log(`SUBTRACTING COUNT`);
        if (nodeDrag === true) {
          e.item._cfg.model.label = oldNodesCount - 1;
          if (e.item._cfg.model.label === 0) {
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

      const comboId = e.item.getID();
      const comboModel = e.item.getModel()

      const edgesThruCombo = [] 
      const allNodeEdges = newGraph.getEdges();
      const neighborIds = [];
      const combo = newGraph.findById(comboId);
      log('>>>>> SELECTED COMBO:',comboId);
      log('neighbors(): ', combo.getNeighbors());
      log('children(): ', combo.getChildren());
      log('comboModelChildren = ',comboModel.children);
      //const comboChildren = Array.from(comboModel.children);

      
      log('flattened children', getAllNodesInCombo(combo));//<======
      allNodesCount = [];

      const comboNeighbors = combo.getNeighbors();
      comboNeighbors.forEach((neighbor, i) => {
          neighborIds.push(neighbor.getID());
      });
      
      
      // all actions to take when combo is collapsed. 
      if (comboModel.collapsed === true) {

        // populate edgesThruCombo Array
        allNodeEdges.forEach((edge, i) => {
          const edgeModel = edge.getModel();
          log(`allNodeEdges[${i}]: `, edgeModel);
          const childNodes = combo.getNodes();
  
            childNodes.forEach((childNode, i) => {
              const childNodeModel = childNode.getModel();
              if (childNodeModel.id === edgeModel.source || childNodeModel.id === edgeModel.target) {
                log(`childNodeEdge ${i + 1}: `, edgeModel );
                edgesThruCombo.push(edgeModel)
              }
          });
        });

        log('edgesThruCombo =', edgesThruCombo);
        const comboVEdges = combo.getEdges(); 
        log('neighborIds =', neighborIds)

        for (let i = 0; i < neighborIds.length; i++) {

          let ttpCheck = false;
          let matchedNeighborId;
          if (neighborIds[i].includes('node')) {
            for (let t = 0; t < edgesThruCombo.length; t++)
            {
              // each edgeThruCombo.source or .target will never be a comboId!
              log(`Loop ${t}: edgesThruCombo[t]`, edgesThruCombo[t] );
              log(neighborIds[i]);
              if (edgesThruCombo[t].source === neighborIds[i] || edgesThruCombo[t].target === neighborIds[i])
              {
                if (edgesThruCombo[t].ttp)
                {
                  ttpCheck = true;
                  matchedNeighborId = neighborIds[i]
                  break;
                }
              }
            };
          } else if (neighborIds[i].includes('combo')) {
              const neighborComboChildren = newGraph.findById(neighborIds[i]).getChildren();
              log(`${neighborIds[i]}'s children:`, neighborComboChildren);
              const nodesOfNeighbors = neighborComboChildren.nodes;
              for (let j = 0; j < nodesOfNeighbors.length; j++) 
              {
                const comboChildId = nodesOfNeighbors[j].getID();
                log('comboChildId =', comboChildId);
                for (let k = 0 ; k < edgesThruCombo.length; k++)
                {
                  if ((edgesThruCombo[k].source === comboChildId || edgesThruCombo[k].target === comboChildId)) {
                    if (edgesThruCombo[k].ttp) {
                      ttpCheck = true;
                      matchedNeighborId = newGraph.findById(comboChildId).getModel().comboId;
                      break;
                    }
                  }
                }
              }
          }
          if (ttpCheck) {
            log('comboVEdges =', comboVEdges);
            let vedgeId;
            for (let m = 0; m < comboVEdges.length; m++) {
              log(comboVEdges[m].getID(), comboVEdges[m].getSource().getID(), comboVEdges[m].getTarget().getID())
              log(matchedNeighborId)
              if (comboVEdges[m].getSource().getID() === matchedNeighborId || comboVEdges[m].getTarget().getID() === matchedNeighborId) {
                vedgeId = comboVEdges[m].getID();
              }
            }
            log('vedgeId:', vedgeId )
            newGraph.findById(vedgeId).getModel()['ttp'] = true;
          }
         };

         comboVEdges.forEach((vedge) => {
          log(`updated VE:`, vedge.getModel());
         });
        }
        log('=======END OF CLICK=======')
      });

      const countChildrenInCombo = (comboId) => {
        if (comboId !== undefined) {
          const combo = newGraph.findById(comboId);
          const nodesInCombo = combo.getChildren().nodes;
          const combosInCombo = combo.getChildren().combos;
          log('nodesInCombo =', nodesInCombo);
          log('combosInCombo =', combosInCombo);
         return nodesInCombo.length + combosInCombo.length;
        } 
        log(`ERROR: comboId is undefined when counting nodes in combo`)
      }

      const getAllNodesInCombo = (combo) => {
        let combos = combo.getCombos(); 
        let childNodes = combo.getNodes(); 
        
        combos.forEach((inCombo) => { allNodesCount.concat(getAllNodesInCombo(inCombo)); });
        childNodes.forEach((node) => { allNodesCount.push(node); });
        return allNodesCount;
      }

      // DO NOT DELETE - LESLIE's EXPERIMENTATION
      newGraph.on("canvas:click", function (event) {
        const nodes = newGraph.getNodes();
        log(nodes);
        const edges = newGraph.getEdges();
        log(edges);
        const combos = newGraph.getCombos();
        log(combos);
        });
      newGraph.on("canvas:dblclick", function (event) {
          /* const vedges = newGraph.get("vedges");
          log('vedges =\n', vedges)   
          const edges = newGraph.getEdges();
          log('edges = \n', edges);
          }); */          
      });
  
      // for Diagnosis
      newGraph.on('edge:dblclick', (e) => {
        log(`edge, event =${e}`)
        const edges = newGraph.getEdges();
        log(edges);
      });



      // RESIZING
      if (typeof window !== 'undefined')
        window.onresize = () => {
          if (!newGraph || newGraph.get('destroyed')) return;
          if (!container || !container.scrollWidth || !container.scrollHeight) return;
          newGraph.changeSize(container.scrollWidth, container.scrollHeight - 100);
        };
      
      setGraph(newGraph);
      setTimeBar(newTimebar);
      //log(newGraph);
    }, [])
  
    return <div ref={ref}></div>
  }
  
  export default TimeBarTrend
  


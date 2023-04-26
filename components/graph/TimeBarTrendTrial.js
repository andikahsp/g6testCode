import React, { useState, useEffect } from "react";
import { data as jsonData } from './source';
import { cCircleComboShape, fundPolyline, customQuadratic} from "./parts/elements";
import { getUTCHrMinSec } from "./utilities/convertUTC";
import { populateNodesEdges } from "./parts/graphDataConfig";

let log = console.log; 
let nodeA = "";
let nodeB = "";
let nodeDrag = false;
let allNodesInCombo = [];
let parentOfDragComboId; 
let dragOverComboId; 
let dragleaveComboId;



const TimeBarTrendTrial
 = () => {
    const ref = React.useRef(null)
    const [newGraph, setGraph] = useState(null);
    const [timeBar, setTimeBar] = useState(null);

    useEffect(() => {
      const G6 = require('@antv/g6');

      //const G6 = require('../../G6-master/packages/pc/src/index')

      
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
      const constrainBox = { x: 60, y: 100, width: 800, height: 500 };
      
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
        height: height + 50,
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
          //size: [130], // The minimum size of the Combo
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
              path: G6.Arrow.triangle(6.0, 6.0, 5), // (width, length, offset (wrt d))
              fill: '#5f6466',
              d: 5 // offset
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
        edgeStateStyles: { // <========== doesnt work anymore with custom edges
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

      window.addEventListener("contextmenu", e => e.preventDefault());

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
            log(newGraph.getCombos());
            const last = (comboCount === 0 ? '0' : newGraph.getCombos()[comboCount - 1].getID().substring(5) );
            log('last =', last);
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
        log('EDGE =', e.item.getModel());
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
        parentOfDragComboId = e.item.getModel().parentId;
        // prevents dotted red border from showing when dragging combo
        newGraph.setItemState(e.item, 'dragleave', false);
      });

      
      newGraph.on('combo:dragover', (e) => {
        log('dragOver combo =',e.item.getID());
        dragOverComboId = e.item.getID();
        newGraph.setItemState(e.item, 'dragenter', true);
      });

      newGraph.on('combo:dragend', (e) => {
        newGraph.getCombos().forEach((combo) =>{
          newGraph.setItemState(combo, 'dragenter', false);
        });
      });

      newGraph.on('combo:drop', (e) => {
        newGraph.setItemState(e.item, 'dragenter', false);
      });


      newGraph.on('combo:dragleave', (e) => {

        dragleaveComboId = e.item.getID();
        log('dragleave comboId =', dragleaveComboId)
        newGraph.setItemState(e.item, 'dragleave', true);
        const oldNodesCount = countChildrenInCombo(dragleaveComboId);
      
        //log(`SUBTRACTING COUNT`);
        if (nodeDrag === true) {
          e.item._cfg.model.label = oldNodesCount - 1;
          if (e.item._cfg.model.label === 0 || countChildrenInCombo(dragleaveComboId) === 0) {
            newGraph.uncombo(dragleaveComboId);
          }
        }
      });

      newGraph.on('combo:mouseup', (e) =>{
        newGraph.getCombos().forEach((combo) => {
          newGraph.setItemState(combo, 'dragleave', false);
          newGraph.setItemState(combo, 'dragenter', false);

          // log('parentOfDragComboId =', parentOfDragComboId);
          // log('dragleaveComboId =', dragleaveComboId);
          // log('dragOverComboId =', dragOverComboId);
          const dragOverCombo = newGraph.findById(dragOverComboId);
          
          if (dragOverComboId !== undefined) {
            if( (parentOfDragComboId === dragleaveComboId) && 
                (dragleaveComboId === dragOverComboId)) {
                dragOverCombo.getModel().label = countChildrenInCombo(dragOverComboId) - 1;    
            } else {
                dragOverCombo.getModel().label = countChildrenInCombo(dragOverComboId);
            }
            if (dragOverCombo.getModel().label === 0) {
                newGraph.uncombo(dragOverComboId);
                dragOverComboId = undefined;
            } else {
              newGraph.updateCombo(dragOverCombo);
            }
          }
        });
      });

      newGraph.on("combo:contextmenu", (e) => {
        const comboId = e.item.getID();
        /* newGraph.expandCombo(comboId); */
        newGraph.uncombo(comboId);
        });
      
      newGraph.on("combo:click", (e) => {

      const combo = e.item;
      log('>>>>> SELECTED COMBO:',combo.getID());
      const comboModel = e.item.getModel()
      log('combo=', combo);
      
      const selfNodes = getAllNodesInCombo(combo);/* Array.from(allNodesInCombo); */
      allNodesInCombo = []; // clear getAllNodesInCombo []
      log('selfNodes =', selfNodes);
 
      // all actions to take when combo is collapsed. 
      if (comboModel.collapsed === true) {
        const neighbors = combo.getNeighbors();

        let ttpCheck = false;
        for (let i = 0; i < neighbors.length; i ++) {
          if (neighbors[i].getType() === "node"){
            const edgesOfNeighbor = neighbors[i].getEdges();
            
            for (let j = 0; j < edgesOfNeighbor.length; j++) {
              for (let k = 0; k < selfNodes.length; k++) {
                if (edgesOfNeighbor[j].getSource() === selfNodes[k] ||
                    edgesOfNeighbor[j].getTarget() === selfNodes[k]
                  ) {
                      if (edgesOfNeighbor[j].getModel().ttp) {
                        ttpCheck = true; 
                        log('neighborNodes ttpCheck =', ttpCheck);
                      }  
                  }
              }
            }
          } else if (neighbors[i].getType() === "combo") {
              allNodesInCombo = []

              const neighborNodes = getAllNodesInCombo(neighbors[i]);/* Array.from(allNodesInCombo) */;
              allNodesInCombo = []; // clear getAllNodesInCombo []
              log('neighborNodes =', neighborNodes);

              for (let j = 0; j < selfNodes.length; j++) {
                const selfNodeNeighbors = selfNodes[j].getNeighbors();
                for (let k = 0; k < selfNodeNeighbors.length; k++) {

                  if (neighborNodes.includes(selfNodeNeighbors[k])) {
                    const edges = selfNodeNeighbors[k].getEdges();
                    edges.forEach((edge) => {
                      log(edge.getModel());
                    });
                    for(let m = 0; m < edges.length; m ++) {
                      if (neighborNodes.includes(edges[m].getSource()) || neighborNodes.includes(edges[m].getTarget())) {
                        if(edges[m].getModel().ttp){
                          ttpCheck = true
                          log('selfNodeNeighbors[k] comboId:', selfNodeNeighbors[k].getModel().comboId )
                          log('selfNodes[j] comboId:',selfNodes[j].getModel().comboId);
                        }
                      }
                    }                   
                  }
                }
              }
          } else {
            throw 'ERROR: neighbor is not a node or a combo'
          }

          if (ttpCheck) {
            let vedgeId;
            const VEdges = e.item.getEdges();
            for (let r = 0; r < VEdges.length; r++) {
              if (VEdges[r].getSource() === neighbors[i] || 
                  VEdges[r].getTarget() === neighbors[i]) { 
                    vedgeId = VEdges[r].getID();
                  }
            }
            newGraph.findById(vedgeId).getModel()['ttp'] = ttpCheck;
            log('correct VEdge selected = ', newGraph.findById(vedgeId).getModel());
          }
        }
       } 
         else {
          comboExpandTTP(e.item);
       } 
    });
    
    
      function comboExpandTTP(combo) {
        const combos = combo.getCombos();
        const nodes = combo.getNodes();
        if (nodes.length > 0) {
          for (let i = 0; i < nodes.length; i++) {
            const neighbours = nodes[i].getNeighbors();
            let ttp = false;
            neighbours.forEach((neighbour) => {
              if (neighbour.getType() === "combo") {
                ttp = checkTTP(nodes[i], neighbour);
                if (ttp) {
                  const edges = nodes[i].getEdges();
                  edges.forEach((edge) => {
                    if (edge.getModel().isVEdge) {
                      if (
                        edge.getTarget() == neighbour ||
                        edge.getSource() == neighbour
                      ) {
                        edge.getModel()["ttp"] = ttp;
                        return;
                      }
                    }
                  });
                  return;
                }
              }
            });
          }
        }
        if (combos.length > 0) {
          combos.forEach((inCombo) => {
            if (inCombo.getModel().collapsed) {
              const neighbours = inCombo.getNeighbors();
              for (let i = 0; i < neighbours.length; i++) {
                if (
                  neighbours[i].getType() === "node" &&
                  !nodes.includes(neighbours[i])
                ) {
                  let ttp = false;
                  const allCNodes = getAllNodesInCombo(inCombo);
                  for (let j = 0; j < allCNodes.length; j++) {
                    if (allCNodes[j].getNeighbors() === neighbours[i]) {
                      const CNodeEdges = allCNodes[j].getEdges();
                      for (let k = 0; k < CNodeEdges.length(); k++) {
                        if (
                          CNodeEdges.getSource() === neighbours[i] ||
                          CNodeEdges.getTarget() === neighbours[i]
                        ) {
                          ttp = CNodeEdges.getModel().ttp;
                          if (ttp) break;
                        }
                      }
                    }
                    if (ttp) break;
                  }
                  if (ttp) {
                    const comboVedges = inCombo.getEdges();
                    for (let j = 0; j < comboVedges.length; j++) {
                      if (
                        comboVedges[j].getSource() === neighbours[i] ||
                        comboVedges[j].getTarget() === neighbours[i]
                      ) {
                        comboVedges[j].getModel()["ttp"] = true;
                        break;
                      }
                    }
                  }
                } else if (
                  neighbours[i].getType() === "combo" &&
                  !combos.includes(neighbours[i])
                ) {
                  let ttp = false;
                  const nodesInNeighbour = getAllNodesInCombo(neighbours[i]);
                  allNodesCount = [];
                  const nodesInCombo = getAllNodesInCombo(inCombo);
                  allNodesCount = [];
                  for (let j = 0; j < nodesInCombo.length; j++) {
                    if (
                      nodesInCombo[j]
                        .getNeighbors()
                        .some((r) => nodesInNeighbour.includes(r))
                    ) {
                      const cNodeEdges = nodesInCombo[j].getEdges();
                      for (let k = 0; k < cNodeEdges.length; k++) {
                        if (
                          nodesInNeighbour.includes(cNodeEdges[k].getSource()) ||
                          nodesInNeighbour.includes(cNodeEdges[k].getTarget())
                        ) {
                          if (cNodeEdges[k].getModel().ttp) ttp = true;
                        }
                      }
                    }
                  }
                  if (ttp) {
                    const comboVedges = inCombo.getEdges();
                    for (let j = 0; j < comboVedges.length; j++) {
                      if (
                        comboVedges[j].getSource() === neighbours[i] ||
                        comboVedges[j].getTarget() === neighbours[i]
                      ) {
                        comboVedges[j].getModel()["ttp"] = true;
                        break;
                      }
                    }
                  }
                }
              }
            } else {
              comboExpandTTP(inCombo);
            }
          });
        }
      }


      function checkTTP(node, combo) {
        const nEdges = node.getEdges();
        let x = false;
        let combosInCombo = combo.getCombos();
        if (combosInCombo.length > 0) {
          for (let i = 0; i < combosInCombo.length; i++) {
            x = checkTTP(node, combosInCombo[i]);
            if (x) break;
          }
        }
        if (x) return x; 
        let cNodes = combo.getNodes();
        for (let i = 0; i < nEdges.length; i++) {
          if (
            cNodes.includes(nEdges[i].getSource()) ||
            cNodes.includes(nEdges[i].getTarget())
          ) {
            if (nEdges[i].getModel().ttp) {
              x = true;
              break;
            }
          }
        }
        return x;
      }


      const countChildrenInCombo = (comboId) => {
        if (comboId !== undefined) {
          const combo = newGraph.findById(comboId);
          log('# nodesInCombo =', combo.getNodes().length );
          log('# combosInCombo =', combo.getCombos().length);
         return combo.getNodes().length + combo.getCombos().length;
        } 
        log(`ERROR: comboId is undefined when counting nodes in combo`)
      }

      const getAllNodesInCombo = (combo) => {
        let combos = combo.getCombos(); 
        let childNodes = combo.getNodes(); 
        
        combos.forEach((inCombo) => { allNodesInCombo.concat(getAllNodesInCombo(inCombo)); });
        childNodes.forEach((node) => { allNodesInCombo.push(node); });
        return allNodesInCombo;
      }

      // DO NOT DELETE - LESLIE's EXPERIMENTATION
      newGraph.on("canvas:click", function (event) {
        const nodes = newGraph.getNodes();
        log('NODES:', nodes);
        const edges = newGraph.getEdges();
        log('EDGES:', edges);
        const combos = newGraph.getCombos();
        log('COMBOS:', combos);
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
    }, [])
  
    return <div ref={ref}></div>
  }
  
  export default TimeBarTrendTrial

  


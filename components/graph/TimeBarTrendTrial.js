import React, { useState, useEffect } from "react";
import { data as jsonData } from './source2760';
import { cCircleComboShape, fundPolyline, customQuadratic} from "./parts/elements";
import { getUTCHrMinSec } from "./utilities/convertUTC";
import { populateNodesEdges } from "./parts/graphDataConfig";

let log = console.log; 
let nodeA = "";
let nodeB = "";
let nodeDrag = false;
let comboDrop = false;
let dragCombo;
let dragleaveCombo;
let draggedOverCombos = [];
let comboDraggedOver; 

const TimeBarTrendTrial
 = () => {
    const ref = React.useRef(null)
    const [newGraph, setGraph] = useState(null);
    const [timeBar, setTimeBar] = useState(null);

    useEffect(() => {
      const G6 = require('@antv/g6');

      //transform rawQuery jsonData into nodeEdgeData
      const nodeEdgeData= populateNodesEdges(jsonData);
      G6.Util.processParallelEdges(nodeEdgeData.edges, 45, 'quadratic-custom', 'fund-polyline', undefined);

      const container = ref.current;
      const width = container.scrollWidth;
      const height = (container.scrollHeight || 700) - 100;
      const timeBarData = [];

      // const range = 18; // number of units that window will show

      const timeBarInfo = nodeEdgeData["info"][0]
      const range = timeBarInfo.firstDate - timeBarInfo.lastDate; // number of units that window will show
      const axisMin = timeBarInfo["firstDate"] - 500;
      const axisMax = /* timeBarInfo["firstDate"] + 18 + 5; */ timeBarInfo["lastDate"] + 500;
      // Scale: Seconds | Cyvestigo 18 seconds window for seconds scale
      // time = 6:59.08 am
      // window: 6:58.59am  - 6:59.17 am (60seconds)
      for (let i = axisMin; i < axisMax; i++) {
        //log(`i = ${i}`);
        const keyString = i.toString();
        if (keyString in timeBarInfo["dateFreq"]) {
          timeBarData.push({
            date: i,
            value: timeBarInfo["dateFreq"][keyString]
          });
        } else {
          timeBarData.push({
            date: i,
            value: 0
          });
        }
        //log(`${i}seconds, timeString=${timeString}`)
      }

      log("timeBarData = ", timeBarData);

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
           //return getUTCHrMinSec(d.date);
           return d
        },
          tickLabelStyle:{ 
            fontSize: 13, 
            fontFamily: 'Segoe UI',
            fillOpacity: 0.9,
            stroke: '#686868',
            strokeOpacity: 0.3,
          },
          tickLineStyle: {
            width: 30, //<<==== no effect, not working
            height: 15, //<===== no effect, not working 
            //offset: 250, //<===== no effect, not working
            stroke: '#686868',
            lineWidth: 2.5,  
            strokeOpacity: 0.6,
          }
      },
        trend: {
          height: 60,
          data: timeBarData,
          smooth: false,
          lineStyle: {
            stroke: 'transparent', // 'blue',
            lineWidth: 10,
          },
          isArea: true,
          areaStyle:{
            fill: 'orange', // 'pink'
          },
        },
        slider: { 
          backgroundStyle: { // ShapeStyle object format
            fill: 'transparent', 
          },
          foregroundStyle: { // ShapeStyle object format
            fill: 'lightgrey', //'cyan',
            fillOpacity: 0.25,
          }, 
          height: 60,
          start: 0.1,
          end: 0.9,
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
          fill: 'transparent',
          stroke: 'transparent',
          preBtnStyle: {
            fill: '#6C6C6C',
            stroke: '#6C6C6C'
          },
          nextBtnStyle: {
            fill: '#6C6C6C',
            stroke: '#6C6C6C'
          },
          playBtnStyle: {
            stroke: '#6C6C6C'
          },
          speedControllerStyle: {
            pointer: {
              fill: '#6C6C6C',
              fillOpacity:1,
              stroke: '#6C6C6C',
            },
            scroller: {
              fill: '#6C6C6C',
              fillOpacity:0,
              stroke: '#6C6C6C',
            },
            text: {
              fill: '#6C6C6C',
              fillOpacity:0,
              stroke: '#6C6C6C',
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
        height: height + 55,
        height: height + 55,
        linkCenter: false,
        plugins: [newTimebar],
        workerEnabled: true, 
        layout: {
          type: 'force',
          //center: [200, 200],
          center: [800, 340], 
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
              fontSize: 11,
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

        defaultEdge: {
          type: 'fund-polyline',
          style: {
            stroke: '#5f6266',
            lineWidth: 1.2,
            endArrow: {
              path: G6.Arrow.triangle(6.0, 6.0, 1), // (width, length, offset (wrt d))
              fill: '#5f6466',
              d: 1 // offset
            },
            // startArrow style used for dual edges 
            startArrow: {
              path: G6.Arrow.triangle(0, 0, 17), // (width, length, offset (wrt d))
              fill: 'transparent',
              d: 17 // offset
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
            stroke: 'orange',
            lineWidth: 4.5,
          }
        },
        edgeStateStyles: { // <========== doesnt work anymore with custom edges
          hover: {
            stroke: 'blue',
            lineWidth: 3
          }
        },
        comboStateStyles: {
          dragenter: {
            lineWidth: 6,
            stroke: '#00E100',
          },
          dragleave: {
            lineWidth: 4,
            stroke: '#FF5349',
            lineDash: [6, 18]
          },
          mouseenter: {
            lineWidth: 6,
            stroke: 'black',
          }
        },
      });
      // load graph data
      newGraph.data(nodeEdgeData);

      newGraph.render();


      /* *************** MOUSE EVENTS ************** */

      window.addEventListener("contextmenu", e => e.preventDefault());


      newGraph.on('node:mouseenter', (e) => {
        newGraph.setItemState(e.item, 'hover', true)
        //turn on node highlight
        newGraph.updateItem(e.item, {
          labelCfg:{
            style:{
              fontFamily: 'Arial',
              fontWeight: 'bold',
              fontSize: 13,
              fill:'white',
              background:{
                fill: 'gray',
                padding: [5, 6, 5, 6], // [top, right, bottom, left]
                stroke: 'black',
                radius: 8,
                lineWidth: 2.5,
              }
            }
          }
        });
        nodeA = e.item._cfg.id;
      })

      newGraph.on('node:mouseleave', (e) => {
        newGraph.setItemState(e.item, 'hover', false)
        // turn off node highlight
        newGraph.updateItem(e.item, {
          labelCfg:{
            style:{
              fontFamily: 'Arial',
              fontWeight: 'normal',
              fontSize: 11, 
              fill:'black',
              background:{
                fill: 'transparent',
                padding:  [0, 0, 0, 0], // [top, right, bottom, left]
                stroke: 'transparent',
                lineWidth: 0,
                radius: 0,
              }
            }
          }
        });
      })

      newGraph.on('node:mouseup', (e) => {
        if (comboDraggedOver !== undefined && e.item.getModel().comboId === undefined) {
          if(dragleaveCombo !== undefined && dragleaveCombo._cfg !== null) {
            // log('draggedover combos on node mouseup', draggedOverCombos)
            // log('node mouseup- dragleaveCombo',dragleaveCombo.getID());
            const combosToUpdate = getAllCombosInCombo(dragleaveCombo).concat(dragleaveCombo);
            combosToUpdate.forEach((combo) => {
              combo.getModel().label = countNodesInCombo(combo)
              if(combo.getModel().label < 1) {
                newGraph.uncombo(combo.getID());  
              } else {
                newGraph.updateCombo(combo);
              }
            });
          }
        }
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

      newGraph.on("node:mouseup", (e) => {
        if (e.item.getModel().comboId != undefined) {
          const comboIdOfNode = e.item.getModel().comboId;
          const combo = newGraph.findById(comboIdOfNode);
          newGraph.setItemState(e.item, "dragenter", true);
          const currentNodeCount = countNodesInCombo(combo);
          if (e.item._cfg.model.label === "") {
            e.item._cfg.model.label = currentNodeCount;
          } 
          else {
            if (nodeDrag === true && dragleaveCombo !== undefined) {
              //for updating the subtraction of node count from outermost combo
              // see combo drag leave
              if (dragleaveCombo._cfg !== null) {
                newGraph.updateCombo(dragleaveCombo);
              } 

              else {
                newGraph.updateCombo(combo);
              }
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
        dragCombo = e.item;
        // prevents dotted red border from showing when dragging combo
        newGraph.setItemState(e.item, 'dragleave', false);
      });

      
      newGraph.on('combo:dragover', (e) => {
        log('combo:dragover');
        comboDraggedOver = e.item;
        // for updating node count on combo drag
        if(dragCombo !== undefined) {
          if(e.item._cfg !== null && dragCombo._cfg !== null /* && dragCombo !== undefined */) {
            if(!(draggedOverCombos.includes(e.item)) && !nodeDrag && e.item.getID() !== dragCombo.getID()){
              log('combo dragged over combo');
              draggedOverCombos.push(e.item);
            }
          }
        }
        // for updating node count of combos on node drag
        if (!(draggedOverCombos.includes(e.item))) {
          draggedOverCombos.push(e.item);
          log('node dragged over combo')
        }
        newGraph.setItemState(e.item, 'dragenter', true);
      });

      newGraph.on('combo:dragend', (e) => {
        newGraph.getCombos().forEach((combo) =>{
          newGraph.setItemState(combo, 'dragenter', false);
        });
      });


      newGraph.on('combo:drop', (e) => { 
        comboDrop = true; 
        //for COMBO: DRAG
        if(!nodeDrag){
          log('combo dropped into combo')
        // GET OUTERMOST COUNTER DETAILS!
         let outerMostCombo = e.item; 
         if (e.item.getModel().parentId !== undefined){
           const allParents = getAllParents(e.item, newGraph)
           outerMostCombo = allParents[allParents.length - 1];          
         }
         // we want to update only the combos which have been dragged over, 
         // including the recipient combo and the outermost combo affected
         const allCombos = getAllCombosInCombo(outerMostCombo).concat(outerMostCombo);
         allCombos.forEach((combo) => {
          combo.getModel().label = countNodesInCombo(combo);
          //REQUIRED when deleting combos from multiple nested layers.
          if(combo.getModel().label < 1) {
            newGraph.uncombo(combo.getID());
          } else {
            newGraph.setItemState(combo, 'dragleave', false);
            newGraph.setItemState(combo, 'dragenter', false);
            newGraph.updateCombo(combo);
          }
         })
       } else {
        // for NODE:drag
        log('node dropped into combo');
        
        let combosToUpdate = [];
        e.item.getModel().label = countNodesInCombo(e.item);
        
        // for updating all recipient combo nodecounts and for the parents, grandparents' nodeCount
        if(e.item.getModel().parentId !== undefined) {
          const comboParents = getAllParents(e.item, newGraph);
          combosToUpdate = combosToUpdate.concat(comboParents);

        // for updating nodeCount when moving node across 2 sibling combos in the same parent
          const parent = newGraph.findById(e.item.getModel().parentId);
          if(parent.getCombos().length > 1){
            const children = parent.getCombos();
            const siblings = children.filter(child =>child.getID() !== e.item.getID());
            //log('siblings = ', siblings);
            siblings.forEach((sibling) => {
              combosToUpdate.push(sibling);
            })
          }
        } 

        // for updating all the sibling combos of the recipients 
        //( when node is drag out of a child combo, into a parent combo )
        if(e.item.getCombos() !== undefined) {
          const childCombos = e.item.getCombos();
          let allCCombos = [];
          childCombos.forEach((cCombo)=>{
            let cComboFamily = getAllCombosInCombo(cCombo, newGraph);
            cComboFamily.push(cCombo);
            allCCombos = allCCombos.concat(cComboFamily);
          });
          //log('allCCombos', allCCombos);
          combosToUpdate = combosToUpdate.concat(allCCombos);
        }

        // decrement previous parent combo 
        // when dragging node from one combo tree to another 
        if(draggedOverCombos.length > 0) {
          const draggedOverCombosDisplay = []
          draggedOverCombos.forEach((combo) => {
            if (combo._cfg !== null) {
              draggedOverCombosDisplay.push(combo.getID());
              // add previous parent to combosToUpdate
              if (!(combosToUpdate.includes(combo))) {
                combosToUpdate.push(combo)
              }
            }
          });
          // log('node dragged over these combos:', draggedOverCombosDisplay);
        }

        //log('dragleaveCombo =', dragleaveCombo.getID());
        combosToUpdate.push(e.item);

        // for updating originating combo's node count, 
        // when dragging node from it into a child of another combo
        const updatedCombosDisplay = []
        combosToUpdate.forEach((combo) => {
          updatedCombosDisplay.push(combo.getID())
          combo.getModel().label = countNodesInCombo(combo);
          newGraph.setItemState(combo, 'dragleave', false);
          newGraph.setItemState(combo, 'dragenter', false);
          if(combo.getModel().label < 1) {
            newGraph.uncombo(combo)
          } else {
            newGraph.updateCombo(combo);
          }
        })
        // log('updated combos =', updatedCombosDisplay);
       }
       // draggedOverCombos = [];
      });


      newGraph.on('combo:dragleave', (e) => {
        //log('dragleave');
        dragleaveCombo = e.item;
        newGraph.setItemState(e.item, 'dragleave', true);
      
      });

      newGraph.on('combo:mouseenter',(e) => {
        newGraph.setItemState(e.item, 'mouseenter', true);
      });
      newGraph.on('combo:mouseleave',(e) => {
        newGraph.setItemState(e.item, 'mouseenter', false);
      });


      newGraph.on('combo:mouseup', (e) => {
        log('combo:mouseup')
       
        if(draggedOverCombos !== [] && dragleaveCombo !== undefined && dragCombo !== undefined){ 
          // prevents deletion of orphan combo when dragging across graph space quickly
          // (dragged Combo id can become dragleave combo id)
          if(dragleaveCombo._cfg !== null && dragleaveCombo.getID() !== dragCombo.getID()) {
            // to graph space
            if(!comboDrop) {
              // for SUBTRACTING count when DRAGGING NODES & COMBO from OUTERMOST COMBO out to GRAPH SPACE
              // if condition has to work for BOTH COMBO & NODE dragging.
              const otherCombos = Array.from(draggedOverCombos.filter(combo => combo.getID() !== dragCombo.getID()));
              otherCombos.forEach((combo, i) => {
                combo.getModel().label = countNodesInCombo(combo) - countNodesInCombo(dragCombo);
                if (combo.getModel().label === 0 || countNodesInCombo(combo) === 0) {
                  newGraph.uncombo(combo);
                } else {
                  newGraph.setItemState(combo, 'dragleave', false);
                  newGraph.setItemState(combo, 'dragenter', false);
                  newGraph.updateCombo(combo);
                }
              });
            } 
            // to other combo tree
            else if (comboDrop) {
              // for SUBTRACTING/ADDING (UPDATING) node when DRAGGING NODES & COMBO from nested cCOMBO into different combo tree.
              const draggedOverCombosDisplay = []
              draggedOverCombos.forEach((combo) => {
                // if combo node count become 0 after node or combo dragging, item's _cfg becomes null for that instance. (destroyed)
                if (combo._cfg !== null) {
                  // for logging
                  draggedOverCombosDisplay.push(combo.getID());
                  const nodeCount= countNodesInCombo(combo);
                  combo.getModel().label = nodeCount;
                  if(combo.getModel().label > 0) {
                    log(`KEYED, ${combo.getID()}, count: ${nodeCount}`)
                    newGraph.setItemState(combo, 'dragleave', false);
                    newGraph.setItemState(combo, 'dragenter', false);
                    newGraph.updateCombo(combo); //===> draggedOVerCombos here CLASH WITH COMBO:DROPS use of DRAGGEDOVER COMBO? 
                                                // STILL NOT WORKING FULLY WHEN MOVING child combo out to graph space.
                  } else {
                    newGraph.uncombo(combo.getID());
                  }
                }
              });
              log('draggedOver combos updated:', draggedOverCombosDisplay);
            }
          }
        }
        draggedOverCombos = [];
        comboDrop = false;
      });

      newGraph.on("combo:contextmenu", (e) => {
        const comboId = e.item.getID();
        newGraph.uncombo(comboId);
        });
      
      newGraph.on("combo:click", (e) => {
      const combo = e.item;
      const comboModel = e.item.getModel()

      const selfNodes = getAllNodesInCombo(combo);
      //log('selfNodes =', selfNodes);
 
      // all actions to take when combo is collapsed. 
      if (comboModel.collapsed) {
        let ttpCheck = false;
        const neighbors = combo.getNeighbors();
        for (let i = 0; i < neighbors.length; i ++) {
          if (neighbors[i].getType() === "node"){
            const edgesOfNeighbor = neighbors[i].getEdges();
            
            for (let j = 0; j < edgesOfNeighbor.length; j++) {
              for (let k = 0; k < selfNodes.length; k++) {
                if (edgesOfNeighbor[j].getSource() === selfNodes[k] && edgesOfNeighbor[j].getTarget() === neighbors[i]  ||
                    edgesOfNeighbor[j].getTarget() === selfNodes[k] && edgesOfNeighbor[j].getSource() === neighbors[i]
                  ) {
                      if (edgesOfNeighbor[j].getModel().ttp) {
                        ttpCheck = true; 
                        // log('neighborNodes ttpCheck =', ttpCheck);
                      }  
                  }
              }
            }
          } else if (neighbors[i].getType() === "combo") {

              const neighborNodes = getAllNodesInCombo(neighbors[i]);
              // log('neighborNodes =', neighborNodes);

              for (let j = 0; j < selfNodes.length; j++) {
                const selfNodeNeighbors = selfNodes[j].getNeighbors();
                for (let k = 0; k < selfNodeNeighbors.length; k++) {

                  if (neighborNodes.includes(selfNodeNeighbors[k])) {
                    const edges = selfNodeNeighbors[k].getEdges();
                    for(let m = 0; m < edges.length; m ++) {
                      if (neighborNodes.includes(edges[m].getSource()) || neighborNodes.includes(edges[m].getTarget())) {
                        if(edges[m].getModel().ttp){
                          ttpCheck = true
                          // log('selfNodeNeighbors[k] comboId:', selfNodeNeighbors[k].getModel().comboId )
                          // log('selfNodes[j] comboId:',selfNodes[j].getModel().comboId);
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
              if (VEdges[r].getSource() === neighbors[i] && VEdges[r].getTarget() === e.item || 
                  VEdges[r].getTarget() === neighbors[i] && VEdges[r].getSource() === e.item) { 
                    vedgeId = VEdges[r].getID();
                  }
            }
            newGraph.findById(vedgeId).getModel()['ttp'] = ttpCheck;
            // VEdges.forEach((vedge) => {
            //   log('%%%%%% ',vedge.getModel());
            // });
            // log('selected vedgeID=', newGraph.findById(vedgeId).getModel());
          }
        }
       } 
         else {
          comboExpandTTP(e.item);
       } 
    });

    
    newGraph.on('edge:mouseenter', (e) => {
      newGraph.setItemState(e.item, 'hover', true)
      log('EDGE =', e.item);
    });

    newGraph.on('edge:mouseleave', (e) => {
      newGraph.setItemState(e.item, 'hover', false)
    });

    

    // Expand combo -> starting from VEdge and collapsed combo  
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
                    if ( // <================
                      edge.getTarget() === neighbour /* && edge.getSource() === nodes[i] */||
                      edge.getSource() === neighbour /* && edge.getTarget() === nodes[i] */
                    ) {
                      edge.getModel()["ttp"] = ttp;
                      return;
                    } //<===========
                    // if( edge.getTarget() === neighbour && edge.getSource() === nodes[i]) {

                    // }



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
                  // log('>>comboVE on EXPAND =', comboVedges);
                }
              } else if (
                neighbours[i].getType() === "combo" &&
                !combos.includes(neighbours[i])
              ) {
                let ttp = false;
                const nodesInNeighbour = getAllNodesInCombo(neighbours[i]);
                const nodesInCombo = getAllNodesInCombo(inCombo);
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
                  //  log('## comboVE on EXPAND =', comboVedges);
                }
              }
            }
          } else {
            comboExpandTTP(inCombo);
          }
        });
      }
    }


      function getAllParents(childCombo, graph) {
        let arr = []
        grabParents(childCombo, arr, graph);
        return arr;
      }
      
      function grabParents(combo, array, graph) {
        if (combo.getModel().parentId === undefined) {
          return 
        } else {
          const parentID = combo.getModel().parentId
          const parentCombo = graph.findById(parentID);
          array.push(parentCombo);
          grabParents(parentCombo, array, graph);
        }
      }

      // returns true if there is an edge between the node and combo
      // AND that edge is TTP.
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



      const countNodesInCombo = (combo) => {
        if (combo !== undefined) {
          const allNodesCount = getAllNodesInCombo(combo).length;
         return allNodesCount;
        } 
        // log(`ERROR: comboId is undefined when counting nodes in combo`)
      }


      function getAllNodesInCombo(combo) {
        let arr = [];
        return grabAllNodes(combo, arr);
      }

      function grabAllNodes(combo, array) {
        let combos = combo.getCombos(); 
        let childNodes = combo.getNodes(); 
        
        combos.forEach((inCombo) => { array.concat(grabAllNodes(inCombo, array)); });
        childNodes.forEach((node) => { array.push(node); });
        return array;
      }


      function getAllCombosInCombo(outerMostCombo) {
        let arr = [];
        grabAllCombos(outerMostCombo, arr);
        return arr; 
      }

      function grabAllCombos(combo, array) {
        let cCombos = combo.getCombos();
        if(cCombos === []){
          array.push(combo)
          return array;
        } else {
          for(let i = 0; i < cCombos.length; i++) {
            array.push(cCombos[i])
            if (cCombos[i].getCombos().length > 0) {
              array.concat(grabAllCombos(cCombos[i], array))
            }
          }
        }
      }

  
      // DO NOT DELETE - LESLIE's EXPERIMENTATION
      newGraph.on("canvas:click", function (event) {
        const nodes = newGraph.getNodes();
        log('NODES:', nodes);
        const edges = newGraph.getEdges();
        log('EDGES:', edges);
        const combos = newGraph.getCombos();
        log('COMBOS:', combos);
        const vEdges = newGraph.get('vedges');
        log('VEdges:', vEdges);
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

  


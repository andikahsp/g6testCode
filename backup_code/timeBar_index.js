// D:\gitHub\g6testCode\node_modules\@antv\g6-plugin\es\timeBar\index.js
// Line 421: 
if (this.get('filterEdge') || filterItemTypes.includes('edge')) {
    originEdges === null || originEdges === void 0 ? void 0 : originEdges.filter(function (edge) {
      var date = +((getDate_1 === null || getDate_1 === void 0 ? void 0 : getDate_1(edge)) || edge.date); // <--- NOT USED ANYMORE
      const dates = edge.date; // <---- ADDED
      const dateHit = dates.some((date) => (date >= minDate_1 && date <= maxDate_1)); // <---- ADDED
      var hitRange = /* date >= minDate_1 && date <= maxDate_1 */ dateHit || (shouldIgnore_1 === null || shouldIgnore_1 === void 0 ? void 0 : shouldIgnore_1('edge', edge, {
        min: minDate_1,
        max: maxDate_1
      }));
      const hitDates = []; // <---- ADDED
      edge.date.forEach((date) => { // <---- ADDED
        if(date >= minDate_1 && date <= maxDate_1) hitDates.push(date); // <---- ADDED
      }); // <---- ADDED
      graph.findById(edge.id).getModel().frequency = hitDates.length; // <---- ADDED
      graph.updateItem(graph.findById(edge.id), { frequency: hitDates.length }); // <---- ADDED
      const inRangeStatus = dateHit; // <---COUPLE inRange property directly to dateRange, decouple from show/hide item.
      edge.inRange = inRangeStatus; // <---- ADDED
      //var endsExist = currentNodeExistMap_1[edge.source] && currentNodeExistMap_1[edge.target]; 
      // var shouldShow = hitRange && endsExist;
      var exist = currentEdgeExistMap_1[edge.id]; // currentEdgeExistMap is set by line 376, by isVisible()!

      
      const edgeObject = graph.findById(edge.id);// <---- ADDED
      const source = edgeObject.getSource(); // <---- ADDED
      const target = edgeObject.getTarget(); // <---- ADDED
      const ends = [source, target];

      ends.forEach((node) => {
        // set inRange status for the 2 nodes of the edge inRange.
        node.getModel().inRange = inRangeStatus;
      });
      
      //TOGGLE SHOW or HIDE items
      if (exist && !hitRange) {
        currentEdgeExistMap_1[edge.id] = false;
        //graph.removeItem(edge.id); // <-------- NOT USED  
        graph.updateItem(edgeObject, {visible: false}); // <---- change we don't remove the item.

        // HIDE linked nodes & combos which are !inRange
        ends.forEach((node) => {
          const nodeEdges = node.getEdges();
          let edgeScore = 0;
          nodeEdges.forEach((edge) => {
            if(edge.isVisible()) {
              edgeScore++;
            }
          });
          if(edgeScore === 0) {
            // if all of the nodes edges have isVisible() = false, hide node.
            graph.updateItem(node, {visible: false});
            // from node, we update the combos, if any,
            if(node.getModel().comboId !== undefined) {
              const combo = graph.findById(node.getModel().comboId);
              const nodesInCombo = getAllNodesInCombo(combo);
              // set combo's inRange property based on whether nodes inside are inRange (not visible)
              const inRangeNodes = nodesInCombo.filter((node) => node.getModel().inRange);
              if(inRangeNodes.length === 0){
                combo.getModel().inRange = false;
              } else {
                combo.getModel().inRange = true;
              }
              // set combo's visibility according to whether the nodes inside are still visible.
              const visibleNodes = nodesInCombo.filter((node) => node.getModel().inRange);
              combo.getModel().label = visibleNodes.length;
              if(combo.getModel().label === 0 && combo.isVisible()) {
                graph.updateItem(combo, { visible: false });
                if(combo.getModel().parentId !== undefined) {
                  // if the combo is the only child, its parents have to be hidden also. 
                  const parents = getAllParents(combo, graph);
                  parents.forEach((parent)=>{
                    const childNodes = parent.getNodes();
                    const childCombos = parent.getCombos();
                    const visibleNodes = childNodes.filter((cNode) => {cNode.getModel().inRange});
                    const visibleCombos = childCombos.filter((cCombo) => {cCombo.getModel().inRange});
                    if(visibleNodes.length === 0 && visibleCombos.length === 0) {
                      graph.updateItem(parent, {visible:false});
                    }
                  });
                }
              } else {
                graph.updateCombo(combo);
              }
            }                
          }
        })
      } else if (!exist && hitRange) {
        currentEdgeExistMap_1[edge.id] = true;
        //graph.addItem('edge', edge);  // <-------- NOT USED  
        if (!edgeObject.getModel().collapsedByCombo || edgeObject.getModel().collapsedByCombo === undefined) {
          graph.updateItem(edgeObject, {visible: true});
        }
        ends.forEach((node) => {
          //show nodes that are not in combos
          if(node.getModel().comboId === undefined) {
            graph.updateItem(node, {visible: true});
          }
          if (node.getModel().comboId !== undefined) {
            const combo = graph.findById(node.getModel().comboId);
            // do not show nodes if their combos are collapsed.
            if(!checkComboCollapsed(node, graph)) { 
              graph.updateItem(node, {visible: true});
            }
            // update combo related to the nodes connected by the edge
            const nodesInCombo = getAllNodesInCombo(combo);
            // setting combo's inRange property based on whether nodes inside are still inRange
            const inRangeNodes = nodesInCombo.filter((node) => node.getModel().inRange);
            if ( inRangeNodes.length === 0 ) {
              combo.getModel().inRange = false;
            } else {
              combo.getModel().inRange = true;
            }
            // set combo's visibility according to whether there are nodes that are still visible.
            const visibleNodes = nodesInCombo.filter((node) => node.getModel().inRange);
            combo.getModel().label = visibleNodes.length;
            if(!combo.isVisible()) {
              graph.update(combo, {visible: true});
              if(combo.getModel().parentId !== undefined) {
                // if the combo has parents, and they would have to made visible. 
                const parents = getAllParents(combo, graph);
                parents.forEach((parent)=>{
                  graph.updateItem(parent, {visible: true});
                });
              }
            } else {
              graph.updateCombo(combo);
            }
          }
        });
      } else if ( !exist && !hitRange) {                            
        // HIDE Vedges if replaced(hidden) edge is not inRange
        if (edgeObject.getModel().collapsedByCombo) {
          //search for the relevant VEdge
          const vedges = graph.get('vedges');
          console.warn('VEDGES =', vedges);
          const allStandardEdges = graph.get('edges');
          const commonEdgeIDs = [];
          allStandardEdges.forEach((edge) => {
            if (edge.getSource() === edgeObject.getSource() || 
                edge.getTarget() === edgeObject.getTarget() || 
                (edge.getTarget() === edgeObject.getSource() &&
                edge.getSource() === edgeObject.getTarget()) 
                ) {
              if(!commonEdgeIDs.includes(edge.getID())) {
                commonEdgeIDs.push(edge.getID());
              }    
            }
          });
          const replacedByVedge = [];
          vedges.forEach((vedge) => {
            // grab ALL the standard edges it's representing
          });
        }
      }
    });
    // LOGGING AREA
    // console.warn('VE', graph.get('vedges'));
    // console.warn('node 7 getEdges = ', graph.findById('node7').getEdges());
  }
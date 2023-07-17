// for g6-core/graph/graph.js > .prototype.collapseCombo 

var nodeId = otherEndModel.id;   


// // RH optimised solution: determine the otherEnd would be for the new VE to connect
if(otherEndModel.comboId !== undefined) { 
    // traversal: node to combo
    otherEnd = _this.findById(otherEndModel.comboId);
    otherEndModel = otherEnd.getModel();
    // has parent or not
    while (otherEndModel.parentId !== undefined) {
        // is the combo collapsed?
        if(otherEndModel.collapsed && !otherEndModel.collapsedByCombo) break
        // traversal to the parent- if parent is collapsed dealt in next loop
        otherEnd = _this.findById(otherEndModel.parentId);
        otherEndModel = otherEnd.getModel()
    }
    // if combo has no parent, otherEnd should be its child node if it's not collapsed
    // if node has many combo ancestors, if none is collapsed, set otherEnd to original otherEnd: the node
    if(!otherEndModel.collapsed) {
        otherEnd = _this.findById(nodeId);
        otherEndModel = otherEnd.getModel();
    }
    // if the combo has no parent, if combo is collapsed, the combo should be the otherEnd. 
}
  

// RH: determine the  otherEnd would be for the new VE to connect
// if(otherEndModel.comboId !== undefined) {
//   otherEnd = _this.findById(otherEndModel.comboId);
//   otherEndModel = otherEnd.getModel();
//   let allCombos = [otherEnd];
//   while (otherEndModel.parentId !== undefined) {
//     otherEnd = _this.findById(otherEnd.getModel().parentId);
//     otherEndModel = otherEnd.getModel();
//     allCombos.push(otherEnd);
//   }
//   const collapsedCombos = allCombos.filter((combo) => combo.getModel().collapsed);
//   if(collapsedCombos.length > 0 ) {
//     // const ans = allCombos.find(combo => combo.getModel().collapsed && !combo.getModel().collapsedByCombo );
//     const ans = collapsedCombos.filter(cCombo => !cCombo.getModel().collapsedByCombo)
//     otherEndModel = ans[0].getModel();
//   }
//   else {
//     otherEnd = _this.findById(nodeId);
//     otherEndModel = otherEnd.getModel();
//   }
// }



const flatten = (comboModel) => {
    // terminate looping when there are no more combos in combo children
    // else continue looping

    if (noMoreCombosInChildren(comboModel.children)) {
        return concatNodeIds(comboModel.children);
    } else {
        for(let i = 0; i < comboModel.children.length; i++ ) {
            if(comboModel.children[i].id.includes('combo')){
                return concatNodeIds(comboModel.children) + flatten
            }
        }
        return  + flatten()
    }
}


function noMoreCombosInChildren(childrenArray) {
    for(let i = 0; i < childrenArray.length; i ++) {
        if(childrenArray[i].id.includes('combo')){
            return false;
        }
    }
    return true;
}

function concatNodeIds(childrenArray) {
    let nodeIds = [];
    for(let i = 0; i < childrenArray.length; i++ ){
        if(childrenArray[i].id.includes('node')){
            nodeIds.push(childrenArray[i].id);
        }
    }
    return nodeIds;
}
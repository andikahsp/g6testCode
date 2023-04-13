


export const flatten = (comboModelChildren) => {
    // terminate looping when there are no more combos in combo children
    // else continue looping
    if (noMoreCombosInChildren(comboModelChildren)) {
        return comboModelChildren;
    } else {
        const nodes = collateNodes(comboModelChildren);
        const combos = collateCombos(comboModelChildren)
        const lastCombo = combos.pop();
        const remainder = [...nodes, ...combos]
        return  flatten(remainder.concat(flatten(lastCombo.children)));
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

function collateNodes(childrenArray) {
    let nodes = [];
    for(let i = 0; i < childrenArray.length; i++ ){
        if(childrenArray[i].id.includes('node')){
            nodes.push(childrenArray[i]);
        }
    }
    return nodes;
}

function collateCombos(childrenArray) {
    let nodes = [];
    let combos = [];
    for(let i = 0; i < childrenArray.length; i++ ){
        if(childrenArray[i].id.includes('combo')){
            combos.push(childrenArray[i]);
        }
    }
    return combos;
}
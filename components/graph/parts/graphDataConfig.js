import { imageURLs } from "./imageURLs";

export function populateNodesEdges (jsonData) {

    // This format if we want to customise shapes and sizes according
    // to data
    
    const image = { type: 'image', 
                     size: 36};
  /*   const circle = { type: 'circle', 
                     size: 48 };
    
    const triangle = { type: 'triangle',
                       size: 20, 
                       direction: 'up'}; */
     
     // node and edge definition will be based on backend logic                  
     const data = {
        nodes:[
         { id: 'node0', ...image, img: imageURLs[0], /* comboId: 'A',   */label: 'node0'/* jsonData.computerName */, date: jsonData.logsourceTime },
         { id: 'node1', ...image, img: imageURLs[1], /* comboId: 'B',   */label: 'node1'/* jsonData.originatingComputer */, date: jsonData.logsourceTime, comboId: 'combo1' },
         { id: 'node2', ...image, img: imageURLs[2], /* comboId: 'C',   */label: 'node2'/* jsonData.logonProcess */, date: 1636095550 },    
         { id: 'node3', ...image, img: imageURLs[3], /* comboId: 'D',   */label: 'node3'/* `vector` */, date: 1636095551 },  
         { id: 'node4', ...image, img: imageURLs[4], /* comboId: 'E',   */label: 'node4'/* `vector` */, date: 1636095552 },  
         { id: 'node5', ...image, img: imageURLs[5], /* comboId: 'F',   */label: 'node5'/* `vector` */, date: 1636095553 }, 
         { id: 'node6', ...image, img: imageURLs[6], /* comboId: 'G',   */label: 'node6'/* `vector` */, date: 1636095553 }, 
         { id: 'node7', ...image, img: imageURLs[7], label: 'node7'/* `vector` */, date: 1636095553 }, 
         { id: 'node8', ...image, img: imageURLs[8], label: 'node8'/* `vector` */, date: 1636095553 }, 
         { id: 'node9', ...image, img: imageURLs[9], label: 'node9'/* `vector` */, date: 1636095552 },  
         { id: 'node10', ...image, img: imageURLs[10], label: 'node10'/* `vector` */, date: 1636095553 }, 
         { id: 'node11', ...image, img: imageURLs[11], label: 'node11'/* `vector` */, date: 1636095553 }, 
         { id: 'node12', ...image, img: imageURLs[12], label: 'node12'/* `vector` */, date: 1636095553 }, 
         { id: 'node13', ...image, img: imageURLs[13], label: 'node13'/* `vector` */, date: 1636095553 },
         { id: 'node14', ...image, img: imageURLs[14], label: 'node14'/* `vector` */, date: 1636095553 }, 
        ], 
       edges: [
         { id: 'edge1',
           source: 'node1', 
           target: 'node2', 
           ttp: true,
           frequency: '3', 
           event: 'edge1',//`${jsonData.message}`       
        },
        {  id: 'edge2',
           source: 'node3',
           target: 'node5', 
           ttp: true, 
           frequency: '7', 
           event: 'edge2',//`some other Event`
        },
        {  id: 'edge3',
           source: 'node5', 
           target: 'node6', 
           frequency: '9',
           ttp: true, 
           event: 'edge3',//`Event B`
        },
        {  id: 'edge4',
        source: 'node10', 
        target: 'node9', 
        frequency: '11',
        ttp: true, 
        event: 'edge4',//`Event B`
        },
        /* {  id: 'edge5',
        source: 'node9', 
        target: 'node10', 
        frequency: '15',
        ttp: true, 
        event: 'edge5',//`Event B`
        }, */
        {  id: 'edge6',
        source: 'node11', 
        target: 'node12', 
        frequency: '17',
        ttp: true, 
        event: 'edge6',//`Event B`
        },
        /* {  id: 'edge7',
        source: 'node12', 
        target: 'node11', 
        frequency: '21',
        ttp: true, 
        event: 'edge7',//`Event B`
        }, */
        {  id: 'edge8',
        source: 'node7', 
        target: 'node8', 
        frequency: '21',
        ttp: true, 
        event: 'edge8',//`Event B`
        },
        /* {  id: 'edge9',
        source: 'node5', 
        target: 'node6', 
        frequency: '21',
        ttp: true, 
        event: 'edge9',//`Event B`
        }, */
       ],
       /* combos: [
        {
          id: 'A',
          parentId: 'H'
        },
        {
          id: 'B',
        },
        {
          id: 'C',
          parentId: 'H'
        },
        {
          id: 'D',
        },
        {
          id: 'E',
          parentId: 'H'
        },
        {
          id: 'F',
          parentId: 'H'
        },
        {
          id: 'G',
        },
        {
          id: 'H',
        },
       ] */
     } 
     return data;
   }
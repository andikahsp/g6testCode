import { imageURLs } from "./imageURLs";

export function populateNodesEdges (jsonData) {

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
         { id: 'node0', ...circle, /* img: imageURLs[0], */ comboId: 'combo1',  label: /* 'node0' */jsonData.computerName, /* date: jsonData.logsourceTime */ },
         { id: 'node1', ...image, img: imageURLs[1], comboId: 'combo4',  label: 'node1'/* jsonData.logonProcess */, /* date: jsonData.logsourceTime */},
        //  { id: 'node2', ...triangle, /* img: imageURLs[2], */ /* comboId: 'combo3',  */ label: /* 'node2' */jsonData.originatingComputer, /* date: 1636095550 */ },    
         { id: 'node3', ...image, img: imageURLs[3], /* comboId: 'combo4',   */label: 'node3'/* `vector` */, /* date: 1636095551 */ },  
         { id: 'node4', ...image, img: imageURLs[4], /* comboId: 'combo5',   */label: 'node4'/* `vector` */, /* date: 1636095552 */ },  
         { id: 'node5', ...image, img: imageURLs[5], /* comboId: 'combo6',   */label: 'node5'/* `vector` */, /* date: 1636095553 */ }, 
        //  { id: 'node6', ...image, img: imageURLs[6], /* comboId: 'combo7',   */label: 'node6'/* `vector` */, /* date: 1636095553 */ }, 
        //  { id: 'node7', ...image, img: imageURLs[7], label: 'node7'/* `vector` */, /* date: 1636095553 */ }, 
        //  { id: 'node8', ...image, img: imageURLs[8], label: 'node8'/* `vector` */, /* date: 1636095553 */ }, 
        //  { id: 'node9', ...image, img: imageURLs[9], label: 'node9'/* `vector` */, /* date: 1636095552 */ },  
        //  { id: 'node10', ...image, img: imageURLs[10], label: 'node10'/* `vector` */, /* date: 1636095553 */ }, 
        //  { id: 'node11', ...image, img: imageURLs[11], label: 'node11'/* `vector` */, /* date: 1636095553 */ }, 
        //  { id: 'node12', ...image, img: imageURLs[12], label: 'node12'/* `vector` */, /* date: 1636095553 */ }, 
        //  { id: 'node13', ...image, img: imageURLs[13], label: 'node13'/* `vector` */, /* date: 1636095553 */ },
        //  { id: 'node14', ...image, img: imageURLs[14], label: 'pointer'/* `vector` */, /* date: 1636095553 */ }, 
        ], 
       edges: [
        { 
          id: 'edge1',
          source: 'node0', 
          target: 'node1', 
          ttp: true,
          frequency: '3', 
          event: `${jsonData.message}`, //'edge1',      
          date: 
          [
            1636095545,
          ],
        },
        { 
          id: 'edge2',
          source: 'node3',
          target: 'node4', 
          ttp: true, 
          frequency: 7, 
          date: 
          [
            1636095546,
            1636095547,
            1636095548,
            1636095549,
            1636095550,
            1636095551,
            1636095552
          ],
          event: 'edge2',//`some other Event`
        },
        { 
          id: 'edge3',
          source: 'node4', 
          target: 'node5', 
          frequency: 3,
          ttp: true, 
          event: 'edge3',
          date: 
          [
            1636095548,
            1636095550,
            1636095552
          ],
        },
        // { 
        //   id: 'edge4',
        //   source: 'node5', 
        //   target: 'node6', 
        //   frequency: '11',
        //   ttp: true, 
        //   event: 'edge4',
        //   date: 1636095554
        // },
        // { 
        //   id: 'edge5',
        //   source: 'node9', 
        //   target: 'node10', 
        //   frequency: '15',
        //   ttp: true, 
        //   event: 'edge5',
        //   date: 1636095552
        // },
        // { 
        //   id: 'edge6',
        //   source: 'node11', 
        //   target: 'node12', 
        //   frequency: '17',
        //   ttp: true, 
        //   event: 'edge6',
        //   date: 1636095553
        // },
        // { 
        //   id: 'edge7',
        //   source: 'node12', 
        //   target: 'node11', 
        //   frequency: '21',
        //   ttp: true, 
        //   event: 'edge7',
        //   date: 1636095554
        // },
        // { 
        //   id: 'edge8',
        //   source: 'node7', 
        //   target: 'node8', 
        //   frequency: '21',
        //   ttp: true, 
        //   event: 'edge8',
        //   date: 1636095555
        // },
        // { 
        //   id: 'edge9',
        //   source: 'node6', 
        //   target: 'node5', 
        //   frequency: '21',
        //   ttp: true, 
        //   event: 'edge9',
        //   date: 1636095554
        // },
       ],
       combos: [
        {
          id: 'combo1',
          label: 1,
          parentId: 'combo2'
        },
        {
          id: 'combo2',
          label: 1,
          parentId: 'combo3'
        },
        {
          id: 'combo3',
          label: 1,
        //   // parentId: '8'
        },
        {
          id: 'combo4',
             label: 1
        },
        // {
        //   id: 'combo5',
            //  label: 1,
        //   parentId: '8'
        // },
        // {
        //   id: 'combo6',
        //   label: 1,
        //   parentId: '8'
        // },
        // {
        //   id: 'combo7',
        //   label: 1
        // },
        // {
        //   id: 'combo8',
        //   label: 1
        // },
       ]
     } 
     return data;
   }
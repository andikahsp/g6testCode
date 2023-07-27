import { imageURLs } from "./imageURLs";

export function populateNodesEdgesOrg (jsonData) {

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
        //   { id: 'node0', ...circle, /* img: imageURLs[0], */ comboId: 'combo1',  label: /* 'node0' */jsonData.computerName, /* date: jsonData.logsourceTime */ inRange: true },
        //   { id: 'node1', ...image, img: imageURLs[1], comboId: 'combo4',  label: 'node1'/* jsonData.logonProcess */, /* date: jsonData.logsourceTime */ inRange: true},
        //  { id: 'node2', ...triangle, /* img: imageURLs[2], */ /* comboId: 'combo3',  */ label: /* 'node2' */jsonData.originatingComputer, /* date: 1636095550 */ inRange: true},    
        { id: 'node3', ...image, img: imageURLs[3], comboId: 'combo5',  label: 'node3'/* `vector` */, /* date: 1636095551 */ inRange: true},  
        { id: 'node4', ...image, img: imageURLs[4], comboId: 'combo6',  label: 'node4'/* `vector` */, /* date: 1636095552 */ inRange: true},  
        { id: 'node5', ...image, img: imageURLs[5], /* comboId: 'combo4',  */ label: 'node5'/* `vector` */, /* date: 1636095553 */ inRange: true}, 
        { id: 'node6', ...image, img: imageURLs[6], comboId: 'combo1',  label: 'node6'/* `vector` */, /* date: 1636095553 */ inRange: true}, 
        //   { id: 'node7', ...image, img: imageURLs[7], comboId: 'combo4', label: 'node7'/* `vector` */, /* date: 1636095553 */ inRange: true}, 
        //   { id: 'node8', ...image, img: imageURLs[8], comboId: 'combo4', label: 'node8'/* `vector` */, /* date: 1636095553 */ inRange: true}, 
        //   { id: 'node9', ...image, img: imageURLs[9], label: 'node9'/* `vector` */, /* date: 1636095552 */ inRange: true},  
        //   { id: 'node10', ...image, img: imageURLs[10], label: 'node10'/* `vector` */, /* date: 1636095553 */ inRange: true}, 
        //  { id: 'node11', ...image, img: imageURLs[11], label: 'node11'/* `vector` */, /* date: 1636095553 */ inRange: true}, 
        //  { id: 'node12', ...image, img: imageURLs[12], label: 'node12'/* `vector` */, /* date: 1636095553 */ inRange: true}, 
        //  { id: 'node13', ...image, img: imageURLs[13], label: 'node13'/* `vector` */, /* date: 1636095553 */ inRange: true},
        //  { id: 'node14', ...image, img: imageURLs[14], label: 'pointer'/* `vector` */, /* date: 1636095553 */ inRange: true}, 
        ], 
       edges: [
        // { 
        //   id: 'edge1',
        //   source: 'node0', 
        //   target: 'node1', 
        //   ttp: true,
        //   frequency: '3', 
        //   label: 'edge1',//`${jsonData.message}`, // <----- LABEL
        //   inRange: true, 
        //   date: 
        //   [
        //     1636095542,
        //   ],
        // },
        { 
          id: 'edge2',
          source: 'node4',
          target: 'node3', 
          label: 'edge2',//`some other Event` // <----- LABEL
          ttp: true, 
          frequency: 1, 
          inRange: true, 
          date: 
          [
            1636095547,
            1636095548,
            1636095549,
            1636095550,
            1636095551,
            1636095552
          ],
        },
        { 
          id: 'edge3',
          source: 'node5', 
          target: 'node6', 
          frequency: 3,
          ttp: true, 
          label: 'edge3', // <----- LABEL
          inRange: true, 
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
        //   target: 'node9', 
        //   frequency: 1,
        //   ttp: true, 
        //   label: 'edge4', // <----- LABEL
        //   inRange: true,
        //   date: 
        //   [ 
        //     1636095554,
        //   ]
        // },
        // { 
        //   id: 'edge5',
        //   source: 'node9', 
        //   target: 'node10', 
        //   frequency: 1,
        //   ttp: true, 
        //   label: 'edge5', // <----- LABEL
        //   inRange: true, 
        //   date: 
        //   [
        //     1636095555,
        //   ]
        // },
        // { 
        //   id: 'edge6',
        //   source: 'node0', 
        //   target: 'node6', 
        //   frequency: '1',
        //   ttp: true, 
        //   label: 'edge6', // <----- LABEL
        //   inRange: true, 
        //   date: 
        //   [
        //     1636095546,
        //   ],
        // },
        // { 
        //   id: 'edge7',
        //   source: 'node0', 
        //   target: 'node7', 
        //   frequency: '21',
        //   ttp: true, 
        //   label: 'edge7', // <----- LABEL
        //   inRange: true, 
        //   date: 
        //   [
        //     1636095548,
        //   ],
        // },
        // { 
        //   id: 'edge8',
        //   source: 'node0', 
        //   target: 'node8', 
        //   frequency: '21',
        //   ttp: true, 
        //   label: 'edge8', // <----- LABEL
        //   inRange: true, 
        //   date: 
        //   [
        //     1636095553,
        //   ],
        // },
        { 
          id: 'edge9',
          source: 'node3', 
          target: 'node4', 
          frequency: 2,
          ttp: true, 
          label: 'edge9', // <----- LABEL
          inRange: true, 
          date: 
          [ 
            1636095551,
            1636095552
          ]
        },
       ],
       combos: [
        {
          id: 'combo1', // <----- LABEL
          nodeCount: 1,     // <----- nodeCount
          parentId: 'combo2',
          inRange: true, 
        },
        {
          id: 'combo2',
          nodeCount: 1,
          parentId: 'combo3',
          inRange: true, 
        },
        {
          id: 'combo3', // <----- LABEL
          nodeCount: 1,     // <----- nodeCount
          inRange: true, 
          // parentId: '8'
        },
        {
          id: 'combo4', // <----- LABEL
          nodeCount: 1,     // <----- nodeCount
          inRange: true, 
        },
        {
          id: 'combo5', // <----- LABEL
          nodeCount: 1,     // <----- nodeCount
          inRange: true, 
          parentId: 'combo4'
        },
        {
          id: 'combo6', // <----- LABEL
          nodeCount: 1,     // <----- nodeCount
          inRange: true,
          parentId: 'combo8'
        },
        {
          id: 'combo7', // <----- LABEL
          nodeCount: 1,     // <----- nodeCount
          inRange: true, 
        },
        {
          id: 'combo8', // <----- LABEL
          nodeCount: 1,     // <----- nodeCount
          inRange: true, 
          parentId: 'combo7',
          collapsed: true
        },
       ]
     } 
     return data;
   }
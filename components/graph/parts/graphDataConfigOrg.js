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
        //   { id: 'node5', ...image, img: imageURLs[5], /* comboId: 'combo6',   */label: 'node5'/* `vector` */, /* date: 1636095553 */ inRange: true}, 
        //   { id: 'node6', ...image, img: imageURLs[6], comboId: 'combo4',  label: 'node6'/* `vector` */, /* date: 1636095553 */ inRange: true}, 
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
        //   event: 'edge1',//`${jsonData.message}`,
        //   inRange: true, 
        //   date: 
        //   [
        //     1636095542,
        //   ],
        // },
        { 
          id: 'edge2',
          source: 'node3',
          target: 'node4', 
          event: 'edge2',//`some other Event`
          ttp: true, 
          frequency: 6, 
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
        // { 
        //   id: 'edge3',
        //   source: 'node4', 
        //   target: 'node5', 
        //   frequency: 3,
        //   ttp: true, 
        //   event: 'edge3',
        //   inRange: true, 
        //   date: 
        //   [
        //     1636095548,
        //     1636095550,
        //     1636095552
        //   ],
        // },
        // { 
        //   id: 'edge4',
        //   source: 'node5', 
        //   target: 'node9', 
        //   frequency: 1,
        //   ttp: true, 
        //   event: 'edge4',
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
        //   event: 'edge5',
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
        //   event: 'edge6',
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
        //   event: 'edge7',
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
        //   event: 'edge8',
        //   inRange: true, 
        //   date: 
        //   [
        //     1636095553,
        //   ],
        // },
        { 
          id: 'edge9',
          source: 'node4', 
          target: 'node3', 
          frequency: 2,
          ttp: false, 
          event: 'edge9',
          inRange: true, 
          date: 
          [
            1636095546,
            1636095547,
          ]
        },
       ],
       combos: [
        // {
        //   id: 'combo1',
        //   label: 1,
        //   parentId: 'combo2',
        //   inRange: true, 
        // },
        // {
        //   id: 'combo2',
        //   label: 1,
        //   parentId: 'combo3',
        //   inRange: true, 
        // },
        // {
        //   id: 'combo3',
        //   label: 1,
        //   inRange: true, 
        // //   // parentId: '8'
        // },
        // {
        //   id: 'combo4',
        //   label: 4,
        //   inRange: true, 
        // },
        {
          id: 'combo5',
             label: 1,
          inRange: true, 
          parentId: 'combo7'
        },
        {
          id: 'combo6',
          label: 1,
          inRange: true,
          parentId: 'combo8'
        },
        {
          id: 'combo7',
          label: 1,
          inRange: true, 
        },
        {
          id: 'combo8',
          label: 1,
          inRange: true, 
        },
       ]
     } 
     return data;
   }
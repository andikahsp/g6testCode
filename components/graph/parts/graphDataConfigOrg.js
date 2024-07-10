import { imageURLs } from "./imageURLs";

export function populateNodesEdgesOrg (jsonData, container) {

    // This format if we want to customise shapes and sizes according
    // to data
    const width = container.scrollWidth;
    console.log('width:',width)
    
    const image = { type: 'image', 
                     size: 36};

    const circle = { type: 'nCircle', 
                      size: 54, // this will be the default size of all the nodes
                      style: {                     
                      position: 'top',
                      stroke: '#5f6266',
                      fill: '#d4d4d4',
                      lineWidth: 4,
                    } };
    
    const triangle = { type: 'triangle',
                       size: 20, 
                       direction: 'up'};
     
     // node and edge definition will be based on backend logic                  
     const data = {
        nodes:[
        //   { id: 'node0', ...circle, /* img: imageURLs[0], */ comboId: 'combo1',  label: /* 'node0' */jsonData.computerName, /* date: jsonData.logsourceTime */ ioc: false, inRange: true },
        //   { id: 'node1', ...image, img: imageURLs[1], comboId: 'combo4',  label: 'node1'/* jsonData.logonProcess */, /* date: jsonData.logsourceTime */ ioc: false, inRange: true},
        //  { id: 'node2', ...triangle, /* img: imageURLs[2], */ /* comboId: 'combo3',  */ label: /* 'node2' */jsonData.originatingComputer, /* date: 1636095550 */ ioc: false, inRange: true},    
        { id: 'node3',x:-100 ,...circle, icon: {img: imageURLs[3]}, comboId: 'Level-5',  label: 'node3'/* `vector` */, /* date: 1636095551 */ ioc: false, inRange: true},  
        { id: 'node4',x:-100, ...circle, icon: {img: imageURLs[4]},  comboId: 'Level-4',   label: 'node4'/* `vector` */, /* date: 1636095552 */ ioc: true, inRange: true},  
        { id: 'node5',x:100, ...circle, icon: {img: imageURLs[5]}, comboId: 'Level-5',  label: 'node5'/* `vector` */, /* date: 1636095553 */ ioc: false, inRange: true}, 
        { id: 'node6',x:100, ...circle, icon: {img: imageURLs[6]}, comboId: 'Level-4',  labwel: 'node6'/* `vector` */, /* date: 1636095553 */ ioc: false, inRange: true}, 
        { id: 'node7',x:-100 ,...circle, icon: {img: imageURLs[3]}, comboId: 'Level-3',  label: 'node7'/* `vector` */, /* date: 1636095551 */ ioc: false, inRange: true},  
        { id: 'node8',x:100, ...circle, icon: {img: imageURLs[4]},  comboId: 'Level-3',   label: 'node8'/* `vector` */, /* date: 1636095552 */ ioc: true, inRange: true}, 
        // { id: 'node7', ...image, img: imageURLs[7], comboId: 'combo4', label: 'node7'/* `vector` */, /* date: 1636095553 */ ioc: false, inRange: true}, 
        //   { id: 'node8', ...image, img: imageURLs[8], comboId: 'combo4', label: 'node8'/* `vector` */, /* date: 1636095553 */ ioc: false, inRange: true}, 
        //   { id: 'node9', ...image, img: imageURLs[9], label: 'node9'/* `vector` */, /* date: 1636095552 */ ioc: false, inRange: true},  
        //   { id: 'node10', ...image, img: imageURLs[10], label: 'node10'/* `vector` */, /* date: 1636095553 */ ioc: false, inRange: true}, 
        //  { id: 'node11', ...image, img: imageURLs[11], label: 'node11'/* `vector` */, /* date: 1636095553 */ ioc: false, inRange: true}, 
        //  { id: 'node12', ...image, img: imageURLs[12], label: 'node12'/* `vector` */, /* date: 1636095553 */ ioc: false, inRange: true}, 
        //  { id: 'node13', ...image, img: imageURLs[13], label: 'node13'/* `vector` */, /* date: 1636095553 */ ioc: false, inRange: true},
        //  { id: 'node14', ...image, img: imageURLs[14], label: 'pointer'/* `vector` */, /* date: 1636095553 */ ioc: false, inRange: true}, 
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
            1636095542,
            1636095544,
            1636095546,
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
          source: 'node4', 
          target: 'node3', 
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
        // {
        //   id: 'Level-1', // <----- LABEL
        //   nodeCount: 1,     // <----- nodeCount
        //   inRange: true, 
          
        // },
        // {
        //   id: 'Level-2',
        //   nodeCount: 1,
        //   inRange: true, 
        // },
        {
          id: 'Level-1', // <----- LABEL
          nodeCount: 1,     // <----- nodeCount
          inRange: true, 
          x: width/2,
          y: 700,
        },
        {
          id: 'Level-2', // <----- LABEL
          nodeCount: 1,     // <----- nodeCount
          inRange: true, 
          x: width/2,
          y: 550,
        },
        {
          id: 'Level-3', // <----- LABEL
          nodeCount: 1,     // <----- nodeCount
          inRange: true, 
          x: width/2,
          y: 400,
        },
        {
          id: 'Level-4', // <----- LABEL
          nodeCount: 1,     // <----- nodeCount
          inRange: true, 
          x: width/2,
          y: 250,
        },
        {
          id: 'Level-5', // <----- LABEL
          nodeCount: 1,     // <----- nodeCount
          inRange: true, 
          x: width/2,
          y: 100,
        },

        // {
        //   id: 'combo4', // <----- LABEL
        //   nodeCount: 2,     // <----- nodeCount
        //   inRange: true, 
        //   ioc: true, 
        //   parentId: 'combo5'
        // },
        // {
        //   id: 'combo5', // <----- LABEL
        //   nodeCount: 2,     // <----- nodeCount
        //   ioc: true,
        //   inRange: true
        // },
        // {
        //   id: 'combo6', // <----- LABEL
        //   nodeCount: 1,     // <----- nodeCount
        //   inRange: true,
        //   parentId: 'combo8'
        // },
        // {
        //   id: 'combo7', // <----- LABEL
        //   nodeCount: 1,     // <----- nodeCount
        //   inRange: true, 
        // },
        // {
        //   id: 'combo8', // <----- LABEL
        //   nodeCount: 1,     // <----- nodeCount
        //   inRange: true, 
        //   parentId: 'combo7',
        //   collapsed: true
        // },
       ]
     } 
     return data;
   }
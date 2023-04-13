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
         { id: 'node1', ...image, img: imageURLs[0], label: 'node1'/* jsonData.computerName */, date: jsonData.logsourceTime },
         { id: 'node2', ...image, img: imageURLs[1], label: 'node2'/* jsonData.originatingComputer */, date: jsonData.logsourceTime/* , comboId: 'combo1' */ },
         { id: 'node3', ...image, img: imageURLs[2], label: 'node3'/* jsonData.logonProcess */, date: 1636095550/* , comboId: 'combo1' */ },    
         { id: 'node4', ...image, img: imageURLs[3], label: 'node4'/* `vector` */, date: 1636095551 },  
         { id: 'node5', ...image, img: imageURLs[4], label: 'node5'/* `vector` */, date: 1636095552 },  
         { id: 'node6', ...image, img: imageURLs[5], label: 'node6'/* `vector` */, date: 1636095553 }, 
         { id: 'node7', ...image, img: imageURLs[6], label: 'node7'/* `vector` */, date: 1636095553 }, 
        ], 
       edges: [
         /* { id: 'edge1',
           source: 'node1', 
           target: 'node2', 
           //ttp: true,
           frequency: '3', 
           event: 'edge1',//`${jsonData.message}`       
        },
        {  id: 'edge2',
           source: 'node4',
           target: 'node5', 
           ttp: true, 
           frequency: '7', 
           event: 'edge2',//`some other Event`
        },
        {  id: 'edge3',
           source: 'node6', 
           target: 'node7', 
           frequency: '9',
           ttp: true, 
           event: 'edge3',//`Event B`
        }, */
       ],
  /*      combos: [
        {
          id: 'combo1',
          label: 2,
        }
       ] */
     } 
     return data;
   }
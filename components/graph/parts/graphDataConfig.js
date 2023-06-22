import { imageURLs } from "./imageURLs";

export function populateNodesEdges (jsonData) {

    const graphData = {
      info: [],
      nodes: [],
      edges: []
    };
    // This format if we want to customise shapes and sizes according
    // to data
    const image = { type: 'image', 
                     size: 36};
    const circle = { type: 'circle', 
                     size: 48 };
    
    const triangle = { type: 'triangle',
                       size: 20, 
                       direction: 'up'};
    
    const imageHash = {
      'User': imageURLs[15],
      'Group': imageURLs[16],
      'Computer': imageURLs[17],
      'Registry': imageURLs[18],
      'File': imageURLs[19],
      'Process': imageURLs[20],
      'Port': imageURLs[21],
      'Firewall': imageURLs[22],
      'Email': imageURLs[23],
    }                   
    
    // Add icon settings to graphData from BackEnd
    jsonData.nodes.forEach((node) => {
      node["type"] = 'image';
      node["size"] = 24;
      const iconType = node["display"]["labels"][0];
      if (iconType){
        node["img"] = imageHash[iconType];
      } else {
        // set to questionmark icon
        node["img"] = imageURLs[24];
      }

      graphData["nodes"].push(node);
    })  

    graphData["info"].push(jsonData["edges"][0])
    
    for(let i = 1; i < jsonData["edges"].length; i++ ) {
      graphData["edges"].push(jsonData["edges"][i])
    }
    // CyGraph injects calculated information based on graphData back into it (i.e. coordinates)
    console.log(graphData); 
    return graphData;
   }

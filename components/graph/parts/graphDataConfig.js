import { imageURLs } from "./imageURLs";

export function populateNodesEdges (jsonData) {

    const graphData = {
      info: [],
      nodes: [],
      edges: [],
      combos: []
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
      'IP_Address' : imageURLs[24]
    }                   
    
    // Add icon settings to graphData from BackEnd
    jsonData.nodes.forEach((node) => {
      node["type"] = 'image';
      node["size"] = 24;
      const iconType = node["display"]["labels"][0];
      if (Object.keys(imageHash).includes(iconType)){
        node["img"] = imageHash[iconType];
      } else {
        // set to questionmark icon
        node["img"] = imageURLs[25];
      }
      // push node daata to CyGraph graph data
      graphData["nodes"].push(node);
    })  

    graphData["info"].push(jsonData["edges"][0])
    
    // push edge data to Cygraph edge data
    // i starts at 1 to skip timeBar info
    for(let i = 1; i < jsonData["edges"].length; i++ ) {
      graphData["edges"].push(jsonData["edges"][i])
    }

    // push combo data to CyGraph combo data
    if (jsonData["combos"] !== undefined && jsonData["combos"].length > 0) {
      for(let i = 0; i < jsonData["combos"].length; i++ ) {
        // change type for combo model data to "cCircle" to use custom comboCircle features
        jsonData["combos"][i]["type"] = "cCircle";
        graphData["combos"].push(jsonData["combos"][i]);
      }
    }

    // CyGraph injects calculated information based on graphData back into it (i.e. coordinates)
    console.log('graphData =', graphData); 
    return graphData;
   }

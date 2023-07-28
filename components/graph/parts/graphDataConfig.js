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

    const circle = {  type: 'circle', 
                      size: 54, // this will be the default size of all the nodes
                      style: {
                      position: 'top',
                      stroke: '#5f6266',
                      fill: 'transparent',
                      lineWidth: 4,
                      } 
                    };
    
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
      // assign custom modeltype/shape to use
      node["type"] = 'circle';
      node["size"] = 24;
      const iconType = node["display"]["labels"][0];
      if (Object.keys(imageHash).includes(iconType)){
        // formating for the icon and the image to be displaye inside the node circle
        // node["img"] = imageHash[iconType];
        node = {...node, ...circle};
        node["icon"] = { 
                        show: true,
                        /* icon's img address, string type */
                        img: imageHash[iconType],
                        /* icon's size, 20 * 20 by default: */
                        width: 30,
                        height: 30,
                         };
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
        // assign custom modeltype/shape to use
        jsonData["combos"][i]["type"] = "cCircle";
        // push
        graphData["combos"].push(jsonData["combos"][i]);
      }
    }

    // CyGraph injects calculated information based on graphData back into it (i.e. coordinates)
    console.log('graphData =', graphData); 
    return graphData;
   }

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
      node["size"] = 46;
      const iconType = node["display"]["labels"][0];
      if (iconType){
        node["img"] = imageHash[iconType]
      } else {
        // set to questionmark icon
        node["img"] = imageURLs[24]
      }
    })  
    
    // convert the epoch MS times in dates of edges to secs time
    jsonData.edges.forEach((edge) => {
      for(let i = 0; i < edge.date.length; i ++) {
        edge["date"][i] = Math.floor(edge["date"][i] / 1000);
      }
      // edge.date.forEach((time) => {
      //   time = Math.floor(time/1000);
      // })
    })
    return jsonData;
   }
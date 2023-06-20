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
      node["size"] = 24;
      const iconType = node["display"]["labels"][0];
      if (iconType){
        node["img"] = imageHash[iconType]
      } else {
        // set to questionmark icon
        node["img"] = imageURLs[24]
      }
    })  
    
/*     jsonData.edges.forEach((edge) => {
      edge.date.forEach((time) => {
        const bar = time / 1000;
        time = bar;  
      })
    })  
 */
    console.log('jsonData =', jsonData);
    return jsonData;
   }

/*    export function getAxisMinMax(jsonData) {
    const epochTimes = []
    // draw out all time values to find start and end of axis
    jsonData.edges.forEach((edge) => {
      edge.date.forEach((x)=> {
        epochTimes.push(x)
      })
    })
    epochTimes.sort((a,b) => a - b);
    const lastIndx = epochTimes.length - 1;
    const result = [epochTimes[0], epochTimes[lastIndx]];
    return result;
   } */
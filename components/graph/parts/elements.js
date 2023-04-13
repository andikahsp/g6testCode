// The symbol for the marker inside the combo holding the nodecount 
export const circleIcon = (x, y, r) => {
return [
    ['M', x - r, y],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x - r + 4, y],
];
};

/* style: {
    position:'bottom',
    stroke: 'gray',
    fill: 'transparent',
    lineWidth: 1.5,
  } */

export const cCircleComboShape = {
    drawShape: function draw(cfg, group) {
      // Get the shape style, where the style.r corresponds to the R in the Illustration of Built-in Rect Combo
      const style = cfg.style
      // Add a circle shape as keyShape which is the same as the extended 'circle' type Combo
      const circle = group.addShape('circle', {
        attrs: {
          ...style,
          x: 0,
          y: 0,
          r: style.r,
        },
        draggable: true,
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'combo-keyShape',
      });
      // Add the marker
      group.addShape('marker', {
        attrs: {
          ...style,
          opacity: 1,
          x: 0,
          y: style.r,
          r: 15,
          symbol: circleIcon,
          fill: '#FDFD96',
          stroke: 'grey',
        },
        draggable: true,
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'combo-marker-shape',
      });
      // text that goes into the marker/badge
      group.addShape('text', {
        attrs: {
            text:cfg.label,
            x: style.r - 1,
            y: style.r,
            fontFamily: 'Arial',
            fontSize: 19,
            fill: 'black',
            stroke: 'grey',
        },
        draggable: true, 
        name: 'combo-marker-label'
      });
      return circle;
    },
    // Define the updating logic for the marker
    afterUpdate: function afterUpdate(cfg, combo) {
      const self = this;
      // Get the shape style, where the style.r corresponds to the R in the Illustration of Built-in Rect Combo
      const style = self.getShapeStyle(cfg);
      const group = combo.get('group');
      // Find the marker shape in the graphics group of the Combo
      const marker = group.find((ele) => ele.get('name') === 'combo-marker-shape');
      //Find textLabel shape in the graphics group of the Combo
      const textLabel = group.find((ele) => ele.get('name') === 'combo-marker-label');

      // Update the marker shape
      marker.attr({
        x: style.r * 0.50,
        y: (style.r - 10) * - 1,
      });
      //Update the textlabel
      textLabel.attr({
        text: cfg.label,
        x: style.r * 0.50 - 5, 
        y: (style.r - 20) * - 1,
      });
    },
  }; 

  export const fundPolyline = {
    itemType: 'edge',
    draw: function draw(cfg, group) {

      const startPoint = cfg.startPoint;
      const endPoint = cfg.endPoint;          
      const stroke = cfg.style.stroke;
      //const stroke = (cfg.style && cfg.style.stroke) || this.options.style.stroke;

      const style = cfg.style; 

      let path = [
        ['M', startPoint.x, startPoint.y],
        ['L', endPoint.x, endPoint.y],
      ];
  
      const endArrow = cfg?.style && cfg.style.endArrow ? cfg.style.endArrow : false;
      //if (isObject(endArrow)) endArrow.fill = stroke; // isObject: G6 function
      
      const line = group.addShape('path', {
        attrs: {
          stroke,
          path,
          endArrow,
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'path-shape',
      });

      const midPointXY = {       
        x: (endPoint.x - startPoint.x) / 2,
        y: (endPoint.y - startPoint.y) / 2
      }

      const markerXOffset = 10;
      const markerYOffset = -15;
      const freqMarkerOffset = 15;
      let ttpMarkerOffset = 0 /* 30 */;


      if (cfg.ttp === true) {

        // distance in pixels that edge frequency marker and message label needs to move to the right
        ttpMarkerOffset = 18;


        // TTP: Add the circular marker on the bottom
        group.addShape('marker', {
          attrs: {
            ...style,
            opacity: 1,
            x: startPoint.x + midPointXY.x + markerXOffset,
            y: startPoint.y + midPointXY.y + markerYOffset - 1.5,
            r: 10,
            symbol: circleIcon,
            fill: 'orange',
            stroke: 'black',
            strokeWidth: 3.5,
            lineWidth: 1.5,
          },
          draggable: true,
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: 'edge-ttp-shape',
        });   

        // TTP -text
        group.addShape('text', {
          attrs: {
            text: 'T',
            x: startPoint.x + midPointXY.x + markerXOffset - 4.85,
            y: startPoint.y + midPointXY.y + markerYOffset,
            fontFamily: 'Arial',
            fontWeight: "bold",
            fontSize: 14.5,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: 'white',
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: 'edge-ttp-text',
        });

        const ttpLabel = group.find((ele) => ele.get('name') === 'edge-ttp-text')
      ttpLabel.toFront();
      }
     
      if (cfg.frequency !== undefined) {
        // FREQUENCY Add the circular marker on the bottom
        group.addShape('marker', {
          attrs: {
            ...style,
            opacity: 1,
            x: startPoint.x + midPointXY.x + markerXOffset + ttpMarkerOffset,
            y: startPoint.y + midPointXY.y + markerYOffset - 1.5,
            r: 10,
            symbol: circleIcon,
            fill: '#63666A',
            stroke: 'black',
            strokeWidth: 3.5,
            lineWidth: 1.5,
          },
          draggable: true,
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: 'edge-frequency-shape',
        });   

        // freqency -text 
        group.addShape('text', {
          attrs: {
            text: cfg && cfg.frequency,
            x: startPoint.x + midPointXY.x + markerXOffset + ttpMarkerOffset - 3.5,
            y: startPoint.y + midPointXY.y + markerYOffset,
            fontSize: 14,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: 'white',
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: 'edge-frequency-text',
        });
        const frequencyLabel = group.find((ele) => ele.get('name') === 'edge-frequency-text')
        frequencyLabel.toFront();
      }


      // event
      group.addShape('text', {
        attrs: {
          text: cfg && cfg.event,
          x: startPoint.x + midPointXY.x + markerXOffset + freqMarkerOffset + ttpMarkerOffset,
          y: startPoint.y + midPointXY.y + markerYOffset,
          fontSize: 12,
          fontWeight: 300,
          textAlign: 'left',
          textBaseline: 'middle',
          fill: '#000000D9',
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'edge-event-text',
      });
           
      return line;
    },
  };


  export const customQuadratic =  {
    afterDraw(cfg, group) { 

      // get the first shape in the graphics group of this edge, it is the path of the edge here
      const shape = group.get('children')[0];
      // get the coordinate of the mid point on the path
      const midPointXY = shape.getPoint(0.5);
      
      const markerXOffset = 0;
      const markerYOffset = 0;
      const labelXOffset = 15;
      let ttpMarkerOffset = 0;

    if (cfg.ttp === true) {

      // distance in pixels that edge frequency marker and message label needs to move to the right
      ttpMarkerOffset = 18;

      // TTP: Add the circular marker on the bottom
      group.addShape('marker', {
        attrs: {
          ...style,
          opacity: 1,
          x: midPointXY.x + markerXOffset,
          y: midPointXY.y + markerYOffset - 1.5,
          r: 10,
          symbol: circleIcon,
          fill: 'orange',
          stroke: 'black',
          strokeWidth: 3.5,
          lineWidth: 1.5,
        },
        draggable: true,
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'quadcurve-ttp-shape',
      });   

      // TTP -text
      group.addShape('text', {
        attrs: {
          text: 'T',
          x: midPointXY.x + markerXOffset - 4.85,
          y: midPointXY.y + markerYOffset,
          fontFamily: 'Arial',
          fontWeight: "bold",
          fontSize: 14.5,
          textAlign: 'left',
          textBaseline: 'middle',
          fill: 'white',
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'quadcurve-ttp-text',
      });

      const ttpLabel = group.find((ele) => ele.get('name') === 'quadcurve-ttp-text')
      ttpLabel.toFront();
    }
   
    if (cfg.frequency !== undefined) {
      // FREQUENCY Add the circular marker on the bottom
      group.addShape('marker', {
        attrs: {
          ...style,
          opacity: 1,
          x: midPointXY.x + markerXOffset + ttpMarkerOffset,
          y: midPointXY.y + markerYOffset - 1.5,
          r: 10,
          symbol: circleIcon,
          fill: '#63666A',
          stroke: 'black',
          strokeWidth: 3.5,
          lineWidth: 1.5,
        },
        draggable: true,
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'quadcurve-frequency-shape',
      });   

      // freqency -text 
      group.addShape('text', {
        attrs: {
          text: cfg && cfg.frequency,
          x: midPointXY.x + markerXOffset + ttpMarkerOffset - 3.5,
          y: midPointXY.y + markerYOffset,
          fontSize: 14,
          textAlign: 'left',
          textBaseline: 'middle',
          fill: 'white',
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'quadcurve-frequency-text',
      });
      const frequencyLabel = group.find((ele) => ele.get('name') === 'quadcurve-frequency-text')
      frequencyLabel.toFront();
    }


    // event
    group.addShape('text', {
      attrs: {
        text: cfg && cfg.event,
        x: midPointXY.x + markerXOffset + labelXOffset + ttpMarkerOffset,
        y: midPointXY.y + markerYOffset,
        fontSize: 12,
        fontWeight: 300,
        textAlign: 'left',
        textBaseline: 'middle',
        fill: '#000000D9',
      },
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: 'quadcurve-event-text',
    });
    },
    update: undefined,
  };

// The symbol for the marker inside the combo holding the nodecount 
export const circleIcon = (x, y, r) => {
return [
    ['M', x - r, y],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x - r + 4, y],
];
};


/* config for all combos */
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

    // **** DIAGNOSTIC ID LABEL
    group.addShape('text', {
      attrs: {
          text:cfg.label || cfg.id,
          x: style.r * 0.50 + 20, 
          y: (style.r - 20) * - 1,
          fontFamily: 'Arial',
          fontSize: 15,
          fill: 'black',
          stroke: 'grey',
      },
      draggable: true, 
      name: 'combo-id-label'
    });

    // Add the badge shape
    group.addShape('marker', {
      attrs: {
        ...style,
        opacity: 1,
        x: 0,
        y: style.r,
        r: 13,
        symbol: circleIcon,
        fill: 'red',
        stroke: 'black',
      },
      draggable: true,
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: 'combo-marker-shape',
    });
    // text that goes into the marker/badge
    group.addShape('text', {
      attrs: {
          text:cfg.nodeCount,
          x: style.r - 1,
          y: style.r,
          fontFamily: 'Arial',
          fontSize: 19,
          fill: 'white',
          stroke: 'white',
      },
      draggable: true, 
      name: 'combo-marker-nodeCount'
    });

    let badgeFillColor = 'transparent';
    let badgeStrokeColor = 'transparent';
    let textFillColor = 'transparent';
    let textStrokeColor = 'transparent';

    if(cfg.ioc !== undefined && cfg.ioc) {
      badgeFillColor = 'orange';
      badgeStrokeColor = 'black';
      textFillColor = 'white';
      textStrokeColor = 'white';
    }

    // because iocBadge must !== null, when creating Combo & when adding or deleting nodes, 
    // we must draw the shape first, and then only change colors according to state. 
    // Add the IOC badge shape
    group.addShape('marker', {
      attrs: {
        ...style,
        opacity: 1,
        x: 0 - 25,
        y: 0 + (-1 * style.r + 5) ,
        r: 10,
        symbol: circleIcon,
        fill: badgeFillColor,
        stroke: badgeStrokeColor,
        lineWidth: 2
      },
      draggable: true,
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: 'combo-ioc-badge',
    });
    // text that goes into the marker/badge
    group.addShape('text', {
      attrs: {
          text:"I", //<--- change text here
          x: 0  - 28,
          y: 0 + (-1 * style.r + 14),
          fontFamily: 'TimesNewRoman',
          fontSize: 17,
          fill: textFillColor,
          stroke: textStrokeColor,
      },
      draggable: true, 
      name: 'combo-ioc-glyph-text'
    });
    return circle;
  },

  // Define the updating logic for the marker (after Collapsed)
  afterUpdate: function afterUpdate(cfg, combo) {
    const self = this;
    // Get the shape style, where the style.r corresponds to the R in the Illustration of Built-in Rect Combo
    const style = self.getShapeStyle(cfg);
    const group = combo.get('group');

    // Find the comboKeyShape in the graphics group of the Combo
    const comboShape = group.find((ele) => ele.get('name') === 'combo-keyShape');
    // Find the marker shape in the graphics group of the Combo
    const marker = group.find((ele) => ele.get('name') === 'combo-marker-shape');
    // Find textLabel shape in the graphics group of the Combo
    const textLabel = group.find((ele) => ele.get('name') === 'combo-marker-nodeCount');
    // Find comboId shape in the graphics group of the Combo
    const idLabel = group.find((ele) => ele.get('name') === 'combo-id-label');
    // Find ioc badge shape 
    const iocBadge = group.find((ele) => ele.get('name') === 'combo-ioc-badge');
    // Find ioc glyph text
    const iocText = group.find((ele) => ele.get('name') === 'combo-ioc-glyph-text');
    // colors if ioc is false; 
    let badgeFillColor = 'transparent';
    let badgeStrokeColor = 'transparent';
    let textFillColor = 'transparent';
    let textStrokeColor = 'transparent';

    // Update the comboKeyShape
    comboShape.attr({
      fill: cfg.collapsed ? 'white' : 'transparent',
      r: cfg.collapsed ? 28 : style.r,
      lineWidth: cfg.collapsed ? 4 : 1 
    });
    // Update the marker shape
    marker.attr({
      x: style.r * 0.50,
      y: (style.r - 10) * - 1,
    });
    //Update the textlabel
    textLabel.attr({
      text: cfg.nodeCount,
      x: cfg.nodeCount.toString().length === 1 ? style.r * 0.50 - 5.63 : style.r * 0.50 - 10, 
      y: (style.r - 20) * - 1,
    });
    //Update the idlabel
    idLabel.attr({
      text: cfg.id,
      x: style.r * 0.50 + 20, 
      y: (style.r - 20) * - 1,
    });

    if(cfg.ioc !== undefined && cfg.ioc) {
      badgeFillColor = 'orange';
      badgeStrokeColor = 'black';
      textFillColor = 'white';
      textStrokeColor = 'white';
    }
      // update the ioc badge position when the combo is expanded
      iocBadge.attr({
        x: style.r * 0.50 * -1, 
        y: (style.r - 10) * - 1,
        fill: badgeFillColor,
        stroke: badgeStrokeColor,
      })
      // update the ioc glyph text position when the combo is expanded
      iocText.attr({
        x: (style.r * 0.50 * -1 ) - 3,
        y: ((style.r - 10) * -1 ) + 9,
        fill: textFillColor,
        stroke: textStrokeColor,
      })

  },
}; 

/* config for all nodes */
export const circleNodeShape = {

  draw: function draw(cfg, group) {
    // Get the shape style, where the style.r corresponds to the R in the Illustration of Built-in Rect Combo
    const style = cfg.style;
    // Add a circle shape as keyShape which is the same as the extended 'circle' type Combo
    const nodeCircle = group.addShape('circle', {
      attrs: {
        ...style,
        x: 0,
        y: 0,
        r: cfg.size / 2,
        symbol:circleIcon
      },
      draggable: true,
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: 'node-keyShape',
    });;

    // DIAGNOSTIC LABEL for Node!
/*     group.addShape('text', {
      attrs: {
        text:cfg.label,
        x: cfg.size / 2 * 0.50 + 20, 
        y: (cfg.size / 2 - 20) * - 1,
        fontFamily: 'Arial',
        fontSize: 15,
        fill: 'black',
        stroke: 'grey',
      },
      draggable: true, 
      name: 'node-id-label'
    }); */

    if(cfg.ioc !== undefined && cfg.ioc) {
      // Add the IOC badge shape
      group.addShape('marker', {
        attrs: {
          ...style,
          opacity: 1,
          x: 0 - 25,
          y: 0 + (-1 * cfg.size / 2 + 5) ,
          r: 10,
          symbol: circleIcon,
          fill: 'orange',
          stroke: 'black',
          lineWidth: 2
        },
        draggable: true,
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'node-ioc-badge',
      });
      // text that goes into the marker/badge
      group.addShape('text', {
        attrs: {
            text:"I", //<--- change text here
            x: 0 - 28,
            y: 0 + (-1 * cfg.size / 2 + 14),
            fontFamily: 'TimesNewRoman',
            fontSize: 17,
            fill: 'white',
            stroke: 'white',
        },
        draggable: true, 
        name: 'node-ioc-glyph-text'
      });
    }
    return nodeCircle;
  },
}

/* config for standard edges and vEdges */
export const fundPolyline = {
  // itemType: 'edge',
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
    
    const line2 = group.addShape('path', {
      attrs: {
        lineWidth: 2, // for all standard Edges
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
    let freqMarkerOffset = 0;
    let ttpMarkerOffset = 0 /* 30 */;


    if (cfg.ttp) {

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
    
    if (cfg.frequency !== undefined && cfg.frequency > 1) {
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

      const freqTextXCoord = startPoint.x + midPointXY.x + markerXOffset + ttpMarkerOffset - 3.5;
      // freqency -text 
      group.addShape('text', {
        attrs: {
          text: cfg && cfg.frequency,
          x: cfg.frequency.toString().length === 1 ? freqTextXCoord : freqTextXCoord - 3.5,
          y: startPoint.y + midPointXY.y + markerYOffset - 1,
          fontSize: 14,
          textAlign: 'left',
          textBaseline: 'middle',
          fill: 'white',
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'edge-frequency-text',
      });
      freqMarkerOffset = 15;
      const frequencyLabel = group.find((ele) => ele.get('name') === 'edge-frequency-text')
      frequencyLabel.toFront();
    }
    // label
    group.addShape('text', {
      attrs: {
        text: cfg && cfg.label,
        x: startPoint.x + midPointXY.x + markerXOffset + freqMarkerOffset + ttpMarkerOffset,
        y: startPoint.y + midPointXY.y + markerYOffset,
        fontSize: 12,
        fontWeight: 300,
        textAlign: 'left',
        textBaseline: 'middle',
        fill: '#000000D9',
      },
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: 'edge-label-text',
    });
    return line2;
  },
};



/* config for parallel edges */
export const customQuadratic =  {
  afterDraw(cfg, group) { 
    const style = cfg.style

    // get the first shape in the graphics group of this edge, it is the path of the edge here
    const shape = group.get('children')[0];
    // get the coordinate of the mid point on the path
    const midPointXY = shape.getPoint(0.5);
    
    const markerXOffset = 0;
    const markerYOffset = 0;
    const labelXOffset = -35;
    const labelYOffSet = 0;
    let ttpMarkerOffset = 0;

  if (cfg.ttp) {

    // distance in pixels that edge frequency marker and message label needs to move to the right
    ttpMarkerOffset = 18;

    // TTP: Add the circular marker on the bottom
    group.addShape('marker', {
      attrs: {
        ...style,
        opacity: 1,
        x: midPointXY.x + markerXOffset + labelXOffset,
        y: midPointXY.y + markerYOffset - 1.5 + labelYOffSet,
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
        x: midPointXY.x + markerXOffset - 4.85 + labelXOffset,
        y: midPointXY.y + markerYOffset + labelYOffSet,
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
  
  if (cfg.frequency !== undefined && cfg.frequency > 1) {
    // FREQUENCY Add the circular marker on the bottom
    group.addShape('marker', {
      attrs: {
        ...style,
        opacity: 1,
        x: midPointXY.x + markerXOffset + ttpMarkerOffset + labelXOffset,
        y: midPointXY.y + markerYOffset - 1.5 + labelYOffSet,
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

    const freqTextXCoord =  midPointXY.x + markerXOffset + ttpMarkerOffset - 3.5 + labelXOffset;
      
    // freqency -text 
    group.addShape('text', {
      attrs: {
        text: cfg && cfg.frequency,
        x: cfg.frequency.toString().length === 1 ? freqTextXCoord : freqTextXCoord - 4 + labelXOffset,
        y: midPointXY.y + markerYOffset - 1 + labelYOffSet,
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

  // label - original font label config
  // group.addShape('text', {
  //   attrs: {
  //     text: cfg && cfg.label,
  //     x: midPointXY.x + markerXOffset + labelXOffset + ttpMarkerOffset,
  //     y: midPointXY.y + markerYOffset,
  //     fontSize: 12,
  //     fontWeight: 300,
  //     textAlign: 'left',
  //     textBaseline: 'middle',
  //     fill: '#000000D9',
  //   },
  //   // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
  //   name: 'quadcurve-label-text',
  // });
  },
  update: undefined
  // update(cfg, edge) {
  //   const self = this; 
  //   const style = self.getShapeStyle(cfg);
  //   const group = edge.get('group');

  //   const edgeShape = group.find((ele) => ele.get('name') === 'edge-shape');
  //   console.log('this edge', this);
  //   console.log('edgeShape', edgeShape);
  //   console.log('group:', group);
  // }
};




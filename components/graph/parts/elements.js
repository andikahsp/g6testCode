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
      const style = {
        position:'bottom',
        stroke: 'grey',
        fill: 'transparent',
        lineWidth: 1.5,
      };
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
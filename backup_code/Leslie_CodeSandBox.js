import G6 from "@antv/g6";
import { isObject } from "@antv/util";
const timeBarData = [];
const container = document.getElementById("container");
const width = container.scrollWidth;
const height = (container.scrollHeight || 500) - 100;

let style = {};
let nodeA = "";
let nodeB = "";
let selectedComboId = undefined;

let nodeDrag = false;
let comboDragEnter = false;
let comboDragLeave = false;
for (let i = 0; i < 20; i++) {
  timeBarData.push({
    date: `2020${i}`,
    value: Math.round(1)
  });
}
const data = {
  nodes: [
    {
      id: "cyv-node-002",
      computerName: "L3-DC10.stella.local",
      nodeType: "Process",
      processName: "\\Windows\\explorer.exe",
      ipAddress: "",
      label: "explorer.exe",
      date: "20205",
      isLeaf: true,
      description:
        "processName:Explorer.exe<br>ComputerName:L3-DC10.stella.local",
      size: 80,
      x: "101.8189855786822",
      y: "210.5346619200522",
      comboId: "combo0"
    },
    {
      id: "cyv-node-003",
      computerName: "L3-DC10.stella.local",
      nodeType: "Process",
      processName:
        "\\Program Files\\Microsoft Office\\Root\\Office16\\WINWORD.EXE",
      ipAddress: "",
      label: "WINWORD.exe",
      date: "20206",
      type: "background-animate",
      isLeaf: true,
      description:
        "processName:WINWORD.exe<br>ComputerName:L3-DC10.stella.local",
      size: 80,
      x: "63.91139710953624",
      y: "78.35281950419477",
      comboId: "combo0"
    },
    {
      id: "cyv-node-004",
      computerName: "L3-DC10.stella.local",
      node_type: "Process",
      processName:
        "\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
      ipAddress: "",
      label: "powershell.exe",
      date: "20207",
      isLeaf: true,
      x: "501.74519938802945",
      y: "332.62044406339464",
      comboId: "combo1"
    },
    {
      id: "cyv-node-005",
      computerName: "",
      nodeType: "IP",
      processName: "",
      ipAddress: "192.168.7.27",
      type: "diamond",
      label: "192.168.7.27",
      date: "20208",
      isLeaf: true,
      x: "602.0599675780023",
      y: "-13.053216483101235",
      comboId: "combo2"
    },
    {
      id: "cyv-node-006",
      computerName: "",
      nodeType: "IP",
      processName: "",
      ipAddress: "13.13.13.10",
      type: "diamond",
      label: "13.13.13.10",
      date: "20205",
      x: "851.1608532110591",
      y: "246.533719587319"
    }
    // {
    //   id: "cyv-node-007",
    //   computerName: "",
    //   nodeType: "IP",
    //   processName: "",
    //   ipAddress: "13.13.13.10",
    //   type: "diamond",
    //   label: "13.13.13.10",
    //   date: "20205",
    //   cluster: "1"
    // }
  ],
  edges: [
    {
      id: "cyv-edge-002",
      source: "cyv-node-002",
      target: "cyv-node-003",
      event: "create",
      description: "TTP:5541",
      ttp: true
    },
    {
      id: "cyv-edge-003",
      source: "cyv-node-003",
      target: "cyv-node-004",
      description: "TTP:beari",
      frequency: "2",
      event: "create",
      ttp: true
    },
    {
      id: "cyv-edge-004",
      source: "cyv-node-004",
      target: "cyv-node-005",
      relation: "Binds",
      frequency: "80",
      event: "bind",
      ttp: true
    },
    {
      id: "cyv-edge-005",
      source: "cyv-node-004",
      target: "cyv-node-006",
      relation: "Connects To",
      event: "Connects To",
      ttp: true
    },
    {
      id: "cyv-edge-006",
      source: "cyv-node-005",
      target: "cyv-node-006",
      relation: "Connects To",
      label: "Connects To",
      frequency: "4",
      event: "Connects To",
      ttp: true
    }
    // {
    //   id: "cyv-edge-007",
    //   source: "cyv-node-005",
    //   target: "cyv-node-003",
    //   relation: "Connects To",
    //   event: "Connects To",
    //   ttp: true
    // }
    // {
    //   id: "cyv-edge-008",
    //   source: "combo1",
    //   target: "cyv-node-005",
    //   relation: "Connects To",
    //   label: "Connects To",
    //   data: {
    //     count: "20",
    //     text: "Connects To"
    //   }
    // }
  ],
  combos: [
    {
      id: "combo0",
      // label: "L3-DC10",
      label: "2"

      // date: "20208"
    },
    {
      id: "combo1"
    },
    {
      id: "combo2",
      parentId: "combo0"
    }
  ]
};
const timebar = new G6.TimeBar({
  x: 0,
  y: 0,
  width,
  height: 150,
  padding: 10,
  type: "trend",
  trend: {
    data: timeBarData
  }
});

// constrained the layout inside the area
const constrainBox = { x: 10, y: 10, width: 580, height: 450 };

const onTick = () => {
  let minx = 99999999;
  let maxx = -99999999;
  let miny = 99999999;
  let maxy = -99999999;
  let maxsize = -9999999;
  data.nodes.forEach((node) => {
    if (minx > node.x) {
      minx = node.x;
    }
    if (maxx < node.x) {
      maxx = node.x;
    }
    if (miny > node.y) {
      miny = node.y;
    }
    if (maxy < node.y) {
      maxy = node.y;
    }
  });
  const scalex = (constrainBox.width - nodeSize / 2) / (maxx - minx);
  const scaley = (constrainBox.height - nodeSize / 2) / (maxy - miny);
  data.nodes.forEach((node) => {
    node.x = (node.x - minx) * scalex + constrainBox.x;
    node.y = (node.y - miny) * scaley + constrainBox.y;
  });
};
const tooltip = new G6.Tooltip({
  offsetX: 10,
  offsetY: 10,
  // v4.2.1 起支持配置 trigger，click 代表点击后出现 tooltip。默认为 mouseenter
  trigger: "click",
  // the types of items that allow the tooltip show up
  // 允许出现 tooltip 的 item 类型
  itemTypes: ["node", "edge"],
  // custom the tooltip's content
  // 自定义 tooltip 内容
  getContent: (e) => {
    const outDiv = document.createElement("div");
    outDiv.style.width = "fit-content";
    //outDiv.style.padding = '0px 0px 20px 0px';
    outDiv.innerHTML = `
    <h2>${e.item.getModel().id}<h4>${
      e.item.getModel().description || ""
    } </h4?`;
    // <ul>
    //   <li>description: ${e.item.getModel().description}</li>
    // </ul>`;
    return outDiv;
  }
});

const legendD = {
  nodes: [
    {
      id: "type1",
      label: "Processes",
      style: {
        fill: "#9EC9FF"
      }
    },
    {
      id: "type2",
      label: "IP Address",
      type: "diamond",
      style: {
        fill: "#9EC9FF"
      }
    }
  ]
};
G6.registerNode(
  "background-animate",
  {
    afterDraw(cfg, group) {
      const r = cfg.size / 2;
      const back1 = group.addShape("circle", {
        zIndex: -3,
        attrs: {
          x: 0,
          y: 0,
          r,
          fill: cfg.color,
          opacity: 0.6
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: "back1-shape"
      });
      const back2 = group.addShape("circle", {
        zIndex: -2,
        attrs: {
          x: 0,
          y: 0,
          r,
          fill: cfg.color,
          opacity: 0.6
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: "back2-shape"
      });
      const back3 = group.addShape("circle", {
        zIndex: -1,
        attrs: {
          x: 0,
          y: 0,
          r,
          fill: cfg.color,
          opacity: 0.6
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: "back3-shape"
      });
      group.sort(); // Sort according to the zIndex
      back1.animate(
        {
          // Magnifying and disappearing
          r: r + 10,
          opacity: 0.1
        },
        {
          duration: 3000,
          easing: "easeCubic",
          delay: 0,
          repeat: true // repeat
        }
      ); // no delay
      back2.animate(
        {
          // Magnifying and disappearing
          r: r + 10,
          opacity: 0.1
        },
        {
          duration: 3000,
          easing: "easeCubic",
          delay: 1000,
          repeat: true // repeat
        }
      ); // 1s delay
      back3.animate(
        {
          // Magnifying and disappearing
          r: r + 10,
          opacity: 0.1
        },
        {
          duration: 3000,
          easing: "easeCubic",
          delay: 2000,
          repeat: true // repeat
        }
      ); // 3s delay
    }
  },
  "circle"
);
G6.registerEdge("fund-polyline", {
  itemType: "edge",
  draw: function draw(cfg, group) {
    const startPoint = cfg.startPoint;
    const endPoint = cfg.endPoint;
    const stroke = cfg.style.stroke;
    // const stroke = (cfg.style && cfg.style.stroke) || this.options.style.stroke;
    let path = [
      ["M", startPoint.x, startPoint.y],
      ["L", endPoint.x, endPoint.y]
    ];
    const endArrow =
      cfg?.style && cfg.style.endArrow ? cfg.style.endArrow : false;
    if (isObject(endArrow)) endArrow.fill = stroke;
    const line = group.addShape("path", {
      attrs: {
        stroke: "FFF",
        path,
        endArrow
      },
      name: "path-shape"
    });
    const midPointXY = {
      x: (endPoint.x - startPoint.x) / 2,
      y: (endPoint.y - startPoint.y) / 2
    };
    const markerXOffset = 10;
    const markerYOffset = -15;
    const freqMarkerOffset = 15;
    let ttpMarkerOffset = 30;
    if (cfg.ttp === true) {
      ttpMarkerOffset = 18;
      group.addShape("marker", {
        attrs: {
          ...style,
          opacity: 1,
          x: startPoint.x + midPointXY.x + markerXOffset,
          y: startPoint.y + midPointXY.y + markerYOffset - 1.5,
          r: 10,
          symbol: collapseIcon,
          fill: "orange",
          stroke: "black",
          strokeWidth: 3.5,
          lineWidth: 1.5
        },
        draggable: true,
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: "edge-ttp-shape"
      }); // TTP -text
      group.addShape("text", {
        attrs: {
          text: "T",
          x: startPoint.x + midPointXY.x + markerXOffset - 4.85,
          y: startPoint.y + midPointXY.y + markerYOffset,
          fontFamily: "Arial",
          fontWeight: "bold",
          fontSize: 14.5,
          textAlign: "left",
          textBaseline: "middle",
          fill: "white"
        }, // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: "edge-ttp-text"
      });
      const ttpLabel = group.find((ele) => ele.get("name") === "edge-ttp-text");
      ttpLabel.toFront();
    }
    if (cfg.frequency !== undefined) {
      // FREQUENCY Add the circular marker on the bottom
      group.addShape("marker", {
        attrs: {
          ...style,
          opacity: 1,
          x: startPoint.x + midPointXY.x + markerXOffset + ttpMarkerOffset,
          y: startPoint.y + midPointXY.y + markerYOffset - 1.5,
          r: 10,
          symbol: collapseIcon,
          fill: "#63666A",
          stroke: "black",
          strokeWidth: 3.5,
          lineWidth: 1.5
        },
        draggable: true,
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: "edge-frequency-shape"
      });
      // freqency -text
      group.addShape("text", {
        attrs: {
          text: cfg && cfg.frequency,
          x:
            startPoint.x + midPointXY.x + markerXOffset + ttpMarkerOffset - 3.5,
          y: startPoint.y + midPointXY.y + markerYOffset,
          fontSize: 14,
          textAlign: "left",
          textBaseline: "middle",
          fill: "white"
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: "edge-frequency-text"
      });
      const frequencyLabel = group.find(
        (ele) => ele.get("name") === "edge-frequency-text"
      );
      frequencyLabel.toFront();
    }
    // event
    group.addShape("text", {
      attrs: {
        text: cfg && cfg.event,
        x:
          startPoint.x +
          midPointXY.x +
          markerXOffset +
          freqMarkerOffset +
          ttpMarkerOffset,
        y: startPoint.y + midPointXY.y + markerYOffset,
        fontSize: 12,
        fontWeight: 300,
        textAlign: "left",
        textBaseline: "middle",
        fill: "#000000D9"
      }, // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: "edge-event-text"
    });
    return line;
  }
});

G6.registerEdge("testEdge", {
  itemType: "edge",
  draw: function draw(cfg, group) {
    const startPoint = cfg.startPoint;
    const endPoint = cfg.endPoint;

    const Ydiff = endPoint.y - startPoint.y;

    const slope = Ydiff !== 0 ? Math.min(500 / Math.abs(Ydiff), 20) : 0;
    const cpOffset = slope > 15 ? 0 : 16;
    const offset = Ydiff < 0 ? cpOffset : -cpOffset;

    const line1EndPoint = {
      x: startPoint.x + slope,
      y: endPoint.y + offset
    };
    const line2StartPoint = {
      x: line1EndPoint.x + cpOffset,
      y: endPoint.y
    };
    const controlPoint = {
      x:
        ((line1EndPoint.x - startPoint.x) * (endPoint.y - startPoint.y)) /
          (line1EndPoint.y - startPoint.y) +
        startPoint.x,
      y: endPoint.y
    };
    let path = [
      ["M", startPoint.x, startPoint.y],
      ["L", line1EndPoint.x, line1EndPoint.y],
      [
        "Q",
        controlPoint.x,
        controlPoint.y,
        line2StartPoint.x,
        line2StartPoint.y
      ],
      ["L", endPoint.x, endPoint.y]
    ];

    if (Math.abs(Ydiff) <= 5) {
      path = [
        ["M", startPoint.x, startPoint.y],
        ["L", endPoint.x, endPoint.y]
      ];
    }
    path = [
      ["M", startPoint.x, startPoint.y],
      ["L", endPoint.x, endPoint.y]
    ];

    const endArrow =
      cfg?.style && cfg.style.endArrow ? cfg.style.endArrow : false;

    const line = group.addShape("path", {
      attrs: {
        path,
        lineWidth: 1.2,
        stroke: "FFF",
        endArrow
      },
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: "path-shape"
    });
    const labelLeftOffset = 0;
    const labelTopOffset = 8;
    // if(typeof cfg?.data.text == 'undefined'){
    //   cfg.data.text = '';
    // }
    // amount
    const amount = group.addShape("text", {
      attrs: {
        text: cfg.data?.text || "hahaha",
        x: line2StartPoint.x + labelLeftOffset,
        y: endPoint.y - labelTopOffset - 2,
        fontSize: 14,
        textAlign: "left",
        textBaseline: "middle",
        fill: "#000000D9"
      },
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: "text-shape-amount"
    });
    // type
    group.addShape("text", {
      attrs: {
        text: cfg.data?.count,
        x: line2StartPoint.x + labelLeftOffset,
        y: endPoint.y - labelTopOffset - amount.getBBox().height - 2,
        fontSize: 10,
        textAlign: "left",
        textBaseline: "middle",
        fill: "#000000D9"
      },
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: "text-shape-type"
    });
    // date
    group.addShape("text", {
      attrs: {
        text: cfg.data && cfg.data.date,
        x: line2StartPoint.x + labelLeftOffset,
        y: endPoint.y + labelTopOffset + 4,
        fontSize: 12,
        fontWeight: 300,
        textAlign: "left",
        textBaseline: "middle",
        fill: "#000000D9"
      },
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: "text-shape-date"
    });
    return line;
  }
});
const collapseIcon = (x, y, r) => {
  return [
    ["M", x - r, y],
    ["a", r, r, 0, 1, 0, r * 2, 0],
    ["a", r, r, 0, 1, 0, -r * 2, 0],
    ["M", x - r + 4, y]
  ];
};
const expandIcon = (x, y, r) => {
  return [
    ["M", x - r, y],
    ["a", r, r, 0, 1, 0, r * 2, 0],
    ["a", r, r, 0, 1, 0, -r * 2, 0],
    ["M", x - r + 4, y],
    ["M", x - r + r, y - r + 4]
  ];
};

G6.registerCombo(
  "cCircle",
  {
    drawShape: function draw(cfg, group) {
      const self = this;
      // Get the shape style, where the style.r corresponds to the R in the Illustration of Built-in Rect Combo
      style = self.getShapeStyle(cfg);
      // Add a circle shape as keyShape which is the same as the extended 'circle' type Combo
      const circle = group.addShape("circle", {
        attrs: {
          ...style,
          x: 0,
          y: 0,
          r: style.r
        },
        draggable: true,
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: "combo-keyShape"
      });
      // Add the marker
      const marker = group.addShape("marker", {
        attrs: {
          ...style,
          opacity: 1,
          x: 0,
          y: style.r,
          r: 15,
          //symbol: collapseIcon,
          fill: "#FDFD96",
          stroke: "grey"
        },
        draggable: true,
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: "combo-marker-shape"
      });
      // text that goes into the marker/badge
      group.addShape("text", {
        attrs: {
          text: cfg.label,
          x: style.r - 1,
          y: style.r,
          fontFamily: "Arial",
          fontSize: 19,
          fill: "black",
          stroke: "grey"
        },
        draggable: true,
        name: "combo-marker-label"
      });
      return circle;
    },
    // Define the updating logic for the marker
    afterUpdate: function afterUpdate(cfg, combo) {
      const self = this;
      // Get the shape style, where the style.r corresponds to the R in the Illustration of Built-in Rect Combo
      const style = self.getShapeStyle(cfg);
      const group = combo.get("group");
      // Find the marker shape in the graphics group of the Combo
      const marker = group.find(
        (ele) => ele.get("name") === "combo-marker-shape"
      );
      //Find textLabel shape in the graphics group of the Combo
      const textLabel = group.find(
        (ele) => ele.get("name") === "combo-marker-label"
      );

      // Update the marker shape
      marker.attr({
        x: style.r * 0.5,
        y: (style.r - 10) * -1,
        // The property 'collapsed' in the combo data represents the collapsing state of the Combo
        // Update the symbol according to 'collapsed'
        symbol: cfg.collapsed ? expandIcon : collapseIcon
      });
      //Update the textlabel
      textLabel.attr({
        text: cfg.label,
        x: style.r * 0.5 - 5,
        y: (style.r - 20) * -1
      });
    }
  },
  "circle"
);
const legend = new G6.Legend({
  data: legendD
});
const graph = new G6.Graph({
  container: "container",
  width,
  height,
  groupByTypes: false,
  fitCenter: true,
  plugins: [tooltip, legend],
  layout: {
    // type:'force',
    preventOverlap: false,
    nodeSize: 120,
    nodeSpacing: 120,
    equidistant: true,
    workerEnabled: true
  },
  modes: {
    default: [
      {
        type: "create-edge",
        key: "shift"
      },
      "drag-canvas",
      "zoom-canvas",
      "drag-node",
      "drag-combo",
      {
        type: "collapse-expand-combo",
        trigger: "click",
        relayout: false // do not relayout after collapsing or expanding
      },
      "collapse-expand-combo"
    ]
  },
  defaultNode: {
    size: 80,
    // color: "#5B8FF9",
    style: {
      fill: "#9EC9FF",
      lineWidth: 3
    },
    labelCfg: {
      style: {
        // fill: "#fff",
        color: "#000",
        fontSize: 14,
        position: "bottom"
      }
    }
  },
  defaultEdge: {
    type: "fund-polyline"
    // style: {
    // offset: 10,
    // radius: 20,
    // stroke: "#F6BD16",
    // lineWidth: 2,
    // endArrow: true
    // }
  },
  defaultCombo: {
    type: "cCircle",
    size: [10], // The minimum size of the Combo
    padding: 60,
    style: {
      position: "bottom",
      stroke: "gray",
      fill: "transparent",
      lineWidth: 1.5
    },
    labelCfg: {
      style: {
        position: "bottom",
        fill: "transparent",
        fontFamily: "Arial",
        fontSize: 11
      }
    }
  },
  comboStateStyles: {
    dragenter: {
      lineWidth: 4,
      stroke: "#FE9797"
    }
  },
  nodeStateStyles: {
    highlight: {
      opacity: 1
    }
  }
});

graph.data(data);
graph.render();

const edges = graph.getEdges();
edges.forEach(function (edge) {
  const line = edge.getKeyShape();
  const stroke = line.attr("stroke");
  const targetNode = edge.getTarget();
  targetNode.update({
    style: {
      stroke
    }
  });
});
graph.paint();

graph.on("aftercreateedge", (e) => {
  const edges = graph.save().edges;
  G6.Util.processParallelEdges(edges);
  graph.getEdges().forEach((edge, i) => {
    graph.updateItem(edge, {
      curveOffset: edges[i].curveOffset,
      curvePosition: edges[i].curvePosition
    });
  });
});

//focus on node when click
// graph.on("node:click", function (event) {
//   const { item } = event;
//   console.log(item.x);
//   graph.focusItem(item, true);
// });

// remove node on dblclick
// graph.on("node:dblclick", function (event) {
//   // const { item } = event;
//   // console.log(item.x);
//   // graph.removeItem(item, true);
//   const nodes = graph.getNodes();
//   console.log(nodes);
//   const edges = graph.getEdges();
//   console.log(edges);
//   // graph.fitView(0,{});
//   // graph.render();
// });

//dblclick canvas to "search" for word focus and update color of the node
graph.on("canvas:dblclick", function (event) {
  // const item = graph.findById("cyv-node-004");
  let test = graph.findById("cyv-edge-002");
  graph.updateItem(test, { ttp: "false" });
  const nodeList = graph.getNodes();
  const search = "WINWORD.exe";
  for (let i = 0; i < nodeList.length; i++) {
    if (nodeList[i].getModel().label == search) {
      nodeList[i].setState("selected", true);
      // graph.zoomTo(0.5,nodeList[i]);
      graph.focusItem(nodeList[i], true);
      // graph.zoomTo(2,nodeList[i]);
      setTimeout(() => {
        nodeList[i].setState("selected", false);
      }, 500);
      setTimeout(() => {
        nodeList[i].setState("selected", true);
      }, 1000);
      setTimeout(() => {
        nodeList[i].setState("selected", false);
      }, 1500);
      break;
    }
  }
  // console.log(item);
  // console.log(item.getModel().label)
  // graph.refreshItem(item)
  // graph.focusItem(item, true);
});
/* *************** MOUSE EVENTS ************** */
graph.on("node:mouseenter", (e) => {
  //console.log('node:mouseenter e =', e);
  graph.setItemState(e.item, "hover", true);
  nodeA = e.item._cfg.id; // have to find some other way to assign this
});

graph.on("node:mouseleave", (e) => {
  graph.setItemState(e.item, "hover", false);
});

graph.on("node:mouseup", (e) => {
  comboDragEnter = false;
  comboDragLeave = false;
  graph.setItemState(e.item, "hover", false);
});

graph.on("node:drag", (e) => {
  nodeDrag = true;
});

// check that the node that is being dragged, does not have a  comboId,
graph.on("node:dragenter", (e) => {
  // console.log("node:dragenter");
  const nodeBModel = e.item._cfg.model;
  nodeB = e.item._cfg.id;
  let nodeAModel = {};
  graph.getNodes().forEach((node) => {
    if (node._cfg.id === nodeA) {
      nodeAModel = node._cfg.model;
      // console.log(`nodeAModel ID = ${nodeAModel.id}`);
    }
  });
  //console.log(nodeAModel);
  //console.log(nodeBModel);

  if (
    ("comboId" in nodeBModel !== true || nodeBModel.comboId === undefined) &&
    ("comboId" in nodeAModel !== true || nodeAModel.comboId === undefined)
  ) {
    // if it has a comboId, do not create combo
    if (nodeA !== "" && nodeB !== nodeA) {
      console.log(`CREATING NEW COMBO (selected item = ${e.item._cfg.id})`);
      console.log(`nodeA = ${nodeA}`);
      console.log(`nodeB = ${nodeB}`);
      const count = graph.getCombos().length;
      const last = graph.getCombos()[count - 1].getID().substring(5);
      const newComboId = `combo${parseInt(last) + 1}`;
      graph.createCombo(
        {
          id: newComboId,
          label: ""
        },
        [`${nodeA}`, `${nodeB}`]
      );
      const combos = graph.getCombos();
      console.log(combos);
      for (let i = 0; i < combos.length; i++) {
        if (combos[i].getID() == newComboId) {
          console.log(combos[i]);
        }
      }
    }
  }
});

graph.on("node:dragend", (e) => {
  // console.log("node:dragend");
  nodeDrag = false;
  graph.getCombos().forEach((combo) => {
    graph.setItemState(combo, "dragenter", false);
  });
});

graph.on("node:mouseup", (e) => {
  if (e.item.getModel().comboId != undefined) {
    selectedComboId = e.item.getModel().comboId;
    graph.setItemState(e.item, "dragenter", true);
    const currentNodesInCombo = countNodesInCombo(selectedComboId);
    const currentNodesInComboArray = [];
    currentNodesInComboArray.push(currentNodesInCombo);
    if (e.item._cfg.model.label === "") {
      e.item._cfg.model.label = currentNodesInComboArray[0];
    } else {
      if (comboDragLeave === false) {
        if (/* comboDragEnter === true   && */ nodeDrag === true) {
          // console.log(`ADDING COUNT`);
          const combo = graph.findById(selectedComboId);
          combo.getModel().label = currentNodesInComboArray[0];
          graph.updateCombo(combo);
          // const combos = graph.getCombos();
          // for (let i = 0; i < combos.length; i++) {
          //   // console.log(combos[i].getID());
          //   console.log(graph.findById(selectedComboId));
          //   // if (combos[i].getID() == selectedComboId) {
          //   //   combos[i]._cfg.model.label = currentNodesInComboArray[0];
          //   //   graph.updateCombo(combos[i]);
          //   // }
          // }
        }
      }
    }
  }
});

graph.on("edge:mouseenter", (e) => {
  graph.setItemState(e.item, "hover", true);
});

graph.on("edge:mouseleave", (e) => {
  graph.setItemState(e.item, "hover", false);
});

graph.on("combo:dragover", (e) => {
  //console.log(`combo:dragover`);
  selectedComboId = e.item._cfg.id;
  graph.setItemState(e.item, "dragenter", true);
});

// NB! WE DON'T USE combo:mouseenter to assign selected item id to selectedComboId:
// it will cause the decrement of node count after adding node into the combo.
graph.on("combo:dragleave", (e) => {
  comboDragLeave = true;
  // console.log(`combo:dragleave`);
  selectedComboId = e.item._cfg.id;
  graph.setItemState(e.item, "dragenter", false);
  const currentNodesInCombo = countNodesInCombo(selectedComboId);
  // console.log(`combo:dragleave, # of  NODES = ${currentNodesInCombo}`);
  const currentNodesInComboArray = [];
  currentNodesInComboArray.push(currentNodesInCombo);
  // console.log(`SUBTRACTING COUNT`);
  if (nodeDrag === true) {
    e.item._cfg.model.label = currentNodesInComboArray[0] - 1;
  }

  // if > 1 nodes WAS in combo, on drag leave, SUBTRACT COUNT
  /*         if(nodeDrag === true && comboDragLeave !== true){
            console.log(`SUBTRACTING COUNT`)
            e.item._cfg.model.label = currentNodesInComboArray[0] - 1 ; // more conditions required. this happens too easily
        } */
});

// DO NOT DELETE - LESLIE's EXPERIMENTATION
graph.on("node:dblclick", function (event) {
  const deleteStuff = [];
  console.log(graph.findById("combo0").getCombos()[0].getModel().collapsed);
  // const edge = graph.findById("cyv-edge-002");
  // let del = true;
  // if (edge.getTarget().getEdges().length == 1) {
  //   deleteStuff.push(edge.getTarget());
  //   del = false;
  // }
  // if (edge.getSource().getEdges().length == 1) {
  //   deleteStuff.push(edge.getSource());
  //   del = false;
  // }
  // if (del) {
  //   deleteStuff.push(edge);
  // }
  // deleteStuff.forEach((stuff) => {
  //   console.log(stuff);
  //   graph.removeItem(stuff);
  // });
  // graph.removeItem("cyv-edge-004");
  // graph.updateCombo(graph.findById("combo2"));
  console.log(event.item.getEdges());
  // console.log(graph.getCombos());
  // graph.removeItem(graph.getCombos()[0].getEdges()[2]);
});

graph.on("combo:click", (e) => {
  const comboId = e.item.getID();
  const comboModel = e.item.getModel();
  const childrenIds = [];
  const edgesThruCombo = [];
  const allNodeEdges = graph.getEdges(); // all actions to take when combo is collapsed.
  if (comboModel?.collapsed === true) {
    comboModel.children.forEach((child) => {
      childrenIds.push(child.id);
    });
    // populate edgesThruCombo Array
    allNodeEdges.forEach((edge) => {
      const edgeModel = edge.getModel();
      childrenIds.forEach((childId) => {
        if (childId === edgeModel.source || childId === edgeModel.target) {
          const edgeOfChild = {
            id: edgeModel.id,
            ttp: edgeModel.ttp,
            source: edgeModel.source,
            target: edgeModel.target
          };
          edgesThruCombo.push(edgeOfChild);
        }
      });
    });
    const combo = graph.findById(comboId);
    //log(combo.get('edges'));
    const comboVEdges = combo.get("edges");
    comboVEdges.forEach((vedge) => {
      const vedgeModel = vedge.getModel();
      const IdOfOutsideItem =
        vedgeModel.source === comboId ? vedgeModel.target : vedgeModel.source;
      let ttpCheck = false;
      edgesThruCombo.forEach((edgeOfChild) => {
        if (
          edgeOfChild.source === IdOfOutsideItem ||
          edgeOfChild.target === IdOfOutsideItem
        ) {
          if (edgeOfChild.ttp === true) {
            ttpCheck = true;
          }
        }
      });
      const editedVEdge = graph.findById(vedgeModel.id);
      editedVEdge._cfg.model["ttp"] = ttpCheck;
    });
  } else {
    comboExpandTTP(e.item);
  }
});

function comboExpandTTP(combo) {
  const combos = combo.getCombos();
  const nodes = combo.getNodes();
  if (nodes.length > 0) {
    for (let i = 0; i < nodes.length; i++) {
      const neighbours = nodes[i].getNeighbors();
      let ttp = false;
      neighbours.forEach((neighbour) => {
        if (neighbour.getType() === "combo") {
          ttp = checkTTP(nodes[i], neighbour);
          if (ttp) {
            const edges = nodes[i].getEdges();
            edges.forEach((edge) => {
              if (edge.getModel().isVEdge) {
                if (
                  edge.getTarget() == neighbour ||
                  edge.getSource() == neighbour
                ) {
                  edge.getModel()["ttp"] = ttp;
                  return;
                }
              }
            });
            return;
          }
        }
      });
    }
  }
  if (combos.length > 0) {
    combos.forEach((inCombo) => {
      if (inCombo.getModel().collapsed) {
        const neighbours = inCombo.getNeighbors();
        for (let i = 0; i < neighbours.length; i++) {
          if (
            neighbours[i].getType() === "node" &&
            !nodes.includes(neighbours[i])
          ) {
            l;
            let ttp = false;
            const allCNodes = getAllComboNode(inCombo);
            for (let j = 0; j < allCNodes.length; j++) {
              if (allCNodes[j].getNeighbors() === neighbours[i]) {
                const CNodeEdges = allCNodes[j].getEdges();
                for (let k = 0; k < CNodeEdges.length(); k++) {
                  if (
                    CNodeEdges.getSource() === neighbours[i] ||
                    CNodeEdges.getTarget() === neighbours[i]
                  ) {
                    ttp = CNodeEdges.getModel().ttp;
                    if (ttp) break;
                  }
                }
              }
              if (ttp) break;
            }
            if (ttp) {
              const comboVedges = inCombo.getEdges();
              for (let j = 0; j < comboVedges.length; j++) {
                if (
                  comboVedges[j].getSource() === neighbours[i] ||
                  comboVedges[j].getTarget() === neighbours[i]
                ) {
                  comboVedges[j].getModel()["ttp"] = true;
                  break;
                }
              }
            }
          } else if (
            neighbours[i].getType() === "combo" &&
            !combos.includes(neighbours[i])
          ) {
            let ttp = false;
            const nodesInNeighbour = getAllComboNode(neighbours[i]);
            allNodesCount = [];
            const nodesInCombo = getAllComboNode(inCombo);
            allNodesCount = [];
            for (let j = 0; j < nodesInCombo.length; j++) {
              if (
                nodesInCombo[j]
                  .getNeighbors()
                  .some((r) => nodesInNeighbour.includes(r))
              ) {
                const cNodeEdges = nodesInCombo[j].getEdges();
                for (let k = 0; k < cNodeEdges.length; k++) {
                  if (
                    nodesInNeighbour.includes(cNodeEdges[k].getSource()) ||
                    nodesInNeighbour.includes(cNodeEdges[k].getTarget())
                  ) {
                    if (cNodeEdges[k].getModel().ttp) ttp = true;
                  }
                }
              }
            }
            if (ttp) {
              const comboVedges = inCombo.getEdges();
              for (let j = 0; j < comboVedges.length; j++) {
                if (
                  comboVedges[j].getSource() === neighbours[i] ||
                  comboVedges[j].getTarget() === neighbours[i]
                ) {
                  comboVedges[j].getModel()["ttp"] = true;
                  break;
                }
              }
            }
          }
        }
      } else {
        comboExpandTTP(inCombo);
      }
    });
  }
}
//clear allNodesCount after each use
let allNodesCount = [];
function getAllComboNode(combo) {
  let childNodes = combo.getNodes();
  let combos = combo.getCombos();
  combos.forEach((inCombo) => {
    allNodesCount.concat(getAllComboNode(inCombo));
  });
  childNodes.forEach((node) => {
    allNodesCount.push(node);
  });
  return allNodesCount;
}
function checkTTP(node, combo) {
  const nEdges = node.getEdges();
  let x = false;
  let combosInCombo = combo.getCombos();
  if (combosInCombo.length > 0) {
    for (let i = 0; i < combosInCombo.length; i++) {
      x = checkTTP(node, combosInCombo[i]);
      if (x) break;
    }
  }
  if (x) return x;
  let cNodes = combo.getNodes();
  for (let i = 0; i < nEdges.length; i++) {
    if (
      cNodes.includes(nEdges[i].getSource()) ||
      cNodes.includes(nEdges[i].getTarget())
    ) {
      if (nEdges[i].getModel().ttp) {
        x = true;
        break;
      }
    }
  }
  return x;
}
const countNodesInCombo = (selectedComboId) => {
  let selectedCombo = {};
  if (selectedComboId !== undefined) {
    const combos = graph.getCombos();
    combos.forEach((combo) => {
      if (combo._cfg.id === selectedComboId) {
        selectedCombo = combo;
      }
    });
    return selectedCombo._cfg.nodes.length;
  }
  console.log(
    `ERROR: selectedComboId is undefined when counting nodes in combo`
  );
};

import { __assign, __extends, __spreadArray } from "tslib";
import EventEmitter from '@antv/event-emitter';
import { ext } from '@antv/matrix-util';
import { clone, deepMix, each, isPlainObject, isString, debounce } from '@antv/util';
import { getDegree, getAdjMatrix as getAdjacentMatrix, Stack, floydWarshall } from '@antv/algorithm';
import { lerp, move } from '../util/math';
import { dataValidation, singleDataValidation } from '../util/validation';
import Global from '../global';
import { ItemController, ModeController, StateController, ViewController } from './controller';
import { plainCombosToTrees, traverseTree, reconstructTree, traverseTreeUp, getAnimateCfgWithCallback } from '../util/graphic';
import Hull from '../item/hull';
var transform = ext.transform;
var NODE = 'node';
var AbstractGraph = /** @class */function (_super) {
  __extends(AbstractGraph, _super);
  function AbstractGraph(cfg) {
    var _this = _super.call(this) || this;
    /**
     * 根据 comboTree 结构整理 Combo 相关的图形绘制层级，包括 Combo 本身、节点、边
     * @param {GraphData} data 数据
     */
    _this.sortCombos = debounce(function () {
      var comboSorted = _this.get('comboSorted');
      if (!_this || _this.destroyed || comboSorted) return;
      _this.set('comboSorted', true);
      var depthMap = [];
      var dataDepthMap = {};
      var comboTrees = _this.get('comboTrees');
      (comboTrees || []).forEach(function (cTree) {
        traverseTree(cTree, function (child) {
          if (depthMap[child.depth]) depthMap[child.depth].push(child.id);else depthMap[child.depth] = [child.id];
          dataDepthMap[child.id] = child.depth;
          return true;
        });
      });
      var edges = _this.getEdges().concat(_this.get('vedges'));
      (edges || []).forEach(function (edgeItem) {
        var edge = edgeItem.getModel();
        var sourceDepth = dataDepthMap[edge.source] || 0;
        var targetDepth = dataDepthMap[edge.target] || 0;
        var depth = Math.max(sourceDepth, targetDepth);
        if (depthMap[depth]) depthMap[depth].push(edge.id);else depthMap[depth] = [edge.id];
      });
      depthMap.forEach(function (array) {
        if (!array || !array.length) return;
        for (var i = array.length - 1; i >= 0; i--) {
          var item = _this.findById(array[i]);
          if (item) item.toFront();
        }
      });
    }, 500, false);
    _this.cfg = deepMix(_this.getDefaultCfg(), cfg);
    _this.init();
    _this.animating = false;
    _this.destroyed = false;
    // 启用 stack 后，实例化 undoStack 和 redoStack
    if (_this.cfg.enabledStack) {
      // 实例化 undo 和 redo 栈
      _this.undoStack = new Stack(_this.cfg.maxStep);
      _this.redoStack = new Stack(_this.cfg.maxStep);
    }
    return _this;
  }
  AbstractGraph.prototype.init = function () {
    this.initCanvas();
    // instance controller
    var viewController = new ViewController(this);
    var modeController = new ModeController(this);
    var itemController = new ItemController(this);
    var stateController = new StateController(this);
    this.set({
      viewController: viewController,
      modeController: modeController,
      itemController: itemController,
      stateController: stateController
    });
    // 初始化布局机制
    this.initLayoutController();
    // 初始化事件机制
    this.initEventController();
    this.initGroups();
    /** 初始化插件 */
    this.initPlugins();
  };
  // 初始化所有 Group
  AbstractGraph.prototype.initGroups = function () {
    var canvas = this.get('canvas');
    if (!canvas) return;
    var el = canvas.get('el');
    var _a = (el || {}).id,
      id = _a === void 0 ? 'g6' : _a;
    var group = canvas.addGroup({
      id: "".concat(id, "-root"),
      className: Global.rootContainerClassName
    });
    if (this.get('groupByTypes')) {
      var edgeGroup = group.addGroup({
        id: "".concat(id, "-edge"),
        className: Global.edgeContainerClassName
      });
      var nodeGroup = group.addGroup({
        id: "".concat(id, "-node"),
        className: Global.nodeContainerClassName
      });
      var comboGroup = group.addGroup({
        id: "".concat(id, "-combo"),
        className: Global.comboContainerClassName
      });
      // 用于存储自定义的群组
      comboGroup.toBack();
      this.set({
        nodeGroup: nodeGroup,
        edgeGroup: edgeGroup,
        comboGroup: comboGroup
      });
    }
    var delegateGroup = group.addGroup({
      id: "".concat(id, "-delegate"),
      className: Global.delegateContainerClassName
    });
    this.set({
      delegateGroup: delegateGroup
    });
    this.set('group', group);
  };
  // eslint-disable-next-line class-methods-use-this
  AbstractGraph.prototype.getDefaultCfg = function () {
    return {
      /**
       * Container could be dom object or dom id
       */
      container: undefined,
      /**
       * Canvas width
       * unit pixel if undefined force fit width
       */
      width: undefined,
      /**
       * Canvas height
       * unit pixel if undefined force fit height
       */
      height: undefined,
      /**
       * renderer canvas or svg
       * @type {string}
       */
      renderer: 'canvas',
      /**
       * control graph behaviors
       */
      modes: {},
      /**
       * 注册插件
       */
      plugins: [],
      /**
       * source data
       */
      data: {},
      /**
       * Fit view padding (client scale)
       */
      fitViewPadding: 10,
      /**
       * Minimum scale size
       */
      minZoom: 0.02,
      /**
       * Maxmum scale size
       */
      maxZoom: 10,
      /**
       *  capture events
       */
      event: true,
      /**
       * group node & edges into different graphic groups
       */
      groupByTypes: true,
      /**
       * determine if it's a directed graph
       */
      directed: false,
      /**
       * when data or shape changed, should canvas draw automatically
       */
      autoPaint: true,
      /**
       * store all the node instances
       */
      nodes: [],
      /**
       * store all the edge instances
       */
      edges: [],
      /**
       * store all the combo instances
       */
      combos: [],
      /**
       * store all the edge instances which are virtual edges related to collapsed combo
       */
      vedges: [],
      /**
       * all the instances indexed by id
       */
      itemMap: {},
      /**
       * 边直接连接到节点的中心，不再考虑锚点
       */
      linkCenter: false,
      /**
       * 默认的节点配置，data 上定义的配置会覆盖这些配置。例如：
       * defaultNode: {
       *  type: 'rect',
       *  size: [60, 40],
       *  style: {
       *    //... 样式配置项
       *  }
       * }
       * 若数据项为 { id: 'node', x: 100, y: 100 }
       * 实际创建的节点模型是 { id: 'node', x: 100, y: 100， type: 'rect', size: [60, 40] }
       * 若数据项为 { id: 'node', x: 100, y: 100, type: 'circle' }
       * 实际创建的节点模型是 { id: 'node', x: 100, y: 100， type: 'circle', size: [60, 40] }
       */
      defaultNode: {},
      /**
       * 默认边配置，data 上定义的配置会覆盖这些配置。用法同 defaultNode
       */
      defaultEdge: {},
      /**
       * 节点默认样式，也可以添加状态样式
       * 例如：
       * const graph = new G6.Graph({
       *  nodeStateStyles: {
       *    selected: { fill: '#ccc', stroke: '#666' },
       *    active: { lineWidth: 2 }
       *  },
       *  ...
       * });
       *
       */
      nodeStateStyles: {},
      /**
       * 边默认样式，用法同nodeStateStyle
       */
      edgeStateStyles: {},
      /**
       * graph 状态
       */
      states: {},
      /**
       * 是否启用全局动画
       */
      animate: false,
      /**
       * 动画设置,仅在 animate 为 true 时有效
       */
      animateCfg: {
        /**
         * 帧回调函数，用于自定义节点运动路径，为空时线性运动
         */
        onFrame: undefined,
        /**
         * 动画时长(ms)
         */
        duration: 500,
        /**
         * 指定动画动效
         */
        easing: 'easeLinear'
      },
      callback: undefined,
      // 默认不启用 undo & redo 功能
      enabledStack: false,
      // 只有当 enabledStack 为 true 时才起作用
      maxStep: 10,
      // 存储图上的 tooltip dom，方便销毁
      tooltips: [],
      // 达到这一节点数量(默认值 1000)，将开启性能优化模式。目前包括：节点状态样式变更是否影响相关边的更新
      optimizeThreshold: 1000
    };
  };
  /**
   * 将值设置到 this.cfg 变量上面
   * @param key 键 或 对象值
   * @param val 值
   */
  AbstractGraph.prototype.set = function (key, val) {
    if (isPlainObject(key)) {
      this.cfg = __assign(__assign({}, this.cfg), key);
    } else {
      this.cfg[key] = val;
    }
    if (key === 'enabledStack' && val && !this.undoStack && !this.redoStack) {
      this.undoStack = new Stack(this.cfg.maxStep);
      this.redoStack = new Stack(this.cfg.maxStep);
    }
    return this;
  };
  /**
   * 获取 this.cfg 中的值
   * @param key 键
   */
  AbstractGraph.prototype.get = function (key) {
    var _a;
    return (_a = this.cfg) === null || _a === void 0 ? void 0 : _a[key];
  };
  /**
   * 获取 graph 的根图形分组
   * @return 根 group
   */
  AbstractGraph.prototype.getGroup = function () {
    return this.get('group');
  };
  /**
   * 获取 graph 的 DOM 容器
   * @return DOM 容器
   */
  AbstractGraph.prototype.getContainer = function () {
    return this.get('container');
  };
  /**
   * 获取 graph 的最小缩放比例
   * @return minZoom
   */
  AbstractGraph.prototype.getMinZoom = function () {
    return this.get('minZoom');
  };
  /**
   * 设置 graph 的最小缩放比例
   * @return minZoom
   */
  AbstractGraph.prototype.setMinZoom = function (ratio) {
    return this.set('minZoom', ratio);
  };
  /**
   * 获取 graph 的最大缩放比例
   * @param maxZoom
   */
  AbstractGraph.prototype.getMaxZoom = function () {
    return this.get('maxZoom');
  };
  /**
   * 设置 graph 的最大缩放比例
   * @param maxZoom
   */
  AbstractGraph.prototype.setMaxZoom = function (ratio) {
    return this.set('maxZoom', ratio);
  };
  /**
   * 获取 graph 的宽度
   * @return width
   */
  AbstractGraph.prototype.getWidth = function () {
    return this.get('width');
  };
  /**
   * 获取 graph 的高度
   * @return width
   */
  AbstractGraph.prototype.getHeight = function () {
    return this.get('height');
  };
  /**
   * 清理元素多个状态
   * @param {string|Item} item 元素id或元素实例
   * @param {string[]} states 状态
   */
  AbstractGraph.prototype.clearItemStates = function (item, states) {
    if (isString(item)) {
      item = this.findById(item);
    }
    var itemController = this.get('itemController');
    if (!states) {
      states = item.get('states');
    }
    itemController.clearItemStates(item, states);
    var stateController = this.get('stateController');
    stateController.updateStates(item, states, false);
  };
  /**
   * 设置各个节点样式，以及在各种状态下节点 keyShape 的样式。
   * 若是自定义节点切在各种状态下
   * graph.node(node => {
   *  return {
   *    type: 'rect',
   *    label: node.id,
   *    style: { fill: '#666' },
   *    stateStyles: {
   *       selected: { fill: 'blue' },
   *       custom: { fill: 'green' }
   *     }
   *   }
   * });
   * @param {function} nodeFn 指定每个节点样式
   */
  AbstractGraph.prototype.node = function (nodeFn) {
    if (typeof nodeFn === 'function') {
      this.set('nodeMapper', nodeFn);
    }
  };
  /**
   * 设置各个边样式
   * @param {function} edgeFn 指定每个边的样式,用法同 node
   */
  AbstractGraph.prototype.edge = function (edgeFn) {
    if (typeof edgeFn === 'function') {
      this.set('edgeMapper', edgeFn);
    }
  };
  /**
   * 设置各个 combo 的配置
   * @param comboFn
   */
  AbstractGraph.prototype.combo = function (comboFn) {
    if (typeof comboFn === 'function') {
      this.set('comboMapper', comboFn);
    }
  };
  /**
   * 根据 ID 查询图元素实例
   * @param id 图元素 ID
   */
  AbstractGraph.prototype.findById = function (id) {
    return this.get('itemMap')[id];
  };
  /**
   * 根据对应规则查找单个元素
   * @param {ITEM_TYPE} type 元素类型(node | edge | group)
   * @param {(item: T, index: number) => T} fn 指定规则
   * @return {T} 元素实例
   */
  AbstractGraph.prototype.find = function (type, fn) {
    var result;
    var items = this.get("".concat(type, "s"));
    // eslint-disable-next-line consistent-return
    each(items, function (item, i) {
      if (fn(item, i)) {
        result = item;
        return result;
      }
    });
    return result;
  };
  /**
   * 查找所有满足规则的元素
   * @param {string} type 元素类型(node|edge)
   * @param {string} fn 指定规则
   * @return {array} 元素实例
   */
  AbstractGraph.prototype.findAll = function (type, fn) {
    var result = [];
    each(this.get("".concat(type, "s")), function (item, i) {
      if (fn(item, i)) {
        result.push(item);
      }
    });
    return result;
  };
  /**
   * 查找所有处于指定状态的元素
   * @param {string} type 元素类型(node|edge)
   * @param {string} state 状态
   * @return {object} 元素实例
   */
  AbstractGraph.prototype.findAllByState = function (type, state, additionalFilter) {
    if (additionalFilter) {
      return this.findAll(type, function (item) {
        return item.hasState(state) && additionalFilter(item);
      });
    } else {
      return this.findAll(type, function (item) {
        return item.hasState(state);
      });
    }
  };
  /**
   * 平移画布
   * @param dx 水平方向位移
   * @param dy 垂直方向位移
   * @param {boolean} animate 是否带有动画地移动
   * @param {GraphAnimateConfig} animateCfg 若带有动画，动画的配置项
   */
  AbstractGraph.prototype.translate = function (dx, dy, animate, animateCfg) {
    var _this = this;
    var group = this.get('group');
    var matrix = clone(group.getMatrix());
    if (!matrix) {
      matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }
    if (animate) {
      var animateConfig = getAnimateCfgWithCallback({
        animateCfg: animateCfg,
        callback: function callback() {
          return _this.emit('viewportchange', {
            action: 'translate',
            matrix: group.getMatrix()
          });
        }
      });
      move(group, {
        x: group.getCanvasBBox().x + dx,
        y: group.getCanvasBBox().y + dy
      }, animate, animateConfig || {
        duration: 500,
        easing: 'easeCubic'
      });
    } else {
      matrix = transform(matrix, [['t', dx, dy]]);
      group.setMatrix(matrix);
      this.emit('viewportchange', {
        action: 'translate',
        matrix: matrix
      });
      this.autoPaint();
    }
  };
  /**
   * 平移画布到某点
   * @param {number} x 水平坐标
   * @param {number} y 垂直坐标
   * @param {boolean} animate 是否带有动画地移动
   * @param {GraphAnimateConfig} animateCfg 若带有动画，动画的配置项
   */
  AbstractGraph.prototype.moveTo = function (x, y, animate, animateCfg) {
    var group = this.get('group');
    move(group, {
      x: x,
      y: y
    }, animate, animateCfg || {
      duration: 500,
      easing: 'easeCubic'
    });
    this.emit('viewportchange', {
      action: 'move',
      matrix: group.getMatrix()
    });
  };
  /**
   * 调整视口适应视图
   * @param {object} padding 四周围边距
   * @param {FitViewRules} rules fitView的规则
   * @param {boolean} animate 是否带有动画地移动
   * @param {GraphAnimateConfig} animateCfg 若带有动画，动画的配置项
   */
  AbstractGraph.prototype.fitView = function (padding, rules, animate, animateCfg) {
    if (padding) {
      this.set('fitViewPadding', padding);
    }
    var viewController = this.get('viewController');
    if (rules) {
      viewController.fitViewByRules(rules, animate, animateCfg);
    } else {
      viewController.fitView(animate, animateCfg);
    }
    this.autoPaint();
  };
  /**
   * 调整视口适应视图，不缩放，仅将图 bbox 中心对齐到画布中心
   * @param {boolean} animate 是否带有动画地移动
   * @param {GraphAnimateConfig} animateCfg 若带有动画，动画的配置项
   */
  AbstractGraph.prototype.fitCenter = function (animate, animateCfg) {
    var viewController = this.get('viewController');
    viewController.fitCenter(animate, animateCfg);
    this.autoPaint();
  };
  /**
   * 新增行为
   * @param {string | ModeOption | ModeType[]} behaviors 添加的行为
   * @param {string | string[]} modes 添加到对应的模式
   * @return {Graph} Graph
   */
  AbstractGraph.prototype.addBehaviors = function (behaviors, modes) {
    var modeController = this.get('modeController');
    modeController.manipulateBehaviors(behaviors, modes, true);
    return this;
  };
  /**
   * 移除行为
   * @param {string | ModeOption | ModeType[]} behaviors 移除的行为
   * @param {string | string[]} modes 从指定的模式中移除
   * @return {Graph} Graph
   */
  AbstractGraph.prototype.removeBehaviors = function (behaviors, modes) {
    var modeController = this.get('modeController');
    modeController.manipulateBehaviors(behaviors, modes, false);
    return this;
  };
  /**
   * 更新行为参数
   * @param {string | ModeOption | ModeType} behavior 需要更新的行为
   * @param {string | string[]} modes 指定的模式中的行为，不指定则为 default
   * @return {Graph} Graph
   */
  AbstractGraph.prototype.updateBehavior = function (behavior, newCfg, mode) {
    var modeController = this.get('modeController');
    modeController.updateBehavior(behavior, newCfg, mode);
    return this;
  };
  /**
   * 伸缩窗口
   * @param ratio 伸缩比例
   * @param center 以center的x, y坐标为中心缩放
   * @param {boolean} animate 是否带有动画地移动
   * @param {GraphAnimateConfig} animateCfg 若带有动画，动画的配置项
   * @return {boolean} 缩放是否成功
   */
  AbstractGraph.prototype.zoom = function (ratio, center, animate, animateCfg) {
    var _this = this;
    var group = this.get('group');
    var matrix = clone(group.getMatrix()) || [1, 0, 0, 0, 1, 0, 0, 0, 1];
    var minZoom = this.get('minZoom');
    var maxZoom = this.get('maxZoom');
    var currentZoom = this.getZoom() || 1;
    var targetZoom = currentZoom * ratio;
    var finalRatio = ratio;
    var failed = false;
    if (minZoom && targetZoom < minZoom) {
      finalRatio = minZoom / currentZoom;
      failed = true;
    } else if (maxZoom && targetZoom > maxZoom) {
      finalRatio = maxZoom / currentZoom;
      failed = true;
    }
    if (center) {
      matrix = transform(matrix, [['t', -center.x, -center.y], ['s', finalRatio, finalRatio], ['t', center.x, center.y]]);
    } else {
      matrix = transform(matrix, [['s', finalRatio, finalRatio]]);
    }
    if (animate) {
      // Clone the original matrix to perform the animation
      var aniMatrix_1 = clone(group.getMatrix());
      if (!aniMatrix_1) {
        aniMatrix_1 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
      }
      var initialRatio_1 = aniMatrix_1[0];
      var targetRatio_1 = initialRatio_1 * finalRatio;
      var animateConfig = getAnimateCfgWithCallback({
        animateCfg: animateCfg,
        callback: function callback() {
          return _this.emit('viewportchange', {
            action: 'zoom',
            matrix: group.getMatrix()
          });
        }
      });
      group.animate(function (ratio) {
        if (ratio === 1) {
          // Reuse the first transformation
          aniMatrix_1 = matrix;
        } else {
          var scale = lerp(initialRatio_1, targetRatio_1, ratio) / aniMatrix_1[0];
          if (center) {
            aniMatrix_1 = transform(aniMatrix_1, [['t', -center.x, -center.y], ['s', scale, scale], ['t', center.x, center.y]]);
          } else {
            aniMatrix_1 = transform(aniMatrix_1, [['s', scale, scale]]);
          }
        }
        return {
          matrix: aniMatrix_1
        };
      }, animateConfig);
    } else {
      group.setMatrix(matrix);
      this.emit('viewportchange', {
        action: 'zoom',
        matrix: matrix
      });
      this.autoPaint();
    }
    return !failed;
  };
  /**
   * 伸缩视口到一固定比例
   * @param {number} toRatio 伸缩比例
   * @param {Point} center 以center的x, y坐标为中心缩放
   * @param {boolean} animate 是否带有动画地移动
   * @param {GraphAnimateConfig} animateCfg 若带有动画，动画的配置项
   * @return {boolean} 缩放是否成功
   */
  AbstractGraph.prototype.zoomTo = function (toRatio, center, animate, animateCfg) {
    var ratio = toRatio / this.getZoom();
    return this.zoom(ratio, center, animate, animateCfg);
  };
  /**
   * 将元素移动到视口中心
   * @param {Item} item 指定元素
   * @param {boolean} animate 是否带有动画地移动
   * @param {GraphAnimateConfig} animateCfg 若带有动画，动画的配置项
   */
  AbstractGraph.prototype.focusItem = function (item, animate, animateCfg) {
    var viewController = this.get('viewController');
    var isAnimate = false;
    if (animate) isAnimate = true;else if (animate === undefined) isAnimate = this.get('animate');
    var curAniamteCfg = {};
    if (animateCfg) curAniamteCfg = animateCfg;else if (animateCfg === undefined) curAniamteCfg = this.get('animateCfg');
    viewController.focus(item, isAnimate, curAniamteCfg);
    this.autoPaint();
  };
  /**
   * Focus on the passed items
   * @param {Item[]} items Items you want to focus on
   * @param {boolean} zoomToFit Wether to zoom on the passed items
   * @param {boolean} animate Wether to animate the transition
   * @param {GraphAnimateConfig} animateCfg Animation configuration
   */
  AbstractGraph.prototype.focusItems = function (items, zoomToFit, animate, animateCfg) {
    var viewController = this.get('viewController');
    viewController.focusItems(items, zoomToFit, animate, animateCfg);
  };
  /**
   * 自动重绘
   * @internal 仅供内部更新机制调用，外部根据需求调用 render 或 paint 接口
   */
  AbstractGraph.prototype.autoPaint = function () {
    if (this.get('autoPaint')) {
      this.paint();
    }
  };
  /**
   * 仅画布重新绘制
   */
  AbstractGraph.prototype.paint = function () {
    this.emit('beforepaint');
    this.get('canvas').draw();
    this.emit('afterpaint');
  };
  /**
   * 将屏幕坐标转换为视口坐标
   * @param {number} clientX 屏幕x坐标
   * @param {number} clientY 屏幕y坐标
   * @return {Point} 视口坐标
   */
  AbstractGraph.prototype.getPointByClient = function (clientX, clientY) {
    var viewController = this.get('viewController');
    return viewController.getPointByClient(clientX, clientY);
  };
  /**
   * 将绘制坐标转换为屏幕坐标
   * @param {number} x 绘制坐标 x
   * @param {number} y 绘制坐标 y
   * @return {Point} 绘制坐标
   */
  AbstractGraph.prototype.getClientByPoint = function (x, y) {
    var viewController = this.get('viewController');
    return viewController.getClientByPoint(x, y);
  };
  /**
   * 将画布坐标转换为绘制坐标
   * @param {number} canvasX 画布 x 坐标
   * @param {number} canvasY 画布 y 坐标
   * @return {object} 绘制坐标
   */
  AbstractGraph.prototype.getPointByCanvas = function (canvasX, canvasY) {
    var viewController = this.get('viewController');
    return viewController.getPointByCanvas(canvasX, canvasY);
  };
  /**
   * 将绘制坐标转换为画布坐标
   * @param {number} x 绘制坐标 x
   * @param {number} y 绘制坐标 y
   * @return {object} 画布坐标
   */
  AbstractGraph.prototype.getCanvasByPoint = function (x, y) {
    var viewController = this.get('viewController');
    return viewController.getCanvasByPoint(x, y);
  };
  /**
   * 获取图内容的中心绘制坐标
   * @return {object} 中心绘制坐标
   */
  AbstractGraph.prototype.getGraphCenterPoint = function () {
    var bbox = this.get('group').getCanvasBBox();
    return {
      x: (bbox.minX + bbox.maxX) / 2,
      y: (bbox.minY + bbox.maxY) / 2
    };
  };
  /**
   * 获取视口中心绘制坐标
   * @return {object} 视口中心绘制坐标
   */
  AbstractGraph.prototype.getViewPortCenterPoint = function () {
    return this.getPointByCanvas(this.get('width') / 2, this.get('height') / 2);
  };
  /**
   * 显示元素
   * @param {Item} item 指定元素
   * @param {boolean} stack 本次操作是否入栈，默认为 true
   */
  AbstractGraph.prototype.showItem = function (item, stack, option = undefined) {
    if (stack === void 0) {
      stack = true;
    }
    var itemController = this.get('itemController');
    var object = itemController.changeItemVisibility(item, true, option);

    if (stack && this.get('enabledStack')) {
      var id = object.getID();
      var type = object.getType();
      var before = {};
      var after = {};
      switch (type) {
        case 'node':
          before.nodes = [{
            id: id,
            visible: false
          }];
          after.nodes = [{
            id: id,
            visible: true
          }];
          break;
        case 'edge':
          before.nodes = [{
            id: id,
            visible: false
          }];
          after.edges = [{
            id: id,
            visible: true
          }];
          break;
        case 'combo':
          before.nodes = [{
            id: id,
            visible: false
          }];
          after.combos = [{
            id: id,
            visible: true
          }];
          break;
        default:
          break;
      }
      this.pushStack('visible', {
        before: before,
        after: after
      });
    }
  };
  /**
   * 隐藏元素
   * @param {Item} item 指定元素
   * @param {boolean} stack 本次操作是否入栈，默认为 true
   */
  AbstractGraph.prototype.hideItem = function (item, stack, option = undefined) {
    if (stack === void 0) {
      stack = true;
    }
    var itemController = this.get('itemController');

    var object = itemController.changeItemVisibility(item, false, option);


    if (stack && this.get('enabledStack')) {
      var id = object.getID();
      var type = object.getType();
      var before = {};
      var after = {};
      switch (type) {
        case 'node':
          before.nodes = [{
            id: id,
            visible: true
          }];
          after.nodes = [{
            id: id,
            visible: false
          }];
          break;
        case 'edge':
          before.nodes = [{
            id: id,
            visible: true
          }];
          after.edges = [{
            id: id,
            visible: false
          }];
          break;
        case 'combo':
          before.nodes = [{
            id: id,
            visible: true
          }];
          after.combos = [{
            id: id,
            visible: false
          }];
          break;
        default:
          break;
      }
      this.pushStack('visible', {
        before: before,
        after: after
      });
    }
  };
  /**
   * 刷新元素
   * @param {string|object} item 元素id或元素实例
   */
  AbstractGraph.prototype.refreshItem = function (item) {
    var itemController = this.get('itemController');
    itemController.refreshItem(item);
  };
  /**
   * 设置是否在更新/刷新后自动重绘
   * @param {boolean} auto 自动重绘
   */
  AbstractGraph.prototype.setAutoPaint = function (auto) {
    var self = this;
    self.set('autoPaint', auto);
    var canvas = self.get('canvas');
    canvas.set('autoDraw', auto);
  };
  /**
   * 删除元素
   * @param {Item} item 元素id或元素实例
   * @param {boolean} stack 本次操作是否入栈，默认为 true
   */
  AbstractGraph.prototype.remove = function (item, stack) {
    if (stack === void 0) {
      stack = true;
    }
    this.removeItem(item, stack);
  };
  /**
   * 删除元素
   * @param {Item} item 元素id或元素实例
   * @param {boolean} stack 本次操作是否入栈，默认为 true
   */
  AbstractGraph.prototype.removeItem = function (item, stack) {
    if (stack === void 0) {
      stack = true;
    }
    var nodeItem = item;
    if (isString(item)) nodeItem = this.findById(item);
    if (!nodeItem && isString(item)) {
      console.warn("The item ".concat(item, " to be removed does not exist!"));
    } else if (nodeItem) {
      var type = '';
      if (nodeItem.getType) type = nodeItem.getType();
      // 将删除的元素入栈
      if (stack && this.get('enabledStack')) {
        var deletedModel = __assign(__assign({}, nodeItem.getModel()), {
          itemType: type
        });
        var before = {};
        switch (type) {
          case 'node':
            {
              before.nodes = [deletedModel];
              before.edges = [];
              var edges = nodeItem.getEdges();
              for (var i = edges.length - 1; i >= 0; i--) {
                before.edges.push(__assign(__assign({}, edges[i].getModel()), {
                  itemType: 'edge'
                }));
              }
              break;
            }
          case 'edge':
            before.edges = [deletedModel];
            break;
          case 'combo':
            before.combos = [deletedModel];
            break;
          default:
            break;
        }
        this.pushStack('delete', {
          before: before,
          after: {}
        });
      }
      if (type === 'node') {
        var model = nodeItem.getModel();
        // 如果删除的是节点，且该节点存在于某个 Combo 中，则需要先将 node 从 combo 中移除，否则删除节点后，操作 combo 会出错
        if (model.comboId) {
          this.updateComboTree(nodeItem, undefined, false);
        }
      }
      var itemController = this.get('itemController');
      itemController.removeItem(nodeItem);
      if (type === 'combo') {
        var newComboTrees = reconstructTree(this.get('comboTrees'));
        this.set('comboTrees', newComboTrees);
      }
    }
  };
  AbstractGraph.prototype.innerAddItem = function (type, model, itemController) {
    // 添加节点、边或combo之前，先验证数据是否符合规范
    if (!singleDataValidation(type, model)) {
      return false;
    }
    if (model.id && this.findById(model.id)) {
      console.warn("This item exists already. Be sure the id %c".concat(model.id, "%c is unique."), 'font-size: 20px; color: red;', '');
      return;
    }
    var item;
    var comboTrees = this.get('comboTrees') || [];
    if (type === 'combo') {
      var itemMap_1 = this.get('itemMap');
      var foundParent_1 = false;
      comboTrees.forEach(function (ctree) {
        if (foundParent_1) return; // terminate the forEach after the tree containing the item is done
        traverseTreeUp(ctree, function (child) {
          // find the parent
          if (model.parentId === child.id) {
            foundParent_1 = true;
            var newCombo = __assign({
              id: model.id,
              depth: child.depth + 2
            }, model);
            if (child.children) child.children.push(newCombo);else child.children = [newCombo];
            model.depth = newCombo.depth;
            item = itemController.addItem(type, model);
          }
          var childItem = itemMap_1[child.id];
          // after the parent is found, update all the ancestors
          if (foundParent_1 && childItem && childItem.getType && childItem.getType() === 'combo') {
            itemController.updateCombo(childItem, child.children);
          }
          return true;
        });
      });
      // if the parent is not found, add it to the root
      if (!foundParent_1) {
        var newCombo = __assign({
          id: model.id,
          depth: 0
        }, model);
        model.depth = newCombo.depth;
        comboTrees.push(newCombo);
        item = itemController.addItem(type, model);
      }
      this.set('comboTrees', comboTrees);
      if (model.collapsed) {
        this.collapseCombo(item, false);
        this.updateCombo(item);
      }
    } else if (type === 'node' && isString(model.comboId) && comboTrees) {
      var parentCombo = this.findById(model.comboId);
      if (parentCombo && parentCombo.getType && parentCombo.getType() !== 'combo') {
        console.warn("'".concat(model.comboId, "' is not a id of a combo in the graph, the node will be added without combo."));
      }
      item = itemController.addItem(type, model);
      var itemMap_2 = this.get('itemMap');
      var foundParent_2 = false,
        foundNode_1 = false;
      comboTrees.forEach(function (ctree) {
        if (foundNode_1 || foundParent_2) return; // terminate the forEach
        traverseTreeUp(ctree, function (child) {
          if (child.id === model.id) {
            // if the item exists in the tree already, terminate
            foundNode_1 = true;
            return false;
          }
          if (model.comboId === child.id && !foundNode_1) {
            // found the parent, add the item to the children of its parent in the tree
            foundParent_2 = true;
            var cloneNode = clone(model);
            cloneNode.itemType = 'node';
            if (child.children) child.children.push(cloneNode);else child.children = [cloneNode];
            cloneNode.depth = child.depth + 1;
          }
          // update the size of all the ancestors
          if (foundParent_2 && itemMap_2[child.id].getType && itemMap_2[child.id].getType() === 'combo') {
            itemController.updateCombo(itemMap_2[child.id], child.children);
          }
          return true;
        });
      });
    } else {
      item = itemController.addItem(type, model);
    }
    if (type === 'node' && model.comboId || type === 'combo' && model.parentId) {
      // add the combo to the parent's children array
      var parentCombo = this.findById(model.comboId || model.parentId);
      if (parentCombo && parentCombo.getType && parentCombo.getType() === 'combo') parentCombo.addChild(item);
    }
    return item;
  };
  /**
   * 新增元素
   * @param {ITEM_TYPE} type 元素类型(node | edge)
   * @param {ModelConfig} model 元素数据模型
   * @param {boolean} stack 本次操作是否入栈，默认为 true
   * @param {boolean} sortCombo 本次操作是否需要更新 combo 层级顺序，内部参数，用户在外部使用 addItem 时始终时需要更新
   * @return {Item} 元素实例
   */
  AbstractGraph.prototype.addItem = function (type, model, stack, sortCombo) {
    if (stack === void 0) {
      stack = true;
    }
    if (sortCombo === void 0) {
      sortCombo = true;
    }
    var currentComboSorted = this.get('comboSorted');
    this.set('comboSorted', currentComboSorted && !sortCombo);
    var itemController = this.get('itemController');
    var item = this.innerAddItem(type, model, itemController);
    if (item === false || item === true) {
      return item;
    }
    var combos = this.get('combos');
    if (combos && combos.length > 0) {
      this.sortCombos();
    }
    this.autoPaint();
    if (stack && this.get('enabledStack')) {
      var addedModel = __assign(__assign({}, item.getModel()), {
        itemType: type
      });
      var after = {};
      switch (type) {
        case 'node':
          after.nodes = [addedModel];
          break;
        case 'edge':
          after.edges = [addedModel];
          break;
        case 'combo':
          after.combos = [addedModel];
          break;
        default:
          break;
      }
      this.pushStack('add', {
        before: {},
        after: after
      });
    }
    return item;
  };
  AbstractGraph.prototype.addItems = function (items, stack, sortCombo) {
    if (items === void 0) {
      items = [];
    }
    if (stack === void 0) {
      stack = true;
    }
    if (sortCombo === void 0) {
      sortCombo = true;
    }
    var currentComboSorted = this.get('comboSorted');
    this.set('comboSorted', currentComboSorted && !sortCombo);
    var itemController = this.get('itemController');
    var returnItems = [];
    // 1. add anything that is not an edge.
    // Add undefined as a placeholder for the next cycle. This way we return items matching the input order
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.type !== 'edge' && item.type !== 'vedge') {
        returnItems.push(this.innerAddItem(item.type, item.model, itemController));
      } else {
        returnItems.push(undefined);
      }
    }
    // 2. add all the edges
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.type === 'edge' || item.type === 'vedge') {
        returnItems[i] = this.innerAddItem(item.type, item.model, itemController);
      }
    }
    if (sortCombo) {
      var combos = this.get('combos');
      if (combos && combos.length > 0) {
        this.sortCombos();
      }
    }
    this.autoPaint();
    if (stack && this.get('enabledStack')) {
      var after = {
        nodes: [],
        edges: [],
        combos: []
      };
      for (var i = 0; i < items.length; i++) {
        var type = items[i].type;
        var returnItem = returnItems[i];
        if (!!returnItem && returnItem !== true) {
          var addedModel = __assign(__assign({}, returnItem.getModel()), {
            itemType: type
          });
          switch (type) {
            case 'node':
              after.nodes.push(addedModel);
              break;
            case 'edge':
              after.edges.push(addedModel);
              break;
            case 'combo':
              after.combos.push(addedModel);
              break;
            default:
              break;
          }
        }
      }
      this.pushStack('addItems', {
        before: {},
        after: after
      });
    }
    return returnItems;
  };
  /**
   * 新增元素
   * @param {ITEM_TYPE} type 元素类型(node | edge)
   * @param {ModelConfig} model 元素数据模型
   * @param {boolean} stack 本次操作是否入栈，默认为 true
   * @param {boolean} sortCombo 本次操作是否需要更新 combo 层级顺序，内部参数，用户在外部使用 addItem 时始终时需要更新
   * @return {Item} 元素实例
   */
  AbstractGraph.prototype.add = function (type, model, stack, sortCombo) {
    if (stack === void 0) {
      stack = true;
    }
    if (sortCombo === void 0) {
      sortCombo = true;
    }
    return this.addItem(type, model, stack, sortCombo);
  };
  /**
   * 更新元素
   * @param {Item} item 元素id或元素实例
   * @param {Partial<NodeConfig> | EdgeConfig} cfg 需要更新的数据
   */
  AbstractGraph.prototype.updateItem = function (item, cfg, stack) {
    var _this = this;
    if (stack === void 0) {
      stack = true;
    }
    var itemController = this.get('itemController');
    var currentItem;
    if (isString(item)) {
      currentItem = this.findById(item);
    } else {
      currentItem = item;
    }
    var stackEnabled = stack && this.get('enabledStack');
    var unupdatedModel;
    if (stackEnabled) {
      unupdatedModel = clone(currentItem.getModel());
    }
    var type = '';
    if (currentItem.getType) type = currentItem.getType();
    var states = __spreadArray([], currentItem.getStates(), true);
    if (type === 'combo') {
      each(states, function (state) {
        return _this.setItemState(currentItem, state, false);
      });
    }
    itemController.updateItem(currentItem, cfg);
    if (type === 'combo') {
      each(states, function (state) {
        return _this.setItemState(currentItem, state, true);
      });
    }
    if (stackEnabled) {
      var before = {
        nodes: [],
        edges: [],
        combos: []
      };
      var after = {
        nodes: [],
        edges: [],
        combos: []
      };
      var afterModel = __assign({
        id: unupdatedModel.id
      }, cfg);
      switch (type) {
        case 'node':
          before.nodes.push(unupdatedModel);
          after.nodes.push(afterModel);
          break;
        case 'edge':
          before.edges.push(unupdatedModel);
          after.edges.push(afterModel);
          break;
        case 'combo':
          before.combos.push(unupdatedModel);
          after.combos.push(afterModel);
          break;
        default:
          break;
      }
      this.pushStack('update', {
        before: before,
        after: after
      });
    }
  };
  /**
   * 更新元素
   * @param {Item} item 元素id或元素实例
   * @param {Partial<NodeConfig> | EdgeConfig} cfg 需要更新的数据
   * @param {boolean} stack 本次操作是否入栈，默认为 true
   */
  AbstractGraph.prototype.update = function (item, cfg, stack) {
    if (stack === void 0) {
      stack = true;
    }
    this.updateItem(item, cfg, stack);
  };
  /**
   * 设置元素状态
   * @param {Item} item 元素id或元素实例
   * @param {string} state 状态名称
   * @param {string | boolean} value 是否启用状态 或 状态值
   */
  AbstractGraph.prototype.setItemState = function (item, state, value) {
    if (isString(item)) {
      item = this.findById(item);
    }
    var itemController = this.get('itemController');
    itemController.setItemState(item, state, value);
    var stateController = this.get('stateController');
    stateController.updateState(item, state, value);
  };
  /**
   * 将指定状态的优先级提升为最高优先级
   * @param {Item} item 元素id或元素实例
   * @param state 状态名称
   */
  AbstractGraph.prototype.priorityState = function (item, state) {
    var itemController = this.get('itemController');
    itemController.priorityState(item, state);
  };
  /**
   * 设置视图初始化数据
   * @param {GraphData} data 初始化数据
   */
  AbstractGraph.prototype.data = function (data) {
    dataValidation(data);
    this.set('data', data);
  };
  /**
   * 根据data接口的数据渲染视图
   */
  AbstractGraph.prototype.render = function () {
    var self = this;
    this.set('comboSorted', false);
    var data = this.get('data');
    if (this.get('enabledStack')) {
      // render 之前清空 redo 和 undo 栈
      this.clearStack();
    }
    if (!data) {
      throw new Error('data must be defined first');
    }
    var _a = data.nodes,
      nodes = _a === void 0 ? [] : _a,
      _b = data.edges,
      edges = _b === void 0 ? [] : _b,
      _c = data.combos,
      combos = _c === void 0 ? [] : _c;
    this.clear(true);
    this.emit('beforerender');
    self.addItems(nodes.map(function (node) {
      return {
        type: 'node',
        model: node
      };
    }), false, false);
    // process the data to tree structure
    if ((combos === null || combos === void 0 ? void 0 : combos.length) !== 0) {
      var comboTrees = plainCombosToTrees(combos, nodes);
      this.set('comboTrees', comboTrees);
      // add combos
      self.addCombos(combos);
    }
    self.addItems(edges.map(function (edge) {
      return {
        type: 'edge',
        model: edge
      };
    }), false, false);
    var animate = self.get('animate');
    if (self.get('fitView') || self.get('fitCenter')) {
      self.set('animate', false);
    }
    // layout
    var layoutController = self.get('layoutController');
    if (layoutController) {
      layoutController.layout(success);
      if (this.destroyed) return;
    } else {
      success();
    }
    // 将在 onLayoutEnd 中被调用
    function success() {
      // 自底向上将 collapsed 的 combo 合起
      (self.get('comboTrees') || []).forEach(function (ctree) {
        traverseTreeUp(ctree, function (child) {
          var item = self.findById(child.id);
          if (item.getType() === 'combo' && child.collapsed) {
            self.collapseCombo(child.id, false);
            self.updateCombo(item);
          }
          return true;
        });
      });
      // fitView 与 fitCenter 共存时，fitView 优先，fitCenter 不再执行
      if (self.get('fitView')) {
        self.fitView();
      } else if (self.get('fitCenter')) {
        self.fitCenter();
      }
      self.autoPaint();
      self.emit('afterrender');
      if (self.get('fitView') || self.get('fitCenter')) {
        self.set('animate', animate);
      }
      setTimeout(function () {
        var _a;
        (_a = self.getCombos()) === null || _a === void 0 ? void 0 : _a.forEach(function (combo) {
          combo.set('animate', true);
        });
      }, 0);
    }
    if (!this.get('groupByTypes')) {
      if (combos && combos.length !== 0) {
        this.sortCombos();
      } else {
        // 为提升性能，选择数量少的进行操作
        if (data.nodes && data.edges && data.nodes.length < data.edges.length) {
          var nodesArr = this.getNodes();
          // 遍历节点实例，将所有节点提前。
          nodesArr.forEach(function (node) {
            node.toFront();
          });
        } else {
          var edgesArr = this.getEdges();
          // 遍历节点实例，将所有节点提前。
          edgesArr.forEach(function (edge) {
            edge.toBack();
          });
        }
      }
    }
  };
  /**
   * 接收数据进行渲染
   * @Param {Object} data 初始化数据
   */
  AbstractGraph.prototype.read = function (data) {
    this.data(data);
    this.render();
  };
  // 比较item
  AbstractGraph.prototype.diffItems = function (type, items, models) {
    var self = this;
    var item;
    var itemMap = this.get('itemMap');
    each(models, function (model) {
      item = itemMap[model.id];
      if (item) {
        if (self.get('animate') && type === NODE) {
          var containerMatrix = item.getContainer().getMatrix();
          if (!containerMatrix) containerMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
          item.set('originAttrs', {
            x: containerMatrix[6],
            y: containerMatrix[7]
          });
        }
        self.updateItem(item, model, false);
      } else {
        item = self.addItem(type, model, false);
      }
      if (item) items["".concat(type, "s")].push(item);
    });
  };
  /**
   * 更改源数据，根据新数据重新渲染视图
   * @param {GraphData | TreeGraphData} data 源数据
   * @param {boolean} 是否入栈，默认为true
   * @return {object} this
   */
  AbstractGraph.prototype.changeData = function (propsData, stack) {
    var _this = this;
    var _a;
    if (stack === void 0) {
      stack = true;
    }
    var self = this;
    var data = propsData || self.get('data');
    if (!dataValidation(data)) {
      return this;
    }
    this.emit('beforechangedata');
    if (stack && this.get('enabledStack')) {
      this.pushStack('changedata', {
        before: self.save(),
        after: data
      });
    }
    this.set('comboSorted', false);
    // 删除 hulls
    this.removeHulls();
    // 更改数据源后，取消所有状态
    this.getNodes().map(function (node) {
      return self.clearItemStates(node);
    });
    this.getEdges().map(function (edge) {
      return self.clearItemStates(edge);
    });
    var canvas = this.get('canvas');
    var localRefresh = canvas.get('localRefresh');
    canvas.set('localRefresh', false);
    if (!self.get('data')) {
      self.data(data);
      self.render();
    }
    var itemMap = this.get('itemMap');
    var items = {
      nodes: [],
      edges: []
    };
    var combosData = data.combos;
    if (combosData) {
      var comboTrees = plainCombosToTrees(combosData, data.nodes);
      this.set('comboTrees', comboTrees);
    } else {
      this.set('comboTrees', []);
    }
    this.diffItems('node', items, data.nodes);
    each(itemMap, function (item, id) {
      itemMap[id].getModel().depth = 0;
      if (item.getType && item.getType() === 'edge') return;
      if (item.getType && item.getType() === 'combo') {
        delete itemMap[id];
        item.destroy();
      } else if (items.nodes.indexOf(item) < 0) {
        delete itemMap[id];
        self.remove(item, false);
      }
    });
    // clear the destroyed combos here to avoid removing sub nodes before removing the parent combo
    var comboItems = this.getCombos();
    var combosLength = comboItems.length;
    for (var i = combosLength - 1; i >= 0; i--) {
      if (comboItems[i].destroyed) {
        comboItems.splice(i, 1);
      }
    }
    // process the data to tree structure
    if (combosData) {
      // add combos
      self.addCombos(combosData);
      if (!this.get('groupByTypes')) {
        this.sortCombos();
      }
    }
    this.diffItems('edge', items, data.edges);
    each(itemMap, function (item, id) {
      if (item.getType && (item.getType() === 'node' || item.getType() === 'combo')) return;
      if (items.edges.indexOf(item) < 0) {
        delete itemMap[id];
        self.remove(item, false);
      }
    });
    // 自底向上将 collapsed 的 combo 合起
    (this.get('comboTrees') || []).forEach(function (ctree) {
      traverseTreeUp(ctree, function (child) {
        var item = _this.findById(child.id);
        if (item.getType() === 'combo' && child.collapsed) {
          _this.collapseCombo(child.id, false);
        }
        return true;
      });
    });
    this.set({
      nodes: items.nodes,
      edges: items.edges
    });
    var layoutController = this.get('layoutController');
    if (layoutController) {
      layoutController.changeData(function () {
        setTimeout(function () {
          var _a;
          (_a = self.getCombos()) === null || _a === void 0 ? void 0 : _a.forEach(function (combo) {
            combo.set('animate', true);
          });
        }, 0);
      });
      if (self.get('animate') && !layoutController.getLayoutType()) {
        // 如果没有指定布局
        self.positionsAnimate();
        (_a = self.getCombos()) === null || _a === void 0 ? void 0 : _a.forEach(function (combo) {
          return combo.set('animate', true);
        });
      } else {
        self.autoPaint();
      }
    }
    setTimeout(function () {
      canvas.set('localRefresh', localRefresh);
    }, 16);
    this.set('data', data);
    this.emit('afterchangedata');
    return this;
  };
  /**
   * 私有方法，在 render 和 changeData 的时候批量添加数据中所有平铺的 combos
   * @param {ComboConfig[]} combos 平铺的 combos 数据
   */
  AbstractGraph.prototype.addCombos = function (combos) {
    var self = this;
    var comboTrees = self.get('comboTrees');
    var itemController = this.get('itemController');
    itemController.addCombos(comboTrees, combos);
  };
  /**
   * 根据已经存在的节点或 combo 创建新的 combo
   * @param combo combo ID 或 Combo 配置
   * @param childrenIds 添加到 Combo 中的元素，包括节点和 combo
   */
  AbstractGraph.prototype.createCombo = function (combo, childrenIds, stack) {
    var _this = this;
    if (stack === void 0) {
      stack = true;
    }
    var itemController = this.get('itemController');
    this.set('comboSorted', false);
    // step 1: 创建新的 Combo
    var comboId = '';
    var comboConfig;
    if (!combo) return;
    if (isString(combo)) {
      comboId = combo;
      comboConfig = {
        id: combo
      };
    } else {
      comboId = combo.id;
      if (!comboId) {
        console.warn('Create combo failed. Please assign a unique string id for the adding combo.');
        return;
      }
      comboConfig = combo;
    }
    var shouldStack = stack && this.get('enabledStack');
    // cache the children's old parent for stack
    var childrenParentCache = {
      nodes: [],
      combos: []
    };
    if (shouldStack) {
      childrenIds.forEach(function (childId) {
        var childItem = _this.findById(childId);
        var childType = childItem.getType();
        if (childType !== 'node' && childType !== 'combo') return;
        var childModel = childItem.getModel();
        childrenParentCache["".concat(childType, "s")].push({
          id: childId,
          parentId: childType === 'node' ? childModel.comboId : childModel.parentId
        });
      });
    }
    // step 2: Pull children out of their parents
    var comboTrees = this.get('comboTrees');
    var childrenIdsSet = new Set(childrenIds);
    var pulledComboTreesById = new Map();
    if (comboTrees) {
      comboTrees.forEach(function (ctree) {
        traverseTreeUp(ctree, function (treeNode, parentTreeNode, index) {
          if (childrenIdsSet.has(treeNode.id)) {
            if (parentTreeNode) {
              var parentItem = _this.findById(parentTreeNode.id);
              var item = _this.findById(treeNode.id);
              // Removing current item from the tree during the traversal is ok because children traversal is done
              // in an *inverse order* - indices of the next-traversed items are not disturbed by the removal.
              parentTreeNode.children.splice(index, 1);
              parentItem.removeChild(item);
              // We have to update the parent node geometry since nodes were removed from them, _while they are still visible_
              // (combos may be moved inside the new combo and become hidden)
              itemController.updateCombo(parentItem, parentTreeNode.children);
            }
            if (treeNode.itemType === 'combo') {
              pulledComboTreesById.set(treeNode.id, treeNode);
            }
          }
          return true;
        });
      });
      comboTrees = comboTrees.filter(function (ctree) {
        return !childrenIdsSet.has(ctree.id);
      });
      this.set('comboTrees', comboTrees);
    }
    // step 3: 更新 children，根据类型添加 comboId 或 parentId
    var newChildrenParent = {
      nodes: [],
      combos: []
    };
    var trees = childrenIds.map(function (elementId) {
      var item = _this.findById(elementId);
      var model = item.getModel();
      var type = '';
      if (item.getType) type = item.getType();
      // Combos will be just moved around, so their children can be preserved
      var cItem = pulledComboTreesById.get(elementId) || {
        id: item.getID(),
        itemType: type
      };
      if (type === 'combo') {
        cItem.parentId = comboId;
        model.parentId = comboId;
      } else if (type === 'node') {
        cItem.comboId = comboId;
        model.comboId = comboId;
      }
      if (shouldStack) {
        newChildrenParent["".concat(type, "s")].push({
          id: model.id,
          parentId: comboId
        });
      }
      return cItem;
    });
    comboConfig.children = trees;
    // step 4: 添加 Combo，addItem 时会将子将元素添加到 Combo 中
    this.addItem('combo', comboConfig, false);
    this.set('comboSorted', false);
    // step 5: 更新 comboTrees 结构
    if (comboTrees) {
      comboTrees.forEach(function (ctree) {
        traverseTree(ctree, function (treeNode) {
          // Set the children to the newly created combo
          if (treeNode.id === comboId) {
            treeNode.itemType = 'combo';
            treeNode.children = trees;
            return false;
          }
          return true;
        });
      });
      this.sortCombos();
    }
    if (shouldStack) {
      newChildrenParent.combos.push(comboConfig);
      this.pushStack('createCombo', {
        before: childrenParentCache,
        after: newChildrenParent
      });
    }
    // Fixes issue of nested child combos not being interactive (under parent on graph).
    var comboItem = this.findById(comboId);
    if (!comboItem.getModel().parentId && comboItem.getChildren().combos.length) {
      this.updateComboTree(comboItem, undefined, false);
    }
  };
  /**
   * 解散 combo
   * @param {String | INode | ICombo} combo 需要被解散的 Combo item 或 id
   */
  AbstractGraph.prototype.uncombo = function (combo, stack) {
    var _this = this;
    var _a, _b;
    if (stack === void 0) {
      stack = true;
    }
    var self = this;
    var comboItem = combo;
    if (isString(combo)) {
      comboItem = this.findById(combo);
    }
    if (!comboItem || comboItem.getType && comboItem.getType() !== 'combo') {
      console.warn('The item is not a combo!');
      return;
    }
    var comboModel = comboItem.getModel();
    var parentId = comboItem.getModel().parentId;
    var comboTrees = self.get('comboTrees');
    if (!comboTrees) comboTrees = [];
    var itemMap = this.get('itemMap');
    var comboId = comboItem.get('id');
    var treeToBeUncombo;
    var brothers = [];
    var comboItems = this.get('combos');
    var parentItem = this.findById(parentId);
    var shouldStack = stack && this.get('enabledStack');
    var comboConfig = {};
    if (shouldStack) {
      comboConfig = clone(comboModel);
      comboConfig.children = [];
    }
    comboTrees.forEach(function (ctree) {
      if (treeToBeUncombo) return; // terminate the forEach
      traverseTreeUp(ctree, function (subtree) {
        var _a;
        // find the combo to be uncomboed, delete the combo from map and cache
        if (subtree.id === comboId) {
          treeToBeUncombo = subtree;
          // delete the related edges
          var edgeIds = comboItem.getEdges().map(function (edge) {
            return edge.getID();
          });
          edgeIds.forEach(function (edgeId) {
            _this.removeItem(edgeId, false);
          });
          var index = comboItems.indexOf(comboItem);
          comboItems.splice(index, 1);
          delete itemMap[comboId];
          var itemModel = clone(comboItem.getModel());
          comboItem.destroy();
          _this.emit('afterremoveitem', {
            item: itemModel,
            type: 'combo'
          });
        }
        // find the parent to remove the combo from the combo's brothers array and add the combo's children to the combo's brothers array in the tree
        if (parentId && treeToBeUncombo && subtree.id === parentId) {
          parentItem.removeCombo(comboItem);
          brothers = subtree.children; // the combo's brothers
          // remove the combo from its brothers array
          var index = brothers.indexOf(treeToBeUncombo);
          if (index !== -1) {
            brothers.splice(index, 1);
          }
          // append the combo's children to the combo's brothers array
          (_a = treeToBeUncombo.children) === null || _a === void 0 ? void 0 : _a.forEach(function (child) {
            var item = _this.findById(child.id);
            var childModel = item.getModel();
            if (item.getType && item.getType() === 'combo') {
              child.parentId = parentId;
              delete child.comboId;
              childModel.parentId = parentId; // update the parentId of the model
              delete childModel.comboId;
            } else if (item.getType && item.getType() === 'node') {
              child.comboId = parentId;
              childModel.comboId = parentId; // update the parentId of the model
            }

            parentItem.addChild(item);
            brothers.push(child);
          });
          _this.updateCombo(parentItem);
          return false;
        }
        return true;
      });
    });
    // if the parentId is not found, remove the combo from the roots
    if (!parentId && treeToBeUncombo) {
      var index = comboTrees.indexOf(treeToBeUncombo);
      comboTrees.splice(index, 1);
      // modify the parentId of the children
      (_a = treeToBeUncombo.children) === null || _a === void 0 ? void 0 : _a.forEach(function (child) {
        child.parentId = undefined;
        var childModel = _this.findById(child.id).getModel();
        delete childModel.parentId; // update the parentId of the model
        delete childModel.comboId; // update the comboId of the model
        if (child.itemType !== 'node') comboTrees.push(child);
      });
    }
    if (shouldStack) {
      // cache the children's old parent and combo model for stack
      var childrenParentCache_1 = {
        nodes: [],
        combos: []
      };
      var childNewParent_1 = {
        nodes: [],
        combos: []
      };
      (_b = treeToBeUncombo.children) === null || _b === void 0 ? void 0 : _b.forEach(function (child) {
        var childItem = _this.findById(child.id);
        var childType = childItem.getType();
        if (childType !== 'node' && childType !== 'combo') return;
        childrenParentCache_1["".concat(childType, "s")].push({
          id: child.id,
          parentId: comboId
        });
        childNewParent_1["".concat(childType, "s")].push({
          id: child.id,
          parentId: parentId
        });
      });
      childrenParentCache_1.combos.push(comboConfig);
      this.pushStack('uncombo', {
        before: childrenParentCache_1,
        after: childNewParent_1
      });
    }
  };
  /**
   * 根据 combo 位置更新内部节点位置 followCombo = true
   * 或根据内部元素的 bbox 更新所有 combos 的绘制，包括 combos 的位置和范围，followCombo = false
   */
  AbstractGraph.prototype.updateCombos = function (followCombo) {
    var _this = this;
    if (followCombo === void 0) {
      followCombo = false;
    }
    var self = this;
    var comboTrees = this.get('comboTrees');
    var itemController = self.get('itemController');
    var itemMap = self.get('itemMap');
    (comboTrees || []).forEach(function (ctree) {
      traverseTreeUp(ctree, function (child) {
        var _a;
        if (!child) {
          return true;
        }
        var childItem = itemMap[child.id];
        if (((_a = childItem === null || childItem === void 0 ? void 0 : childItem.getType) === null || _a === void 0 ? void 0 : _a.call(childItem)) === 'combo') {
          // 更新具体的 Combo 之前先清除所有的已有状态，以免将 state 中的样式更新为 Combo 的样式
          var states = __spreadArray([], childItem.getStates(), true);
          each(states, function (state) {
            return _this.setItemState(childItem, state, false);
          });
          // 更新具体的 Combo
          itemController.updateCombo(childItem, child.children, followCombo);
          // 更新 Combo 后，还原已有的状态
          each(states, function (state) {
            return _this.setItemState(childItem, state, true);
          });
        }
        return true;
      });
    });
    self.sortCombos();
  };
  /**
   * 根据节点的 bbox 更新 combo 及其祖先 combos 的绘制，包括 combos 的位置和范围
   * @param {String | ICombo} combo 需要被更新的 Combo 或 id，若指定，则该 Combo 及所有祖先 Combod 都会被更新
   */
  AbstractGraph.prototype.updateCombo = function (combo) {
    var _this = this;
    var self = this;
    var comboItem = combo;
    var comboId;
    if (isString(combo)) {
      comboItem = this.findById(combo);
    }
    if (!comboItem || comboItem.getType && comboItem.getType() !== 'combo') {
      console.warn('The item to be updated is not a combo!');
      return;
    }
    comboId = comboItem.get('id');
    var comboTrees = this.get('comboTrees');
    var itemController = self.get('itemController');
    var itemMap = self.get('itemMap');
    (comboTrees || []).forEach(function (ctree) {
      traverseTreeUp(ctree, function (child) {
        if (!child) {
          return true;
        }
        var childItem = itemMap[child.id];
        if (comboId === child.id && childItem && childItem.getType && childItem.getType() === 'combo') {
          // 更新具体的 Combo 之前先清除所有的已有状态，以免将 state 中的样式更新为 Combo 的样式
          var states = __spreadArray([], childItem.getStates(), true);
          // || !item.getStateStyle(stateName)
          each(states, function (state) {
            if (childItem.getStateStyle(state)) {
              _this.setItemState(childItem, state, false);
            }
          });
          // 更新具体的 Combo
          itemController.updateCombo(childItem, child.children);
          // 更新 Combo 后，还原已有的状态
          each(states, function (state) {
            if (childItem.getStateStyle(state)) {
              _this.setItemState(childItem, state, true);
            }
          });
          if (comboId) comboId = child.parentId;
        }
        return true;
      });
    });
  };
  /**
   * 更新树结构，例如移动子树等
   * @param {String | INode | ICombo} item 需要被更新的 Combo 或 节点 id
   * @param {string | undefined} parentId 新的父 combo id，undefined 代表没有父 combo
   */
  AbstractGraph.prototype.updateComboTree = function (item, parentId, stack) {
    if (stack === void 0) {
      stack = true;
    }
    var self = this;
    this.set('comboSorted', false);
    var uItem;
    if (isString(item)) {
      uItem = self.findById(item);
    } else {
      uItem = item;
    }
    var model = uItem.getModel();
    var oldParentId = model.comboId || model.parentId;
    var type = '';
    if (uItem.getType) type = uItem.getType();
    // 若 item 是 Combo，且 parentId 是其子孙 combo 的 id，则警告并终止
    if (parentId && type === 'combo') {
      var comboTrees = this.get('comboTrees');
      var valid_1 = true;
      var itemSubTree_1;
      (comboTrees || []).forEach(function (ctree) {
        if (itemSubTree_1) return;
        traverseTree(ctree, function (subTree) {
          if (itemSubTree_1) return;
          // 找到从 item 开始的子树
          if (subTree.id === uItem.getID()) {
            itemSubTree_1 = subTree;
          }
          return true;
        });
      });
      // 在以 item 为根的子树中寻找与 parentId 相同的后继元素
      traverseTree(itemSubTree_1, function (subTree) {
        if (subTree.id === parentId) {
          valid_1 = false;
          return false;
        }
        return true;
      });
      // parentId 是 item 的一个后继元素，不能进行更新
      if (!valid_1) {
        console.warn('Failed to update the combo tree! The parentId points to a descendant of the combo!');
        return;
      }
    }
    if (stack && this.get('enabledStack')) {
      var beforeData = {},
        afterData = {};
      if (type === 'combo') {
        beforeData.combos = [{
          id: model.id,
          parentId: model.parentId
        }];
        afterData.combos = [{
          id: model.id,
          parentId: parentId
        }];
      } else if (type === 'node') {
        beforeData.nodes = [{
          id: model.id,
          parentId: model.comboId
        }];
        afterData.nodes = [{
          id: model.id,
          parentId: parentId
        }];
      }
      this.pushStack('updateComboTree', {
        before: beforeData,
        after: afterData
      });
    }
    // 当 combo 存在 parentId 或 comboId 时，才将其移除
    if (model.parentId || model.comboId) {
      var combo = this.findById(model.parentId || model.comboId);
      if (combo) {
        combo.removeChild(uItem);
      }
    }
    if (type === 'combo') {
      model.parentId = parentId;
    } else if (type === 'node') {
      model.comboId = parentId;
    }
    // 只有当移入到指定 combo 时才添加
    if (parentId) {
      var parentCombo = this.findById(parentId);
      if (parentCombo) {
        // 将元素添加到 parentCombo 中
        parentCombo.addChild(uItem);
      }
    }
    // 如果原先有父亲 combo，则从原父 combo 的子元素数组中删除
    if (oldParentId) {
      var parentCombo = this.findById(oldParentId);
      if (parentCombo) {
        // 将元素从 parentCombo 中移除
        parentCombo.removeChild(uItem);
      }
    }
    var newComboTrees = reconstructTree(this.get('comboTrees'), model.id, parentId);
    this.set('comboTrees', newComboTrees);
    this.updateCombos();
  };
  /**
   * 导出图数据
   * @return {object} data
   */
  AbstractGraph.prototype.save = function () {
    var nodes = [];
    var edges = [];
    var combos = [];
    each(this.get('nodes'), function (node) {
      nodes.push(node.getModel());
    });
    each(this.get('edges'), function (edge) {
      edges.push(edge.getModel());
    });
    each(this.get('combos'), function (combo) {
      combos.push(combo.getModel());
    });
    return {
      nodes: nodes,
      edges: edges,
      combos: combos
    };
  };
  /**
   * 改变画布大小
   * @param  {number} width  画布宽度
   * @param  {number} height 画布高度
   * @return {object} this
   */
  AbstractGraph.prototype.changeSize = function (width, height) {
    var viewController = this.get('viewController');
    viewController.changeSize(width, height);
    return this;
  };
  /**
   * 当源数据在外部发生变更时，根据新数据刷新视图。但是不刷新节点位置
   */
  AbstractGraph.prototype.refresh = function () {
    var self = this;
    self.emit('beforegraphrefresh');
    if (self.get('animate')) {
      self.positionsAnimate();
    } else {
      var nodes = self.get('nodes');
      var edges = self.get('edges');
      var vedges = self.get('edges');
      each(nodes, function (node) {
        node.refresh();
      });
      each(edges, function (edge) {
        edge.refresh();
      });
      each(vedges, function (vedge) {
        vedge.refresh();
      });
    }
    self.emit('aftergraphrefresh');
    self.autoPaint();
  };
  /**
   * 获取当前图中所有节点的item实例
   * @return {INode} item数组
   */
  AbstractGraph.prototype.getNodes = function () {
    return this.get('nodes');
  };
  /**
   * 获取当前图中所有边的item实例
   * @return {IEdge} item数组
   */
  AbstractGraph.prototype.getEdges = function () {
    return this.get('edges');
  };
  /**
   * 获取图中所有的 combo 实例
   */
  AbstractGraph.prototype.getCombos = function () {
    return this.get('combos');
  };
  /**
   * 获取指定 Combo 中所有的节点
   * @param comboId combo ID
   */
  AbstractGraph.prototype.getComboChildren = function (combo) {
    if (isString(combo)) {
      combo = this.findById(combo);
    }
    if (!combo || combo.getType && combo.getType() !== 'combo') {
      console.warn('The combo does not exist!');
      return;
    }
    return combo.getChildren();
  };
  /**
   * 根据 graph 上的 animateCfg 进行视图中节点位置动画接口
   */
  AbstractGraph.prototype.positionsAnimate = function (referComboModel) {
    var self = this;
    self.emit('beforeanimate');
    var animateCfg = self.get('animateCfg');
    var onFrame = animateCfg.onFrame;
    var nodes = referComboModel ? self.getNodes().concat(self.getCombos()) : self.getNodes();
    var toNodes = nodes.map(function (node) {
      var model = node.getModel();
      return {
        id: model.id,
        x: model.x,
        y: model.y
      };
    });
    self.stopAnimate();
    var canvas = self.get('canvas');
    self.animating = true;
    canvas.animate(function (ratio) {
      each(toNodes, function (data) {
        var node = self.findById(data.id);
        if (!node || node.destroyed) {
          return;
        }
        var originAttrs = node.get('originAttrs');
        var model = node.get('model');
        var containerMatrix = node.getContainer().getMatrix();
        if (originAttrs === undefined || originAttrs === null) {
          // 变换前存在位置，设置到 originAttrs 上。否则标记 0 表示变换前不存在位置，不需要计算动画
          if (containerMatrix) {
            originAttrs = {
              x: containerMatrix[6],
              y: containerMatrix[7]
            };
          }
          node.set('originAttrs', originAttrs || 0);
        }
        if (onFrame) {
          var attrs = onFrame(node, ratio, data, originAttrs || {
            x: 0,
            y: 0
          });
          node.set('model', Object.assign(model, attrs));
        } else if (originAttrs) {
          // 变换前存在位置，进行动画
          model.x = originAttrs.x + (data.x - originAttrs.x) * ratio;
          model.y = originAttrs.y + (data.y - originAttrs.y) * ratio;
        } else {
          // 若在变换前不存在位置信息，则直接放到最终位置上
          model.x = data.x;
          model.y = data.y;
        }
      });
      self.refreshPositions(referComboModel);
    }, {
      duration: animateCfg.duration,
      easing: animateCfg.easing,
      callback: function callback() {
        each(nodes, function (node) {
          node.set('originAttrs', null);
        });
        if (animateCfg.callback) {
          animateCfg.callback();
        }
        self.emit('afteranimate');
        self.animating = false;
      }
    });
  };
  /**
   * 当节点位置在外部发生改变时，刷新所有节点位置，重计算边
   */
  AbstractGraph.prototype.refreshPositions = function (referComboModel) {
    var self = this;
    self.emit('beforegraphrefreshposition');
    var nodes = self.get('nodes');
    var edges = self.get('edges');
    var vedges = self.get('vedges');
    var combos = self.get('combos');
    var model;
    var updatedNodes = {};
    var updateItems = function updateItems(items) {
      each(items, function (item) {
        model = item.getModel();
        var originAttrs = item.get('originAttrs');
        if (originAttrs && model.x === originAttrs.x && model.y === originAttrs.y) {
          return;
        }
        var changed = item.updatePosition({
          x: model.x,
          y: model.y
        });
        updatedNodes[model.id] = changed;
        if (model.comboId) updatedNodes[model.comboId] = updatedNodes[model.comboId] || changed;
        if (model.parentId) updatedNodes[model.parentId] = updatedNodes[model.parentId] || changed;
      });
    };
    updateItems(combos);
    updateItems(nodes);
    if (combos && combos.length !== 0) {
      if (referComboModel) {
        updateItems(combos);
        self.updateCombos();
      } else {
        self.updateCombos();
      }
    }
    each(edges, function (edge) {
      var sourceModel = edge.getSource().getModel();
      var target = edge.getTarget();
      // 避免 target 是纯对象的情况下调用 getModel 方法
      // 拖动生成边的时候 target 会是纯对象
      if (!isPlainObject(target)) {
        var targetModel = target.getModel();
        if (updatedNodes[sourceModel.id] || updatedNodes[targetModel.id] || edge.getModel().isComboEdge) {
          edge.refresh();
        }
      }
    });
    each(vedges, function (vedge) {
      vedge.refresh();
    });
    self.emit('aftergraphrefreshposition');
    self.autoPaint();
  };
  AbstractGraph.prototype.stopAnimate = function () {
    if (this.isAnimating()) {
      this.get('canvas').stopAnimate();
    }
  };
  AbstractGraph.prototype.isAnimating = function () {
    return this.animating;
  };
  /**
   * 获取当前视口伸缩比例
   * @return {number} 比例
   */
  AbstractGraph.prototype.getZoom = function () {
    var matrix = this.get('group').getMatrix();
    return matrix ? matrix[0] : 1;
  };
  /**
   * 获取当前的行为模式
   * @return {string} 当前行为模式
   */
  AbstractGraph.prototype.getCurrentMode = function () {
    var modeController = this.get('modeController');
    return modeController.getMode();
  };
  /**
   * 切换行为模式
   * @param {string} mode 指定模式
   * @return {object} this
   */
  AbstractGraph.prototype.setMode = function (mode) {
    var modeController = this.get('modeController');
    modeController.setMode(mode);
    return this;
  };
  /**
   * 清除画布元素
   * @return {object} this
   */
  AbstractGraph.prototype.clear = function (avoidEmit) {
    var _a;
    if (avoidEmit === void 0) {
      avoidEmit = false;
    }
    (_a = this.get('canvas')) === null || _a === void 0 ? void 0 : _a.clear();
    this.initGroups();
    // 清空画布时同时清除数据
    this.set({
      itemMap: {},
      nodes: [],
      edges: [],
      vedges: [],
      groups: [],
      combos: [],
      comboTrees: []
    });
    if (!avoidEmit) this.emit('afterrender');
    return this;
  };
  /**
   * 更换布局配置项
   * @param {object} cfg 新布局配置项
   * @param {'center' | 'begin'} align 对齐方式，可选中心（center）对齐到对齐点，或左上角（begin）对齐到对齐点
   * @param {IPoint} alignPoint 画布上的对齐点，为 Canvas 坐标系（Canvas DOM）
   * 若 cfg 含有 type 字段或为 String 类型，且与现有布局方法不同，则更换布局
   * 若 cfg 不包括 type ，则保持原有布局方法，仅更新布局配置项
   */
  AbstractGraph.prototype.updateLayout = function (cfg, align, alignPoint, stack) {
    var _this = this;
    if (cfg === void 0) {
      cfg = {};
    }
    if (stack === void 0) {
      stack = true;
    }
    var layoutController = this.get('layoutController');
    if (isString(cfg)) {
      cfg = {
        type: cfg
      };
    }
    // align the graph after layout
    if (align) {
      var toPoint_1 = alignPoint;
      if (!toPoint_1) {
        if (align === 'begin') toPoint_1 = {
          x: 0,
          y: 0
        };else toPoint_1 = {
          x: this.getWidth() / 2,
          y: this.getHeight() / 2
        };
      }
      // translate to point coordinate system
      toPoint_1 = this.getPointByCanvas(toPoint_1.x, toPoint_1.y);
      var forceTypes = ['force', 'gForce', 'fruchterman', 'force2'];
      // if it is force layout, only center takes effect, and assign center force
      if (forceTypes.includes(cfg.type) || !cfg.type && forceTypes.includes(layoutController === null || layoutController === void 0 ? void 0 : layoutController.layoutType)) {
        cfg.center = [toPoint_1.x, toPoint_1.y];
      } else {
        this.once('afterlayout', function (e) {
          var matrix = _this.getGroup().getMatrix() || [1, 0, 0, 0, 1, 0, 0, 0, 1];
          toPoint_1.x = toPoint_1.x * matrix[0] + matrix[6];
          toPoint_1.y = toPoint_1.y * matrix[0] + matrix[7];
          var _a = _this.getGroup().getCanvasBBox(),
            minX = _a.minX,
            maxX = _a.maxX,
            minY = _a.minY,
            maxY = _a.maxY;
          var bboxPoint = {
            x: (minX + maxX) / 2,
            y: (minY + maxY) / 2
          };
          if (align === 'begin') {
            bboxPoint.x = minX;
            bboxPoint.y = minY;
          }
          _this.translate(toPoint_1.x - bboxPoint.x, toPoint_1.y - bboxPoint.y);
        });
      }
    }
    var oriLayoutCfg = __assign({}, this.get('layout'));
    var layoutCfg = {};
    Object.assign(layoutCfg, oriLayoutCfg, cfg);
    if (cfg.pipes && !cfg.type) delete layoutCfg.type;else if (!cfg.pipes && layoutCfg.type) delete layoutCfg.pipes;
    this.set('layout', layoutCfg);
    if (!layoutController) return;
    if (layoutController.isLayoutTypeSame(layoutCfg) && layoutCfg.gpuEnabled === oriLayoutCfg.gpuEnabled) {
      // no type or same type, or switch the gpu and cpu, update layout
      layoutController.updateLayoutCfg(layoutCfg);
    } else {
      // has different type, change layout
      layoutController.changeLayout(layoutCfg);
    }
    if (stack && this.get('enabledStack')) {
      this.pushStack('layout', {
        before: oriLayoutCfg,
        after: layoutCfg
      });
    }
  };
  /**
   * 销毁布局，changeData 时不会再使用原来的布局方法对新数据进行布局
   */
  AbstractGraph.prototype.destroyLayout = function () {
    var layoutController = this.get('layoutController');
    layoutController === null || layoutController === void 0 ? void 0 : layoutController.destroyLayout();
  };
  /**
   * 重新以当前示例中配置的属性进行一次布局
   */
  AbstractGraph.prototype.layout = function () {
    var _a;
    var layoutController = this.get('layoutController');
    var layoutCfg = this.get('layout');
    if (!layoutCfg || !layoutController) return;
    if (layoutCfg.workerEnabled) {
      // 如果使用web worker布局
      layoutController.layout();
      return;
    }
    if ((_a = layoutController.layoutMethods) === null || _a === void 0 ? void 0 : _a.length) {
      layoutController.relayout(true);
    } else {
      layoutController.layout();
    }
  };
  /**
   * 收起指定的 combo
   * @param {string | ICombo} combo combo ID 或 combo item
   */
  AbstractGraph.prototype.collapseCombo = function (combo, stack) {
    var _this = this;
    if (stack === void 0) {
      stack = true;
    }
    if (this.destroyed) return;
    if (isString(combo)) {
      combo = this.findById(combo);
    }
    if (!combo) {
      console.warn('The combo to be collapsed does not exist!');
      return;
    }
    this.emit('beforecollapseexpandcombo', {
      action: 'expand',
      item: combo
    });
    var comboModel = combo.getModel();
    var itemController = this.get('itemController');
    itemController.collapseCombo(combo, stack);
    comboModel.collapsed = true;
    // add virtual edges
    var edges = this.getEdges().concat(this.get('vedges'));
    // find all the descendant nodes and combos
    var cNodesCombos = [];
    var comboTrees = this.get('comboTrees');
    var found = false;
    let foundDepth; // <---------- ADDED CHANGES
    let cNodesCombosID = []; //<=====UNEW
    (comboTrees || []).forEach(function (ctree) {
      if (found) return; // if the combo is found, terminate the forEach
      traverseTree(ctree, function(subTree){
        // if the combo is found and it is traversing the other branches, terminate
        if (found && ((subTree.depth <= foundDepth) || (subTree.parentId !== comboModel.id))) { // <---------- ADDED CHANGES
          if (subTree.itemType === "combo" 
          && !cNodesCombosID.includes(subTree.parentId) //<=====UNEW
          )   return false;  // <---------- ADDED CHANGES
        } //<=====UPDATED
        // if the combo is found or in the children
        if (comboModel.id === subTree.id) 
        { 
          found = true;
          foundDepth = subTree.depth; // <---------- ADDED CHANGES
        }
        if (found) {
          // if the combo is found, concat the descendant nodes and combos
          var item = _this.findById(subTree.id);
          if (item && item.getType && item.getType() === 'combo') {
            cNodesCombosID.push(subTree.id); //<=====UNEW
            cNodesCombos = cNodesCombos.concat(item.getNodes());
            cNodesCombos = cNodesCombos.concat(item.getCombos());
          }
        }
        return true;
      });
    });
    var addedVEdgeMap = {};
    edges.forEach(function (edge) {
      var _a = edge.getModel(),
        isVEdge = _a.isVEdge,
        _b = _a.size,
        size = _b === void 0 ? 1 : _b;
      if (edge.isVisible() && !isVEdge) return;
      // the code needs to work when the edge is !isVisible();
      // now the edge is not visible, so the code gets to work, but why is it not catching edgeInfo to generate vedge?
      // and the combo doesn't hold the vedge details anymore
      //---> 1) should we  flip the positions of the code so it acts on the edges first?
      //---> 2) 
      var source = edge.getSource();
      var target = edge.getTarget();
      var otherEnd = null;
      var otherEndIsSource;
      if (source.getModel().id === comboModel.id || cNodesCombos.includes(source) && !cNodesCombos.includes(target)) {
        // source is the current combo, or descent node/combo is the source but not the target)
        otherEnd = target;
        otherEndIsSource = false;
      } else if (target.getModel().id === comboModel.id || !cNodesCombos.includes(source) && cNodesCombos.includes(target)) {
        // target is the current combo, or descent node/combo is the target but not the source)
        otherEnd = source;
        otherEndIsSource = true;
      }
      if (otherEnd) {
 
        // RH: removes VE of a combo if there is already a VE attached. !! 
        // no identificiation of existent VEs to Edges
        // no fixed MAPPING TO HOLD
        
        if (isVEdge) { // to remove repeats if a VE is already present from the otherEnd
          _this.removeItem(edge, false);
          return;
        }
        // * before collapseCombo, standard edge will always be touching nodes

        var otherEndModel = otherEnd.getModel();       
        var otherEndC = otherEnd
        if(otherEnd.getModel().comboId!==undefined){
          console.warn('aa')
          var otherEndP=_this.findById(otherEnd.getModel().comboId);
          if(otherEndP.getModel().collapsed)otherEndC=otherEndP
          while(otherEndP.getModel().parentId!==undefined){
            otherEndP=_this.findById(otherEndP.getModel().parentId);
            if(otherEndP.getModel().collapsed)otherEndC=otherEndP
          }
          console.warn(otherEndC.getModel().id)
        }




        // while loop : from inner combo  to outer combo | lower to higher, 
        //              to find highest element that is hidden. 
        //             >> v. trasversal is needed as std edges only connect node to node.
        //   while (!otherEnd.isVisible()) {
        //     var otherEndPId = otherEndModel.parentId,
        //       otherEndCId = otherEndModel.comboId;
        //     var otherEndParentId = otherEndPId || otherEndCId; // the other end could be a node or a combo
        //     // traversal step: point otherEnd to its parent
        //     otherEnd = _this.findById(otherEndParentId);
        //     //if (!otherEnd || !otherEndParentId) return; // all the ancestors are hidden, then ignore the edge - NOT USED
        //     // code above -> return SKIPS THE ENTIRE REMAINDER of this loop of .forEach((edge) => {})
        //     if (!otherEnd || !otherEndParentId) break; // all the ancestors are hidden, then ignore the edge -CHANGED!
        //     // code above -> break exits only this WHILE LOOP and continues with code below
        //     if(!otherEnd.getModel().collapsed) break;  // ====> ADDED
        //     otherEndModel = otherEnd.getModel();
        //     // otherEndModel will be that of its parent or ancestor // ====> ADDED
        //   }
        // // otherEnd will keep pointing at highest invisible parent:
        // var otherEndId = otherEndModel.id;


        var otherEndId = otherEndC.getModel().id  // <===== LESLIE
        console.log(otherEndC.getModel().id)      // <===== LESLIE
        // custodiotech: for adding back VE for combos, nodes hidden by timeBar
        // how do we pick up exactly the node or the correct combo layer?
        // if it isn't collapsed or collapsedByCombo, we know then the edge or vEdge points to it
        var vEdgeInfo = otherEndIsSource ? {
          source: otherEndId,
          target: comboModel.id,
          size: size,
          isVEdge: true,
          visible: edge.getModel().inRange
        } : {
          source: comboModel.id,
          target: otherEndId,
          size: size,
          isVEdge: true,
          visible: edge.getModel().inRange
        };
        // console.warn('vEdgeInfo:', vEdgeInfo);
        var key = "".concat(vEdgeInfo.source, "-").concat(vEdgeInfo.target);
        if (addedVEdgeMap[key]) {
          addedVEdgeMap[key].size += size;
          return;
        }
        addedVEdgeMap[key] = vEdgeInfo;
      }
    });
    console.warn('C: addedVEdgeMap', addedVEdgeMap);
    // update the width of the virtual edges, which is the sum of merged actual edges
    // be attention that the actual edges with same endpoints but different directions will be represented by two different virtual edges
    this.addItems(Object.values(addedVEdgeMap).map(function (edgeInfo) {
      return {
        type: 'vedge',
        model: edgeInfo
      };
    }), false);
    this.emit('aftercollapseexpandcombo', {
      action: 'collapse',
      item: combo
    });
  };
  /**
   * 展开指定的 combo
   * @param {string | ICombo} combo combo ID 或 combo item
   */
  AbstractGraph.prototype.expandCombo = function (combo, stack) {
    var _this = this;
    if (stack === void 0) {
      stack = true;
    }
    if (isString(combo)) {
      combo = this.findById(combo);
    }
    if (!combo || combo.getType && combo.getType() !== 'combo') {
      console.warn('The combo to be collapsed does not exist!');
      return;
    }
    this.emit('beforecollapseexpandcombo', {
      action: 'expand',
      item: combo
    });
    var comboModel = combo.getModel();
    var itemController = this.get('itemController');
    itemController.expandCombo(combo, stack);
    comboModel.collapsed = false;
    // add virtual edges
    var edges = this.getEdges().concat(this.get('vedges'));
    // find all the descendant nodes and combos
    var cNodesCombos = [];
    var comboTrees = this.get('comboTrees');
    var found = false;
    let foundDepth; // <---------- ADDED CHANGES
    let cNodesCombosID = []; //<=====UNEW
    (comboTrees || []).forEach(function (ctree) {
      if (found) return; // if the combo is found, terminate
      traverseTree(ctree, function (subTree) {
        // if the combo is found and it is traversing the other branches, terminate
        if (found && 
          ((subTree.depth <= foundDepth) || (subTree.parentId !== comboModel.id))
          ) { // <---------- ADDED CHANGES
          if (
            subTree.itemType === "combo" && 
            !cNodesCombosID.includes(subTree.parentId) //<=====UNEW
            ) return false;  // <---------- ADDED CHANGES
        } //<=====UPDATED 
        // if the combo is found or in the children
        if (comboModel.id === subTree.id) {
          found = true;
          foundDepth = subTree.depth; // <---------- ADDED CHANGES
        }
        if (found) {
          // if the combo is found, concat the descendant nodes and combos
          var item = _this.findById(subTree.id);
          if (item && item.getType && item.getType() === 'combo') {
            cNodesCombosID.push(subTree.id); //<=====UNEW
            cNodesCombos = cNodesCombos.concat(item.getNodes());
            cNodesCombos = cNodesCombos.concat(item.getCombos());
          }
        }
        return true;
      });
    });
    var addedVEdgeMap = {};
    edges.forEach(function (edge) {
      if (edge.isVisible() && !edge.getModel().isVEdge) return;
      var source = edge.getSource();
      var target = edge.getTarget();
      var sourceId = source.get('id');
      var targetId = target.get('id');
      var otherEnd = null;
      var otherEndIsSource;
      if (sourceId === comboModel.id || cNodesCombos.includes(source) && !cNodesCombos.includes(target)) {
        // the source is in the combo, the target is not
        otherEnd = target;
        otherEndIsSource = false;
      } else if (targetId === comboModel.id || !cNodesCombos.includes(source) && cNodesCombos.includes(target)) {
        // the target is in the combo, the source is not
        otherEnd = source;
        otherEndIsSource = true;
      } else if (cNodesCombos.includes(source) && cNodesCombos.includes(target)) {
        // both source and target are in the combo, if the target and source are both visible, show the edge
        if (source.isVisible() && target.isVisible()) {
          edge.show();
        }
      }
      if (otherEnd) {
        var _a = edge.getModel(),
          isVEdge = _a.isVEdge,
          _b = _a.size,
          size = _b === void 0 ? 1 : _b;
        // ignore the virtual edges
        if (isVEdge) {
          _this.removeItem(edge, false);
          return;
        }
        var otherEndModel = otherEnd.getModel();
        // find the nearest visible ancestor
        while (!otherEnd.isVisible()) {
          var otherEndPId = otherEndModel.parentId,
            otherEndCId = otherEndModel.comboId;
          var otherEndParentId = otherEndPId || otherEndCId;
          otherEnd = _this.findById(otherEndParentId);
          // if (!otherEnd || !otherEndParentId) {
          //   return; // if all the ancestors of the oppsite are all hidden, ignore the edge
          // }
          if (!otherEnd || !otherEndParentId) break; // if all the ancestors of the oppsite are all hidden, ignore the edge
          otherEndModel = otherEnd.getModel();
          if (otherEnd.getModel().collapsed) break;
        }
        
        var otherEndId = otherEndModel.id;
        var selfEnd = otherEndIsSource ? target : source;
        var selfEndModel = selfEnd.getModel();
        // find the nearest visible ancestor
        while (!selfEnd.isVisible()) {
          var selfEndPId = selfEndModel.parentId,
            selfEndCId = selfEndModel.comboId;
          var selfEndParentId = selfEndPId || selfEndCId;
          selfEnd = _this.findById(selfEndParentId);
          if (!selfEnd || !selfEndParentId) {
            return; // if all the ancestors of the oppsite are all hidden, ignore the edge
          }

          if (selfEndModel.comboId === comboModel.id || selfEndModel.parentId === comboModel.id) {
            break; // if the next ancestor is the combo, break the while
          }

          selfEndModel = selfEnd.getModel();
        }
        var selfEndId = selfEndModel.id;
        if (otherEndId) {
          var vEdgeInfo = otherEndIsSource ? {
            source: otherEndId,
            target: selfEndId,
            isVEdge: true,
            visible: edge.getModel().inRange,
            size: size
          } : {
            source: selfEndId,
            target: otherEndId,
            isVEdge: true,
            visible: edge.getModel().inRange,
            size: size
          };
          var vedgeId = "".concat(vEdgeInfo.source, "-").concat(vEdgeInfo.target);
          // update the width of the virtual edges, which is the sum of merged actual edges
          // be attention that the actual edges with same endpoints but different directions will be represented by two different virtual edges
          if (addedVEdgeMap[vedgeId]) {
            addedVEdgeMap[vedgeId].size += size;
            return;
          }
          addedVEdgeMap[vedgeId] = vEdgeInfo;
        }
      }
    });
    console.warn('E: addedVEdgeMap', addedVEdgeMap);
    this.addItems(Object.values(addedVEdgeMap).map(function (edgeInfo) {
      return {
        type: 'vedge',
        model: edgeInfo
      };
    }), false);
    this.emit('aftercollapseexpandcombo', {
      action: 'expand',
      item: combo
    });
  };
  AbstractGraph.prototype.collapseExpandCombo = function (combo, stack) {
    if (stack === void 0) {
      stack = true;
    }
    if (isString(combo)) {
      combo = this.findById(combo);
    }
    if (!combo || combo.getType && combo.getType() !== 'combo') return;
    var comboModel = combo.getModel();
    // if one ancestor combo of the combo is collapsed, it should not be collapsed or expanded
    var parentItem = this.findById(comboModel.parentId);
    while (parentItem) {
      var parentModel = parentItem.getModel();
      if (parentModel.collapsed) {
        console.warn("Fail to expand the combo since it's ancestor combo is collapsed.");
        parentItem = undefined;
        return;
      }
      parentItem = this.findById(parentModel.parentId);
    }
    var collapsed = comboModel.collapsed;
    // 该群组已经处于收起状态，需要展开
    if (collapsed) {
      this.expandCombo(combo, stack);
    } else {
      this.collapseCombo(combo, stack);
    }
    this.updateCombo(combo);
  };
  /**
   * 获取节点所有的邻居节点
   *
   * @param {(string | INode)} node 节点 ID 或实例
   * @returns {INode[]}
   * @memberof IAbstractGraph
   */
  AbstractGraph.prototype.getNeighbors = function (node, type) {
    var item = node;
    if (isString(node)) {
      item = this.findById(node);
    }
    return item.getNeighbors(type);
  };
  /**
   * 获取 node 的度数
   *
   * @param {(string | INode)} node 节点 ID 或实例
   * @param {('in' | 'out' | 'total' | 'all' | undefined)} 度数类型，in 入度，out 出度，total 总度数，all 返回三种类型度数的对象
   * @returns {Number | Object} 该节点的度数
   * @memberof IAbstractGraph
   */
  AbstractGraph.prototype.getNodeDegree = function (node, type, refresh) {
    if (type === void 0) {
      type = undefined;
    }
    if (refresh === void 0) {
      refresh = false;
    }
    var item = node;
    if (isString(node)) {
      item = this.findById(node);
    }
    var degrees = this.get('degrees');
    if (!degrees || refresh) {
      degrees = getDegree(this.save());
      this.set('degrees', degrees);
    }
    var nodeDegrees = degrees[item.getID()];
    var res = 0;
    // 如果是通过 addItem 后面新增加的节点，此时它的所有度数都为 0
    if (!nodeDegrees) {
      return 0;
    }
    switch (type) {
      case 'in':
        res = nodeDegrees.inDegree;
        break;
      case 'out':
        res = nodeDegrees.outDegree;
        break;
      case 'all':
        res = nodeDegrees;
        break;
      default:
        res = nodeDegrees.degree;
        break;
    }
    return res;
  };
  AbstractGraph.prototype.getUndoStack = function () {
    return this.undoStack;
  };
  AbstractGraph.prototype.getRedoStack = function () {
    return this.redoStack;
  };
  /**
   * 获取 undo 和 redo 栈的数据
   */
  AbstractGraph.prototype.getStackData = function () {
    if (!this.get('enabledStack')) {
      return null;
    }
    return {
      undoStack: this.undoStack.toArray(),
      redoStack: this.redoStack.toArray()
    };
  };
  /**
   * 清空 undo stack & redo stack
   */
  AbstractGraph.prototype.clearStack = function () {
    if (this.get('enabledStack')) {
      this.undoStack.clear();
      this.redoStack.clear();
      this.emit('stackchange', {
        undoStack: this.undoStack,
        redoStack: this.redoStack
      });
    }
  };
  /**
   * 将操作类型和操作数据入栈
   * @param action 操作类型
   * @param data 入栈的数据
   * @param stackType 栈的类型
   */
  AbstractGraph.prototype.pushStack = function (action, data, stackType) {
    if (action === void 0) {
      action = 'update';
    }
    if (stackType === void 0) {
      stackType = 'undo';
    }
    if (!this.get('enabledStack')) {
      console.warn('请先启用 undo & redo 功能，在实例化 Graph 时候配置 enabledStack: true !');
      return;
    }
    var stackData = data ? clone(data) : {
      before: {},
      after: clone(this.save())
    };
    if (stackType === 'redo') {
      this.redoStack.push({
        action: action,
        data: stackData
      });
    } else {
      this.undoStack.push({
        action: action,
        data: stackData
      });
    }
    this.emit('stackchange', {
      action: action,
      stackType: stackType,
      undoStack: this.undoStack,
      redoStack: this.redoStack
    });
  };
  /**
   * 获取邻接矩阵
   *
   * @param {boolean} cache 是否使用缓存的
   * @param {boolean} directed 是否是有向图，默认取 graph.directed
   * @returns {Matrix} 邻接矩阵
   * @memberof IAbstractGraph
   */
  AbstractGraph.prototype.getAdjMatrix = function (cache, directed) {
    if (cache === void 0) {
      cache = true;
    }
    if (directed === undefined) directed = this.get('directed');
    var currentAdjMatrix = this.get('adjMatrix');
    if (!currentAdjMatrix || !cache) {
      currentAdjMatrix = getAdjacentMatrix(this.save(), directed);
      this.set('adjMatrix', currentAdjMatrix);
    }
    return currentAdjMatrix;
  };
  /**
   * 获取最短路径矩阵
   *
   * @param {boolean} cache 是否使用缓存的
   * @param {boolean} directed 是否是有向图，默认取 graph.directed
   * @returns {Matrix} 最短路径矩阵
   * @memberof IAbstractGraph
   */
  AbstractGraph.prototype.getShortestPathMatrix = function (cache, directed) {
    if (cache === void 0) {
      cache = true;
    }
    if (directed === undefined) directed = this.get('directed');
    var currentAdjMatrix = this.get('adjMatrix');
    var currentShourtestPathMatrix = this.get('shortestPathMatrix');
    if (!currentAdjMatrix || !cache) {
      currentAdjMatrix = getAdjacentMatrix(this.save(), directed);
      this.set('adjMatrix', currentAdjMatrix);
    }
    if (!currentShourtestPathMatrix || !cache) {
      currentShourtestPathMatrix = floydWarshall(this.save(), directed);
      this.set('shortestPathMatrix', currentShourtestPathMatrix);
    }
    return currentShourtestPathMatrix;
  };
  /**
   * 重新定义监听函数，复写参数类型
   */
  AbstractGraph.prototype.on = function (eventName, callback, once) {
    return _super.prototype.on.call(this, eventName, callback, once);
  };
  /**
   * 销毁画布
   */
  AbstractGraph.prototype.destroy = function () {
    var _a, _b, _c, _d, _e;
    this.clear();
    // 清空栈数据
    this.clearStack();
    (_a = this.get('itemController')) === null || _a === void 0 ? void 0 : _a.destroy();
    (_b = this.get('modeController')) === null || _b === void 0 ? void 0 : _b.destroy();
    (_c = this.get('viewController')) === null || _c === void 0 ? void 0 : _c.destroy();
    (_d = this.get('stateController')) === null || _d === void 0 ? void 0 : _d.destroy();
    (_e = this.get('canvas')) === null || _e === void 0 ? void 0 : _e.destroy();
    this.cfg = null;
    this.destroyed = true;
    this.redoStack = null;
    this.undoStack = null;
  };
  /**
   * 创建凸包或凹包轮廓
   * @param cfg HullCfg 轮廓配置项
   */
  AbstractGraph.prototype.createHull = function (cfg) {
    if (!cfg.members || cfg.members.length < 1) {
      console.warn('Create hull failed! The members is empty.');
      return;
    }
    var parent = this.get('hullGroup');
    var hullMap = this.get('hullMap');
    if (!hullMap) {
      hullMap = {};
      this.set('hullMap', hullMap);
    }
    if (!parent || parent.get('destroyed')) {
      parent = this.get('group').addGroup({
        id: 'hullGroup'
      });
      parent.toBack();
      this.set('hullGroup', parent);
    }
    if (hullMap[cfg.id]) {
      console.warn('Existed hull id.');
      return hullMap[cfg.id];
    }
    var group = parent.addGroup({
      id: "".concat(cfg.id, "-container")
    });
    var hull = new Hull(this, __assign(__assign({}, cfg), {
      group: group
    }));
    var hullId = hull.id;
    hullMap[hullId] = hull;
    return hull;
  };
  /**
   * 获取当前 graph 中存在的包裹轮廓
   * @return {[key: string]: Hull} Hull 的 map，hullId 对应的 hull 实例
   */
  AbstractGraph.prototype.getHulls = function () {
    return this.get('hullMap');
  };
  /**
   * 根据 hullId 获取对应的 hull
   * @return Hull
   */
  AbstractGraph.prototype.getHullById = function (hullId) {
    return this.get('hullMap')[hullId];
  };
  AbstractGraph.prototype.removeHull = function (hull) {
    var _a;
    var hullInstance;
    if (isString(hull)) {
      hullInstance = this.getHullById(hull);
    } else {
      hullInstance = hull;
    }
    (_a = this.get('hullMap')) === null || _a === void 0 ? true : delete _a[hullInstance.id];
    hullInstance.destroy();
  };
  AbstractGraph.prototype.removeHulls = function () {
    var hulls = this.getHulls();
    if (!hulls || !Object.keys(hulls).length) return;
    Object.keys(hulls).forEach(function (key) {
      var hull = hulls[key];
      hull.destroy();
    });
    this.set('hullMap', {});
  };
  return AbstractGraph;
}(EventEmitter);
export default AbstractGraph;
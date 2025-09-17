window.addEventListener('load', () => {
  window.fg = new FindGeometry();
});

document.addEventListener('click', (e) => {
  console.log(`(${e.clientX}, ${e.clientY})`);
});

class FindGeometry {
  constructor() {
    this.svgns = 'http://www.w3.org/2000/svg';
    this.root = document.documentElement;
    if ('svg' !== this.root.localName) {
      this.root = this.root.querySelector('svg');
    }
    this.annotationLayer = this.root.getElementById('annotation_layer');

    // this.rootCTM = this.root.getCTM().inverse();
    this.rootCTM = this.root.getScreenCTM().inverse();
    console.log('this.rootCTM', this.rootCTM);

    this.init();
  }

  init() {
    console.log('root', this.root);
    this.findShapes();
  }

  findShapes() {
    const shapeList = this.root.querySelectorAll('line, circle, ellipse, rect, polyline, polygon, path, use');
    // console.log('shapeList', shapeList);
    shapeList.forEach(shape => {
      if (!shape.classList.contains('ui')) {
        // console.log('shape', shape);
        this.showBBox(shape);
      }
    });
    // const circle2 = document.getElementById('circle_2');
    // this.showBBox(circle2);
  }

  showBBox(el) {
    const bbox = el.getBBox();
    console.log('bbox', bbox);

    const points = [
      { x: bbox.x, y: bbox.y },
      { x: bbox.x + bbox.width, y: bbox.y },
      { x: bbox.x + bbox.width, y: bbox.y + bbox.height },
      { x: bbox.x, y: bbox.y + bbox.height }
    ];
    const transformed = points.map(({ x, y }) => {
      return this.transformToElement(el, this.annotationLayer, x, y);
    });

    const newX = transformed[0].x;
    const newY = transformed[0].y;
    const newWidth = transformed[1].x - transformed[0].x;
    const newHeight = transformed[2].y - transformed[1].y;

    const stroke = el.getAttribute('stroke');

    const offset = 2;
    const bboxStyle = `fill: none; stroke: ${stroke}; stroke-dasharray: 5 5; stroke-linecap: round;`;

    const box = this.drawBox(
      newX - offset,
      newY - offset,
      newWidth + (offset * 2),
      newHeight + (offset * 2),
      bboxStyle,
      this.annotationLayer
    );
  }

  transformToElement(fromElem, toElem, x, y) {
    const fromCTM = fromElem.getCTM();
    const toCTM = toElem.getCTM();
    const p = new DOMPoint(x, y);
    const transformMatrix = toCTM.inverse().multiply(fromCTM);
    return p.matrixTransform(transformMatrix);
  }

  localToScreen(elem, x, y) {
    const mat = elem.getScreenCTM();
    const p = new DOMPoint(x, y);
    return p.matrixTransform(mat);
  }

  screenToLocal(elem, x, y) {
    const mat = elem.getScreenCTM();
    const p = new DOMPoint(x, y);
    return p.matrixTransform(mat.inverse());
  }

  drawBox(x, y, width, height, style, parent) {
    const box = document.createElementNS(this.svgns, 'rect');
    box.setAttribute('style', style);
    // box.setAttribute('style', 'fill:red');
    box.setAttribute('x', x);
    box.setAttribute('y', y);
    box.setAttribute('width', width);
    box.setAttribute('height', height);

    // console.log('box', box);

    parent = parent ? parent : this.root;
    // console.log('parent', parent);

    parent.append(box);
    return box;
  }
}
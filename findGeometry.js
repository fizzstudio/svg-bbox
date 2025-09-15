window.addEventListener('load', () => new FindGeometry());

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
    /*const shapeList = this.root.querySelectorAll('line, circle, ellipse, rect, polyline, polygon, path, use');
    // console.log('shapeList', shapeList);
    shapeList.forEach(shape => {
      if (!shape.classList.contains('ui')) {
        // console.log('shape', shape);
        this.showBBox(shape);
      }
    });*/
    const circle2 = document.getElementById('circle_2');
    this.showBBox(circle2);
  }

  showBBox( el ) {
    const bbox = el.getBBox();
    console.log('bbox', bbox);
    const ctm = el.getCTM();
    console.log('ctm', ctm);

    const stroke = el.getAttribute('stroke');
    
    // const x = this.getNormalized(bbox.x);
    
    const offset = 2;
    const bboxStyle = `fill: none; stroke: ${stroke}; stroke-dasharray: 5 5; stroke-linecap: round;`;

    const box = this.drawBox(bbox.x - offset, bbox.y - offset, bbox.width + (offset*2), bbox.height + (offset*2), bboxStyle, this.annotationLayer);
    const boxTransform = box.ownerSVGElement.createSVGTransform();
    boxTransform.matrix.e = 50;
    console.log('boxTransform', boxTransform);
    box.transform.baseVal.appendItem(boxTransform);
  }

//   getNormalized(shape, bbox, ctm, offset) {
//     let coord = this.root.createSVGPoint();
//     this.rootCTM

//     var bbox = elem.getBBox();
// var mat = elem.screenCTM(); // could also be tranformToElement
// var cPt = document.getRootElement().createSVGPoint();
// cPt.x = bbox.x;
// cPt.y = bbox.y;
// cPt = cPt.matrixTransform(mat);
// // repeat for other corner points and the new bbox is
// // simply the minX/minY to maxX/maxY of the four points.

// // elem.getScreenCTM().inverse().multiply(this.getScreenCTM());

// 1. Get the element's local bounding box: Call element.getBBox() to get the bounding box in the element's own coordinate system.
// 2. Get the element's CTM: Call element.getCTM() to get the transformation matrix that maps the element's local coordinates to the SVG viewport's coordinate system.
// 3. Get the inverse of the target coordinate system's CTM: If you want the bounding box relative to the SVG root, you'll need svgElement.getScreenCTM().inverse(). If it's relative to a parent element, you might use parentElement.getScreenCTM().inverse().
// 4. Transform the bounding box corners: Create SVGPoint objects for each corner of the getBBox() result and apply the combined transformation matrix (element's CTM multiplied by the inverse of the target CTM) using matrixTransform().
// 5. Calculate the new bounding box: Determine the minimum and maximum x and y values from the transformed corner points to construct the final bounding box in the desired coordinate system. 

// https://stackoverflow.com/questions/53635449/get-absolute-coordinates-of-element-inside-svg-using-js

// https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
// https://codepen.io/craigbuckler/pen/RwRdjEq


//   }

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
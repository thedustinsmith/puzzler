var url = 'http://i.imgur.com/7L7KwSh.jpg',
    img = new Image,
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

document.body.appendChild(canvas);

img.onload = function () {
  canvas.width = img.width;
  canvas.height = img.height;
  doStuff();
};
img.src = url;


function doStuff() {
    var w = img.width,
        h = img.height,
        curves,
        invert = true,
        axis = 'y', //'y'
        xInset = 0,
        yInset = 0,
        xStart = 0,
        yStart = 0,
        xEnd = 0,
        yEnd = 0,
        drawBefore = axis === 'x' && !invert;;

  // top in bottom in
  curves = [
    [0.49, 0.20, 0.45, 0.20, 0.43, 0.28],
    [0.41, 0.32, 0.43, 0.40, 0.51, 0.40],
    [0.58, 0.40, 0.59, 0.32, 0.57, 0.27],
    [0.55, 0.20, 0.50, 0.20, 1.00, 0.20]
  ];
  
  // top out bottom out
  curves = [
    [0.49, 0.20, 0.45, 0.20, 0.43, 0.12],
    [0.41, 0.08, 0.43, 0.00, 0.51, 0.00],
    [0.58, 0.00, 0.59, 0.08, 0.57, 0.13],
    [0.55, 0.20, 0.50, 0.20, 1.00, 0.20]
  ];

//x out
    curves1 = [
        [0.20, 0.49, 0.20, 0.45, 0.12, 0.43],
        [0.08, 0.41, 0.00, 0.43, 0.00, 0.51],
        [0.00, 0.58, 0.08, 0.59, 0.13, 0.57],
        [0.20, 0.55, 0.20, 0.50, 0.20, 1.00]
    ];
// x in
  curves1 = [
    [0.20, 0.49, 0.20, 0.45, 0.28, 0.43],
    [0.32, 0.41, 0.40, 0.43, 0.40, 0.51],
    [0.40, 0.58, 0.32, 0.59, 0.27, 0.57],
    [0.20, 0.55, 0.20, 0.50, 0.20, 1.00]
  ];
  
    if (axis === 'y') {
        yInset = invert ? .8 : .2;
        xEnd = 1;
    }
    if (axis === 'x') {
        xInset = invert ? .8 : .2;
        yEnd = 1;
    }

    if (drawBefore) {
        ctx.drawImage(this.img, 0, 0);
    }
    else if (!invert) {
        ctx.rect(0,0, canvas.width, canvas.height);
    }
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(xInset*w, yInset*h);
    for (var i = 0; i< curves.length; i++) {
        var curve = curves[i],
            x1 = curve[0],
            y1 = curve[1],
            x2 = curve[2],
            y2 = curve[3],
            x3 = curve[4],
            y3 = curve[5];

        if (invert && axis === 'x') {
            x1 = 1-x1;
            x2 = 1-x2;
            x3 = 1-x3;
        }
        if (invert && axis === 'y') {
            y1 = 1-y1;
            y2 = 1-y2;
            y3 = 1-y3;
        }
        ctx.bezierCurveTo(x1*w, y1*h, x2*w, y2*h, x3*w, y3*h);
    }
    ctx.lineTo(xEnd*w, yEnd*h);
    ctx.closePath();
    ctx.clip();
    // ctx.stroke();
    if (drawBefore) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    else {
        ctx.drawImage(this.img, 0, 0);
    }
    ctx.restore();
}




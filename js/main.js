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
        bottom = false,
        xStart = 0,
        yStart = 0,
        xInset = 0,
        yInset = .2;
  // top down
  curves = [
    [0.49, 0.2,0.45, 0.2, 0.43, 0.28],
[0.41, 0.32, 0.43, 0.4, 0.51, 0.4],
[0.58, 0.4, 0.59, 0.32, 0.57, 0.27],
[0.55, 0.2, 0.5, 0.2, 1, 0.2]
  ];
  
  // top up
  curvesd = [
    [0.49, 0.2,0.45, 0.2, 0.43, 0.12],
[0.41, 0.08, 0.43, 0.0, 0.51, 0.0],
[0.58, 0.0, 0.59, 0.08, 0.57, 0.13],
[0.55, 0.2, 0.5, 0.2, 1, 0.2]
  ];
  
  
    if (bottom) {
        yStart = 1;
        yInset = .8;
    }
    ctx.save();
    ctx.beginPath();
    ctx.rect(0,0, canvas.width, canvas.height);
    ctx.moveTo(0, yStart * h);
    ctx.lineTo(0, yInset * h);
    for (var i = 0; i< curves.length; i++) {
        var curve = curves[i],
            x1 = curve[0],
            y1 = curve[1],
            x2 = curve[2],
            y2 = curve[3],
            x3 = curve[4],
            y3 = curve[5];

    if (bottom) {
    //       x1 = 1-x1;
    //       x2 = 1-x2;
    //       x3 = 1-x3;
        y1 = 1-y1;
        y2 = 1-y2;
        y3 = 1-y3;
    }
    ctx.bezierCurveTo(x1*w, y1*h, x2*w, y2*h, x3*w, y3*h);
    }
    ctx.lineTo(1*w, yStart * h);
    ctx.closePath();
    ctx.clip();
    // ctx.stroke();
    ctx.drawImage(this.img, 0, 0);
    ctx.restore();
}




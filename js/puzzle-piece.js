var PuzzlePiece = (function () {

    var Y_INSET = [
        [0.49, 0.20, 0.45, 0.20, 0.43, 0.28],
        [0.41, 0.32, 0.43, 0.40, 0.51, 0.40],
        [0.58, 0.40, 0.59, 0.32, 0.57, 0.27],
        [0.55, 0.20, 0.50, 0.20, 0.80, 0.20]
    ];

    var Y_OUTSET = [
        [0.49, 0.20, 0.45, 0.20, 0.43, 0.12],
        [0.41, 0.08, 0.43, 0.00, 0.51, 0.00],
        [0.58, 0.00, 0.59, 0.08, 0.57, 0.13],
        [0.55, 0.20, 0.50, 0.20, 0.80, 0.20]
    ];

    var X_INSET = [
        [0.20, 0.49, 0.20, 0.45, 0.28, 0.43],
        [0.32, 0.41, 0.40, 0.43, 0.40, 0.51],
        [0.40, 0.58, 0.32, 0.59, 0.27, 0.57],
        [0.20, 0.55, 0.20, 0.50, 0.20, 0.80]
    ];

    var X_OUTSET = [
        [0.20, 0.49, 0.20, 0.45, 0.12, 0.43],
        [0.08, 0.41, 0.00, 0.43, 0.00, 0.51],
        [0.00, 0.58, 0.08, 0.59, 0.13, 0.57],
        [0.20, 0.55, 0.20, 0.50, 0.20, 0.80]
    ];

    function PuzzlePiece (opts) {
        var self = this;
        self.top = parseFloat(opts.top);
        self.left = parseFloat(opts.left);
        self.width = opts.width;
        self.height = opts.height;
        self.edgeTypes = opts.edgeTypes;
        self.image = opts.image;
        this.canvas = document.createElement('canvas');
        this.canvas.width = self.width;
        this.canvas.height = self.height;
        document.body.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');

        this.draw();
    };

    PuzzlePiece.prototype.drawImage = function () {
        this.context.drawImage(this.image, this.left, this.top, this.width, this.height, 0, 0, this.width, this.height);
    };

    PuzzlePiece.prototype.draw = function () {
        var self = this,
            w = self.width,
            h = self.height,
            topEdge = self.edgeTypes[0],
            rightEdge = self.edgeTypes[1],
            bottomEdge = self.edgeTypes[2],
            leftEdge = self.edgeTypes[3],
            fillAfter = bottomEdge === 0 || rightEdge === 0,
            xStart = leftEdge === 0 ? 0 : .2 * w,
            yStart = topEdge === 0 ? 0 : .2 * h,
            xEnd = rightEdge === 0 ? 0 : .8 * w,
            yEnd = bottomEdge === 0 ? 0 : .8 * h;

        $(self.canvas).attr('data-top', topEdge);
        $(self.canvas).attr('data-right', rightEdge);
        $(self.canvas).attr('data-bottom', bottomEdge);
        $(self.canvas).attr('data-left', leftEdge);

        if (fillAfter) {
            // this.context.rect(0, 0, this.width, this.height);
        }
        else {
            //this.drawImage();
        }
        // this.drawImage();
        // this.context.globalCompositeOperation = 'destination-in';

        // this.context.beginPath();
        this.context.moveTo(xStart, yStart);
        if (topEdge !== 0) {
            this.drawEdge(false, false, topEdge == -1);
        }
        else {
            this.context.lineTo(xEnd, yStart);
        }
        // this.context.closePath();
        // this.context.lineTo(xEnd, yStart);
        if (rightEdge !== 0) {
            clear = true;
            this.drawEdge(true, false, rightEdge == -1);
        }
        else {
            this.context.lineTo(xEnd, yEnd);
        }
        // this.context.closePath();
        // this.context.lineTo(xStart, yEnd);
        if (bottomEdge !== 0) {
            clear = true;
            this.drawEdge(false, true, bottomEdge == -1);
        }
        else {
            this.context.lineTo(xStart, yEnd);
        }
        // this.context.closePath();
        // this.context.lineTo(xStart, yEnd);
        // this.context.lineTo(xStart, yStart);
        if (leftEdge !== 0) {
            this.drawEdge(true, false, leftEdge == -1);
        }
        else {
            this.context.lineTo(xStart, yStart);
        }

        this.context.save();
        this.context.clip();
        this.drawImage();
        this.context.restore();
        this.context.stroke();

        // this.context.moveTo(xEnd, yStart);
        // this.context.closePath();
        // this.context.clip();
        // this.context.stroke();
        // this.context.save();
        // this.drawImage();
        // this.context.restore();
        // this.context.stroke();
        // this.context.rect(0, 0, this.width, this.height);
        // this.context.fill();
        //if (fillAfter) {
            // this.drawImage();
        // }
        // else {
        //     this.context.clearRect(0, 0, this.width, this.height);
        // }
    };

    function getCurve(isX, isInset) {
        if (isX) {
            return isInset ? X_INSET : X_OUTSET;
        }
        else {
            return isInset ? Y_INSET : Y_OUTSET;
        }
    }

    PuzzlePiece.prototype.drawEdge = function (isX, reverse, isInset) {
        var self = this,
            curve = getCurve(isX, isInset),
            ctx = this.context,
            canvas = this.canvas,
            w = canvas.width,
            h = canvas.height,
            xInset = 0,
            yInset = 0,
            xEnd = 0,
            yEnd = 0;
        //     drawBefore = isX && reverse;

        // if (isX) {
        //     xInset = reverse ? .8 : .2;
        //     yEnd = 1; //isFar ? 1 : .8;
        // }
        // else {
        //     yInset = reverse ? .8 : .2;
        //     xEnd = 1;
        // }

        //// if (drawBefore) {
        ////     self.drawImage();
        //// }
        //// else if (isFar) {
        ////     ctx.rect(0,0, w, h);
        //// }
        //// ctx.save();
        //// ctx.beginPath();

        // ctx.moveTo(0, 0);
        // ctx.lineTo(xInset*w, yInset*h);
        for (var i = 0; i < curve.length; i++) {
            var ix = reverse ? (curve.length - i - 1) : i,
                c = curve[ix],
                x1 = c[reverse ? 5 : 0],
                y1 = c[reverse ? 4 : 1],
                x2 = c[reverse ? 3 : 2],
                y2 = c[reverse ? 2 : 3],
                x3 = c[reverse ? 1 : 4],
                y3 = c[reverse ? 0 : 5];

            // if (isFar && isX) {
            //     x1 = 1-x1;
            //     x2 = 1-x2;
            //     x3 = 1-x3;
            // }
            // if (isFar && !isX) {
            //     y1 = 1-y1;
            //     y2 = 1-y2;
            //     y3 = 1-y3;
            // }
            ctx.bezierCurveTo(x1*w, y1*h, x2*w, y2*h, x3*w, y3*h);
        }
        // ctx.lineTo(xEnd*w, yEnd*h);

        //// ctx.closePath();
        //// ctx.clip();
        //// ctx.stroke();
        //// if (drawBefore) {
        ////     // ctx.clearRect(0, 0, canvas.width, canvas.height);
        //// }
        //// else {
        ////     self.drawImage();
        //// }
        //// ctx.restore();
    };

    return PuzzlePiece;
})();
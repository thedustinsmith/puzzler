var PuzzlePiece = (function () {
    var ARC_INSET = .4,
        ARC_RADIUS = .1;

    var Piece = function (opts) { 
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
        opts.container[0].appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');

        self.topEdge = self.edgeTypes[0];
        self.rightEdge = self.edgeTypes[1];
        self.bottomEdge = self.edgeTypes[2];
        self.leftEdge = self.edgeTypes[3];

        if (self.topEdge !== 0) {
            self.top = self.top - ((ARC_RADIUS * self.height));
        }

        if (self.leftEdge !== 0) {
            self.left = self.left - (ARC_RADIUS * self.width);
        }

        this.draw();
    };

    Piece.prototype.draw = function (){
        var self = this,
            w = self.width,
            h = self.height,
            ctx = self.context,
            pi = Math.PI,
            topEdge = self.edgeTypes[0],
            rightEdge = self.edgeTypes[1],
            bottomEdge = self.edgeTypes[2],
            leftEdge = self.edgeTypes[3],
            xRadius = ARC_RADIUS * w,
            yRadius = ARC_RADIUS * h,
            xInset = (w / 2) - yRadius, //ARC_INSET * w,
            yInset = (h / 2) - xRadius, //ARC_INSET * h,
            xStart = leftEdge === 0 ? 0 : ARC_RADIUS * w,
            yStart = topEdge === 0 ? 0 : ARC_RADIUS * h,
            xEnd = rightEdge === 0 ? w : (1 - ARC_RADIUS) * w,
            yEnd = bottomEdge === 0 ? h : (1 - ARC_RADIUS) * h;

        var $can = $(this.canvas);
        $can.attr({
            'yStart': yStart,
            'yRadius': yRadius,
            'top': self.top
        });

        /* Top Edge */
        ctx.moveTo(xStart, yStart);
        if (topEdge !== 0) {
            ctx.lineTo(xInset, yStart);
            ctx.arc(xInset + yRadius, yStart, yRadius, pi, 0, topEdge === -1);
        }
        ctx.lineTo(xEnd, yStart);

        /* Right Edge */
        if (rightEdge !== 0) {
            ctx.lineTo(xEnd, yInset);
            ctx.arc(xEnd, yInset + xRadius, xRadius, -pi / 2, pi / 2, rightEdge === -1);
        }

        ctx.lineTo(xEnd, yEnd);

        /* Bottom Edge */
        if (bottomEdge !== 0) {
            ctx.lineTo(w - xInset, yEnd);
            ctx.arc(w - xInset - yRadius, yEnd, yRadius, 0, pi, bottomEdge === -1);
        }

        ctx.lineTo(xStart, yEnd);

        /* Left Edge */
        if (leftEdge !== 0) {
            ctx.lineTo(xStart, h - yInset);
            ctx.arc(xStart, h - yInset - xRadius, xRadius, pi / 2, -pi / 2, leftEdge === -1);
        }
        ctx.lineTo(xStart, yStart);

        ctx.save();
        ctx.clip();

        ctx.drawImage(this.image, this.left, this.top, this.width + (ARC_RADIUS * w), this.height + (ARC_RADIUS * h), 0, 0, this.width, this.height);
        ctx.restore();
        ctx.stroke();
    };

    return Piece;
})();
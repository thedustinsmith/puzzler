var PuzzlePiece = (function () {
    var ARC_INSET = .4,
        ARC_RADIUS = .1;

    var Piece = function (opts) { 
        var self = this;
        self.width = parseInt(opts.width, 10);
        self.height = parseInt(opts.height, 10);
        
        self.image = opts.image;
        this.canvas = document.createElement('canvas');
        this.$canvas = $(this.canvas).addClass('piece');
        opts.container[0].appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');

        self.top = parseFloat(opts.top);
        self.left = parseFloat(opts.left);

        var et = self.edgeTypes = opts.edgeTypes;
        self.topEdge = et[0];
        self.rightEdge = et[1];
        self.bottomEdge = et[2];
        self.leftEdge = et[3];

        var yR = self.yRadius = Math.round(ARC_RADIUS * self.width);
        var xR = self.xRadius = Math.round(ARC_RADIUS * self.height);

        if (self.topEdge === 1) {
            self.height += yR;
            self.top -= yR;
        }
        if (self.bottomEdge === 1) self.height += yR;
        if (self.leftEdge === 1) {
            self.width += xR; 
            self.left -= xR; 
        } 
        if (self.rightEdge === 1) self.width += xR;

        this.draw();
    };

    Piece.prototype.draw = function (){
        var self = this,
            w = self.width,
            h = self.height,
            ctx = self.context,
            pi = Math.PI,
            T = self.topEdge,
            R = self.rightEdge,
            B = self.bottomEdge,
            L = self.leftEdge,
            xR = self.xRadius,
            yR = self.yRadius,
            xStart = L === 1 ? xR : 0, //0 : ARC_RADIUS * w,
            yStart = T === 1 ? yR : 0, // : ARC_RADIUS * h,
            xEnd = R === 1 ? w - xR : w, //: , //w : (1 - ARC_RADIUS) * w,
            yEnd = B === 1 ? h - yR : h,
            xInset = ((xEnd - xStart) / 2) - yR,
            yInset = ((yEnd - yStart) / 2) - xR;
            // yInset = ((h-yStart) / 2) - xR, // - yStart, //ARC_INSET * h,
            // xInset = ((h-yStart) / 2) - xR, // - yStart, //ARC_INSET * h,
            //; // - yR; // ? h : (1 - ARC_RADIUS) * h;

        var $can = $(this.canvas);
        $can.attr({
            'yRadius': yR,
            'xRadius': xR,
            'top': self.top,
            'left': self.left,
            'heighta': self.height,
            'widtha': self.width,
            yEnd: yEnd,
            xEnd: xEnd,
            xStart: xStart,
            yStart: yStart,
            xInset: xInset,
            yInset: yInset
        });

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        /* Top Edge */
        ctx.moveTo(xStart, yStart);
        if (T !== 0) {
            ctx.lineTo(xStart + xInset, yStart);
            ctx.arc(xStart + xInset + yR, yStart, yR, pi, 0, T === -1);
        }
        ctx.lineTo(xEnd, yStart);

        /* Right Edge */
        if (R !== 0) {
            ctx.lineTo(xEnd, yStart + yInset);
            ctx.arc(xEnd, yStart + yInset + xR, xR, -pi / 2, pi / 2, R === -1);
        }

        ctx.lineTo(xEnd, yEnd);

        /* Bottom Edge */
        if (B !== 0) {
            ctx.lineTo(xEnd - xInset, yEnd);
            ctx.arc(xEnd - xInset - yR, yEnd, yR, 0, pi, B === -1);
        }

        ctx.lineTo(xStart, yEnd);

        /* Left Edge */
        if (L !== 0) {
            ctx.lineTo(xStart, yEnd - yInset);
            ctx.arc(xStart, yEnd - yInset - xR, xR, pi / 2, -pi / 2, L === -1);
        }
        ctx.lineTo(xStart, yStart);

        ctx.save();
        ctx.clip();

        ctx.drawImage(this.image, this.left, this.top, this.width, this.height, 0, 0, this.width, this.height);
        ctx.restore();

        ctx.strokeStyle = '#999';
        ctx.stroke();
    };

    return Piece;
})();
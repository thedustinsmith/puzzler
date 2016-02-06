var Puzzle = (function () {
    var defaults = {
        pieceCount: 100
    };

    function fix(v, decimal) {
        return parseFloat(v).toFixed(decimal || 2);
    }

    function Puzzle (opts) {
        var self = this;
        self.url = opts.url;
        self.pieceCount = opts.pieceCount || 100;

        self.$el = $('<div class="puzzleboard" />').appendTo('body');
    }

    Puzzle.prototype.start = function () {
        var self = this;
        self.image = new Image;
        self.image.onload = self.imageLoaded.bind(self);
        self.image.src = self.url;
    };

    Puzzle.prototype.initDraggable = function () { 
        this.$el.find('canvas').draggable();
    };

    Puzzle.prototype.imageLoaded = function () {
        var self = this;
        self.piecesX = 10; //self.image.width / 10;
        self.piecesY = 10; //self.image.height / 10;
        self.pieceW = self.image.width / self.piecesX;
        self.pieceH = self.image.height / self.piecesY;
        self.loadPieces();

        self.initDraggable();
    };

    Puzzle.prototype.loadPieces = function () {
        var self = this;
        self.pieces = [];

        for (var y = 0; y < self.piecesY; y++) {
            var row = [],
                isLastRow = y === (self.piecesY - 1);

            for (var x = 0; x < self.piecesX; x++) {
                var edgeTypes = [0, 0, 0, 0],
                    isRightEdge = x === (self.piecesX - 1),
                    above,left;

                if (y > 0) {
                    above = self.pieces[y-1][x].edgeTypes[2];
                    edgeTypes[0] = above === -1 ? 1 : -1;
                }
                
                if (!isLastRow) {
                    edgeTypes[2] = Math.random() > .5 ? 1 : -1;
                }

                if (x > 0) {
                    left = row[x-1].edgeTypes[1];
                    edgeTypes[3] = left === -1 ? 1 : -1;
                }

                if (!isRightEdge) {
                    edgeTypes[1] = Math.random() > .5 ? 1 : -1;
                }

                var piece = new PuzzlePiece({
                    width: self.pieceW,
                    height: self.pieceH,
                    edgeTypes: edgeTypes,
                    top: fix(self.pieceH * y),
                    left: fix(self.pieceW * x),
                    image: self.image,
                    container: self.$el
                });
                row.push(piece);
            }
            self.pieces.push(row);
        }
    };

    return Puzzle;
})();
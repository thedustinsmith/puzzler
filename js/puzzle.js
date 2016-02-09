var Puzzle = (function () {
    var defaults = {
        pieceCount: 100
    };
    var X_COUNT = 10,
        Y_COUNT = 10;

    var BOARD = '<div class="puzzle-board" />',
        MAT = '<div class="puzzle-mat" />';

    function fix(v, decimal) {
        return parseFloat(v).toFixed(decimal || 2);
    }

    function Puzzle (opts) {
        var self = this;
        self.url = opts.url;
        self.pieceCount = opts.pieceCount || 100;

        self.$dropBoard = $(opts.dropBoard);
        self.$pieceMat = $(opts.pieceMat);
    }

    Puzzle.prototype.start = function () {
        var self = this;
        self.image = new Image;
        self.image.onload = self.imageLoaded.bind(self);
        self.image.src = self.url;
    };


    Puzzle.prototype.initDraggable = function () { 
        var self = this,
            startX,
            startY;
        this.$pieceMat.find('canvas').draggable({
            start: function (ev, ui) {
                startY = ui.position.top;
                startX = ui.position.left;
            },
            drag: function (ev, ui) {
                var diffX = ui.position.left - startX,
                    diffY = ui.position.top - startY;
                ui.position.top += (diffY * self.invertedScale);
                ui.position.left += (diffX * self.invertedScale); //startX + (self.invertedScale*ui.offset.left);
            }
        });
    };

    Puzzle.prototype.loadStyles = function() {
        var self = this,
            holderHeight = self.$pieceMat.height(),
            holderWidth = self.$pieceMat.width(),
            winHeight = $(window).height(),
            scaleW = holderWidth/self.image.width,
            scaleH = holderHeight/self.image.height,
            cssScale = Math.min(scaleW, scaleH),
            invertedScale = 1 / cssScale
            width = Math.floor(invertedScale) * 100;

        self.invertedScale = invertedScale;
        self.$pieceMat.css('transform', 'scale(' + parseFloat(cssScale).toFixed(2));
        self.$pieceMat.css('width', width + '%');

    };

    Puzzle.prototype.imageLoaded = function () {
        var self = this;
        self.piecesX = X_COUNT; //self.image.width / 10;
        self.piecesY = Y_COUNT; //self.image.height / 10;
        self.pieceW = self.image.width / self.piecesX;
        self.pieceH = self.image.height / self.piecesY;
        self.loadPieces();
        self.loadStyles();

        self.bindEvents();
    };

    Puzzle.prototype.bindEvents = function () {
        var LEFT = 37,
            UP = 38,
            RIGHT = 39,
            DOWN = 40,
            ALLOWEDKEYS = [LEFT, UP, RIGHT, DOWN],
            self = this;

        self.initDraggable();
        $(window).on('click', function (ev) { 
            if ($(ev.target).is('.piece')) {
                var $piece = $(ev.target);
                $piece.addClass('active').siblings().removeClass('active');
            }
            else {
                $('.piece.active').removeClass('active');
            }
        });
        $(window).on('keydown', function (ev) {
            var key = ev.which,
                $active = self.$el.find('.piece.active');

            if (!$active.length) return;
            if (ALLOWEDKEYS.indexOf(key) > -1) ev.preventDefault();

            if (key === LEFT) {
                $active.css('left', (parseInt($active.css('left'), 10) || 0) - 1);
            }
            if (key === RIGHT) {
                $active.css('left', (parseInt($active.css('left'), 10) || 0) + 1);
            }
            if (key === UP) {
                $active.css('top', (parseInt($active.css('top'), 10) || 0) - 1);
            }
            if (key === DOWN) {
                $active.css('top', (parseInt($active.css('top'), 10) || 0) + 1);
            }
        });
    }

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
                    container: self.$pieceMat
                });
                // piece.$canvas.css('max-width', (100/X_COUNT) + '%');
                row.push(piece);
                piece.$canvas.addClass('not-placed');
                // break;
            }
            self.pieces.push(row);
            // break;
        }
    };

    return Puzzle;
})();
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

        self.maxWidth = Math.floor($(window).width() * .6);
        self.maxHeight = Math.floor($(window).height() * .75);
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
        this.$pieceMat.find('canvas')
        // .each(function() {
        //     var o = $(this).position();
        //     $(this).css({
        //         position: 'absolute',
        //         top: o.top,
        //         left: o.left
        //     });
        // })
        .draggable({
            scroll: true,
            start: function (ev, ui) {
            },
            drag: function (ev, ui) {
            }
        });
    };

    Puzzle.prototype.initDroppable = function() {
        var self = this,
            maxW = self.maxWidth,
            maxH = self.maxHeight,
            scale = parseFloat(Math.min((maxW/self.image.width), (maxH/self.image.height))).toFixed(2),
            h = (self.image.height * scale).toFixed(2),
            w = (self.image.width * scale).toFixed(2);

        self.$dropBoard.css({
            width: w + 'px',
            height: h + 'px'
        })
        self.$dropBoard.droppable({
            drop: function (ev, ui) {
                console.log(ui.position);
                self.$dropBoard.removeClass('empty');
                $(ui.draggable).detach().appendTo($(this));
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
        // self.$pieceMat.css('transform', 'scale(' + parseFloat(cssScale).toFixed(2));
        // self.$pieceMat.css('width', width + '%');
    };

    Puzzle.prototype.imageLoaded = function () {
        var self = this;
        self.piecesX = X_COUNT; //self.image.width / 10;
        self.piecesY = Y_COUNT; //self.image.height / 10;

        if (self.image.width > self.maxWidth || self.image.height > self.maxHeight) {
            var scale = Math.min((self.maxWidth / self.image.width), (self.maxHeight / self.image.height)),
                w = self.image.width * scale,
                h = self.image.height * scale,
                canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');

            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(self.image, 0, 0, w, h);
            self.image = canvas;
        }

        self.pieceW = self.image.width / self.piecesX;
        self.pieceH = self.image.height / self.piecesY;

        self.loadPieces();
        self.loadStyles();

        self.bindEvents();
    };

    Puzzle.prototype.initDragAndDrop = function () {
        var self = this,
            $body = $(document.body),
            scale,
            $dragging,
            clickOffset,
            start;

        function mouseDown (ev) {
            $dragging = $(ev.target);
            if(!$dragging.is('.piece')) return;

            scale = $dragging.data('scale');
            $dragging.css('position', 'absolute');

            var off = $dragging.offset();
            clickOffset = {
                top: ev.pageY - off.top,
                left: ev.pageX - off.left
            };
            start = off;
            $dragging.css({
                top: off.top,
                left: off.left
            })

            $body.on('mousemove.puzzle', mouseMove);
            $body.on('mouseup.puzzle', mouseUp);
            self.$dropBoard.on('mouseup.puzzle', dropperMouseUp);
        }
        function mouseUp (ev) {
            $body.off('mousemove.puzzle');
            $body.off('mouseUp.puzzle');
        }
        function dropperMouseUp(ev) { 
            console.log('dropper dropped');
        }
        function mouseMove(ev) {
            $dragging.css({
                top: (ev.pageY - clickOffset.top) * scale,
                left: (ev.pageX - clickOffset.left) * scale
            });
        }

        self.$pieceMat.find('.piece').data('scale', self.invertedScale);
        $body.on('mousedown.puzzle', mouseDown);
    };

    Puzzle.prototype.bindEvents = function () {
        var LEFT = 37,
            UP = 38,
            RIGHT = 39,
            DOWN = 40,
            ALLOWEDKEYS = [LEFT, UP, RIGHT, DOWN],
            self = this;

        // self.initDragAndDrop();

        self.initDraggable();
        self.initDroppable();
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
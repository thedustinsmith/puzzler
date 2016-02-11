var Puzzle = (function () {
    var defaults = {
        pieceCount: 100
    };
    var X_COUNT = 10,
        Y_COUNT = 10;

    var BOARD = '<div class="puzzle-board" />',
        MAT = '<div class="puzzle-mat" />';

    var $win = $(window);
    function fix(v, decimal) {
        return parseFloat(v).toFixed(decimal || 2);
    }

    function Puzzle (opts) {
        var self = this;
        self.url = opts.url;
        self.pieceCount = opts.pieceCount || 100;

        self.$dropBoard = $(opts.dropBoard);
        self.$pieceMat = $(opts.pieceMat);
        self.$overlay = $('.puzzle-overlay');
        self.$preview = $('.puzzle-preview img');

        self.maxWidth = Math.floor($win.width() * .6);
        self.maxHeight = Math.floor($win.height() * .75);
        self.initUpload();
    };

    Puzzle.prototype.start = function () {
        this.bindImage(this.url);
    };

    Puzzle.prototype.bindImage = function (url) {
        var self = this;
        self.url = url;
        self.image = self.originalImage = new Image;
        self.image.onload = self.imageLoaded.bind(self);
        self.image.src = self.url;
    };

    Puzzle.prototype.initUpload = function () {
        var self = this;
        $('input[type=file]').on('change', function () {
            var input = this;
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                
                reader.onload = function (e) {
                    self.bindImage(e.target.result);
                }
                
                reader.readAsDataURL(input.files[0]);
            }
        });
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
                $(ev.target).addClass('dragging');
            },
            drag: function (ev, ui) {
            },
            stop: function (ev, ui) {
                $(ev.target).removeClass('dragging');
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
                var $drag = $(ui.draggable).detach().appendTo($(this));
                self.$dropBoard.removeClass('empty');
                if ($drag.is('.not-placed')) {
                    var dOff = self.$dropBoard.offset();
                    $drag.removeClass('not-placed').css({
                        top: ui.offset.top - dOff.top,
                        left: ui.offset.left - dOff.left,
                        transform: '',
                        position: 'absolute'
                    });
                }
            }
        });
    };

    Puzzle.prototype.loadStyles = function() {
        var self = this,
            holderHeight = self.$pieceMat.height(),
            holderWidth = self.$pieceMat.width(),
            winHeight = $win.height(),
            scaleW = holderWidth/self.image.width,
            scaleH = holderHeight/self.image.height,
            cssScale = Math.min(scaleW, scaleH),
            invertedScale = 1 / cssScale
            width = Math.floor(invertedScale) * 100,
            cssVal = parseFloat(cssScale).toFixed(2),
            halfVal = (cssVal / 2) * 100,
            transform = 'scale(' + cssVal + ') translate(-' + halfVal + '%, -' + halfVal + '%)';

        var maxDim = Math.max(self.originalImage.width, self.originalImage.height),
            maxDimScale = $win.height() / maxDim,
            invertedMaxDimScale = 1/maxDimScale,
            $pieces = self.$pieceMat.find('.piece');

        // self.$pieceMat.find('.piece').data('scale', invertedScale);
        // self.$pieceMat.css({
        //     'transform': 'scale(' + maxDimScale + ')',
        //     'width': self.$pieceMat.width() * invertedMaxDimScale
        // });

        $pieces.each(function () {
            var o = $(this).position();
            $(this).data('pos', o);
        });


        $pieces.each(function () {
            var o = $(this).data('pos');
            $(this).css({
                position: 'absolute',
                top: o.top,
                left: o.left
            })
        });

        // self.$pieceMat.find('.piece').css('transform', transform);
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
        self.updatePreview();

        self.bindEvents();
    };

    Puzzle.prototype.updatePreview = function () { 
        var self = this,
            smallScale = 60 / self.originalImage.height,
            maxW = Math.min($win.width() / 2, self.originalImage.width),
            largeScale = maxW / self.originalImage.width;

        self.$preview.data('smallScale', smallScale.toFixed(2))
            .data('largeScale', largeScale.toFixed(2))
            .show()
            .css('transform', 'scale(' + smallScale.toFixed(2) + ')')
            .attr('src', this.originalImage.src);
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

        $body.on('mousedown.puzzle', mouseDown);
    };

    Puzzle.prototype.bindEvents = function () {
        var self = this;

        self.initDraggable();
        self.initDroppable();
        $win.on('click', self.puzzleClick);
        $win.on('keydown', self.keyDown);
        self.$preview.on('click', self.togglePreview.bind(this));
        self.$overlay.on('click', function () {
            self.toggleOverlay(false);
        });
    };

    Puzzle.prototype.toggleOverlay = function(tog, text) {
        this.$overlay.toggleClass('active');
        this.$overlay.find('span').text(text);
        if (this.$preview.is('.expanded')) {
            this.togglePreview(false);
        }
    };

    Puzzle.prototype.togglePreview = function (ev) {
        var self = this,
            $img = self.$preview,
            isShown = $img.is('.expanded'),
            ls = $img.data('largeScale'),
            ss = $img.data('smallScale'),
            translate = '';

        console.log(isShown);
        if (!isShown) {
            this.toggleOverlay(true, '');
            var x = ($win.width() - (self.originalImage.width * ls)) / 2,
                y = -$img.offset().top + (($win.height() - (self.originalImage.height * ls)) / 2);
            translate = 'translate(' + x + 'px,' + y + 'px) ';
        }
        else if (ev !== false && isShown) {
            this.toggleOverlay(false);
            return;
        }

        $img.css('transform', translate + 'scale(' + (isShown ? ss : ls) + ')');
        $img.toggleClass('expanded');
    };

    Puzzle.prototype.puzzleClick = function (ev) {
        if ($(ev.target).is('.piece')) {
            var $piece = $(ev.target);
            $piece.addClass('active').siblings().removeClass('active');
        }
        else {
            $('.piece.active').removeClass('active');
        }
    };

    Puzzle.prototype.keyDown = function (ev) {
        var LEFT = 37,
            UP = 38,
            RIGHT = 39,
            DOWN = 40,
            ALLOWEDKEYS = [LEFT, UP, RIGHT, DOWN]
            key = ev.which,
            $active = $('.piece.active');

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
    }

    Puzzle.prototype.loadPieces = function () {
        var self = this;
        self.pieces = [];
        self.$pieceMat.html('');
        self.$dropBoard.find('.piece').remove();

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
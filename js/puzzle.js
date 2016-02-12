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

    function range(num) {
        return Array.apply(null, Array(num)).map(function (_, i) {return i;});
    }

    function shuffle(arr) {
        var currentIndex = arr.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = arr[currentIndex];
            arr[currentIndex] = arr[randomIndex];
            arr[randomIndex] = temporaryValue;
        }

        return arr;
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

    Puzzle.prototype.initDraggable = function () { 
        var self = this,
            startX,
            startY;

        this.$pieceMat.droppable({
            accept: '.piece',
            drop: function (ev, ui) {
                var $drag = $(ui.draggable).detach().appendTo($(this)),
                    o = $(this).offset();

                $drag.addClass('not-placed').css({
                    top: self.invertedScale * (ui.offset.top - o.top),
                    left: self.invertedScale * (ui.offset.left - o.left)
                })
            }
        });
        this.$pieceMat.find('canvas')
        .draggable({
            scroll: true,
            start: function (ev, ui) {
                $(ev.target).addClass('dragging');
            },
            drag: function (ev, ui) {
                if (ui.helper.is('.not-placed')) {
                    ui.position.top *= self.invertedScale;
                    ui.position.left *= self.invertedScale;
                }
            },
            stop: function (ev, ui) {
                $(ev.target).removeClass('dragging');
                ui.position.top *- self.scale;
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
            accept: '.piece',
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

    Puzzle.prototype.positionPieces = function() {
        var self = this,
            winHeight = $win.height(),
            maxDim = Math.max(self.originalImage.width, self.originalImage.height),
            maxDimScale = 1 - (winHeight / maxDim) - 0.1,
            invertedMaxDimScale = 1/maxDimScale,
            $pieces = self.$pieceMat.find('.piece');

        self.$pieceMat.css({
            transform: 'scale(' + maxDimScale + ')',
            width: (invertedMaxDimScale * 100) + '%',
            height: (invertedMaxDimScale * 100) + '%'
        });

        self.cheatSheet = {};
        var matRect = self.$pieceMat[0].getBoundingClientRect();
        $pieces.each(function (ix, el) {
            var rect = this.getBoundingClientRect(),
                o = {
                    top: rect.top,
                    left: rect.left - matRect.left
                };
            $(this).data('pindex', ix.toString());
            self.cheatSheet[ix.toString()] = o;
        });

        var i = 0,
            random = shuffle(range($pieces.length - 1));
        $.each(random, function (e, ix) {
            var i2 = ix,
                p1 = $pieces.eq(i),
                p2 = self.cheatSheet[i2.toString()];

            p1.css({
                position: 'absolute',
                top: p2.top * invertedMaxDimScale,
                left: p2.left * invertedMaxDimScale,
            });
            i++;
        });

        self.invertedScale = invertedMaxDimScale;
        self.scale = maxDimScale;
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
        self.bindEvents();

        self.positionPieces();
        self.updatePreview();
    };

    Puzzle.prototype.cheat = function () {
        var self = this;
        self.$pieceMat.find('.piece').each(function () {
            var c = self.cheatSheet[$(this).data('pindex')];
            $(this).css({
                top: c.top * self.invertedScale,
                left: c.left * self.invertedScale
            })
        });
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

    Puzzle.prototype.bindEvents = function () {
        var self = this;

        self.initDraggable();
        self.initDroppable();
        $win.on('click.puzzle', self.puzzleClick);
        $win.on('keydown.puzzle', self.keyDown);
        self.$preview.on('click.puzzle', self.togglePreview.bind(this));
        self.$overlay.on('click.puzzle', function () {
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

    Puzzle.prototype.destroy = function () {
        var self = this;
        self.$pieceMat.droppable('destroy').find('.piece').draggable('destroy').remove();
        self.$dropBoard.droppable('destroy').find('.piece').draggable('destroy').remove();
        self.$pieceMat.css({
            transform: '',
            width: '',
            height: ''
        });
        self.$dropBoard.css({
            width: '',
            heigiht: ''
        })
        $win.off('click.puzzle');
        $win.off('keydown.puzzle');
        self.$preview.off('click.puzzle');
        self.$overlay.off('click.puzzle');
    }

    return Puzzle;
})();
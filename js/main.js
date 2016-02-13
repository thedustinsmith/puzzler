var Main = (function () {
    var IMG_COUNT = 6,
        puzzle;

    function bindUpload () {
        $('input[type=file]').on('change', function () {
            var input = this;
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                
                reader.onload = function (e) {
                    initPuzzle(e.target.result);
                }
                
                reader.readAsDataURL(input.files[0]);
            }
        });
    }

    function initPuzzle (url) {
        if (puzzle) {
            puzzle.destroy();
            puzzle = null;
            // return;
        }
        console.log('thats puzzling');
        puzzle = new Puzzle({
            url: url,
            dropBoard: '.puzzle-board',
            pieceMat: '.puzzle-pieces .pp-inner'
        });
        puzzle.start();
    };

    function init () {
        var imgIx = 1;
        bindUpload();
        initPuzzle('/img/' + imgIx + '.jpg');

        $('.cheat-btn').on('click', function () {
            puzzle.cheat();
        });
        $('.next-btn').on('click', function (ev) {
            if (++imgIx > IMG_COUNT) {
                imgIx = 1;
            }
            initPuzzle('/img/' + imgIx + '.jpg');
        });
    }
    
    return {
        init: init
    };
})();

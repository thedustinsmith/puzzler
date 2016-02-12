var Main = (function () {
    var puzzle;

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
        bindUpload();
        initPuzzle('http://i.imgur.com/7L7KwSh.jpg');

        $('.cheat-btn').on('click', function () {
            puzzle.cheat();
        });
    }
    
    return {
        init: init
    };
})();

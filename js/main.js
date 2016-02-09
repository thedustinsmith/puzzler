var Main = (function () {
    function init () {
        var puzzle = new Puzzle({
            url: 'http://i.imgur.com/7L7KwSh.jpg',
            dropBoard: '.puzzle-board',
            pieceMat: '.puzzle-pieces .pp-inner'
        });
        puzzle.start();
    }
    
    return {
        init: init
    };
})();

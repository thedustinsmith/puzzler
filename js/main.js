var Main = (function () {
    function init () {
        var puzzle = new Puzzle({
            url: 'http://i.imgur.com/7L7KwSh.jpg'
        });
        puzzle.start();
    }
    
    return {
        init: init
    };
})();

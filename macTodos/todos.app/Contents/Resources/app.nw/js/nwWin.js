// expose nodewebkit to app
var gui = require('nw.gui');
var nwWin = gui.Window.get();

window.nwWin = nwWin;

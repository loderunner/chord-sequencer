const Note = require('./note.js');
const Scale = require('./scale.js');

const Tonality = {
    Note : function(val) { return new Note(val); },
    Scale : function(key, mode) { return new Scale(key, mode); },
    keys : Scale.keys,
    modes : Object.keys(Scale.modes)
}

module.exports = Tonality;
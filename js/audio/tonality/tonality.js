const Note = require('./note.js');

const Tonality = {
    Note : function(val) { return new Note(val); },
    keys : ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'],
    modes : {
        'Major'     : [2,2,1,2,2,2,1],
        'Minor'     : [2,1,2,2,1,2,2],
        'Harmonic'  : [2,1,2,2,1,3,1],
        'Melodic'   : [2,1,2,2,2,2,1],
        'Ionian'    : [2,2,1,2,2,2,1],
        'Dorian'    : [2,1,2,2,2,1,2],
        'Phrygian'  : [1,2,2,2,1,2,2],
        'Lydian'    : [2,2,2,1,2,2,1],
        'Mixolydian': [2,2,1,2,2,1,2],
        'Aeolian'   : [2,1,2,2,1,2,2],
        'Locrian'   : [1,2,2,1,2,2,2]
    }
}

module.exports = Tonality;
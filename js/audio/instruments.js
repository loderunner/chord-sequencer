const Tone = require('tone');

const padSynth = new Tone.PolySynth(8, Tone.MonoSynth).toMaster();
padSynth.set({
    oscillator : {
        type : "fatsawtooth",
        spread : 30,
        count : 7
    },
    filter : {
        Q : 0,
        type : "lowpass",
        rolloff : -24
    },
    envelope : {
        attack : 0.3,
        decay : 0.1,
        sustain : 0.9,
        release : 2,
    },
    filterEnvelope:{
        attack : 0.06,
        decay : 0.2,
        sustain : 0.5,
        release : 2,
        baseFrequency : 2000,
        octaves : 0,
        exponent : 2
    }
});

module.exports = {
    'pad' : {
        synth : padSynth,
        play : function(controller, time, event) {
            var note = Tonality.Note(controller.scale.key + '3');
            note = controller.scale.add(note, event.get('step'));
            note.octave = 3;
            this.synth.triggerAttackRelease(note.toString(), event.get('duration'), time);
            var numberOfNotes = event.get('seventh') ? 4 : 3;
            for (var i = 0; i < numberOfNotes; i ++) {
                note.octave = 4;
                this.synth.triggerAttackRelease(note.toString(), event.get('duration'), time);
                note = controller.scale.add(note, 2);
            }
        }
    }
}
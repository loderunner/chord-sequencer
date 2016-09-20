const Tone = require('tone');

const padSynth = new Tone.PolySynth(8, Tone.MonoSynth);
padSynth.set({
    oscillator : {
        type : "sawtooth"
    },
    filter : {
        Q : 1,
        type : "lowpass",
        rolloff : -12
    },
    envelope : {
        attack : 2.5,
        attackCurve : 'linear',
        decay : 1,
        sustain : 1,
        release : 2.5,
        releaseCurve : 'exponential'
    },
    filterEnvelope:{
        attack : 1,
        decay : 1,
        sustain : 0.25,
        release : 3,
        baseFrequency : 1500,
        octaves : 0.4,
        exponent : 2
    }
});

const reverb = new Tone.JCReverb().toMaster();
reverb.set({
    roomSize : 0.6,
    wet : 0.6
});

padSynth.connect(reverb);

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
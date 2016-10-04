const Tone = require('tone');

const bassSynth = new Tone.MonoSynth().toMaster();
bassSynth.set({
    oscillator : {
        type : "triangle"
    },
    filter : {
        Q : 0,
        type : "lowpass",
        rolloff : -12
    },
    envelope : {
        attack : .001,
        decay : .001,
        sustain : 1,
        release : .01
    },
    filterEnvelope : {
        attack : .001,
        decay : 1,
        sustain : 1,
        release : 1,
        baseFrequency : 2000,
        octaves : 0,
        exponent : 1
    }
});

const arpSynth = new Tone.MonoSynth().toMaster();
arpSynth.set({
    oscillator : {
        type : "square"
    },
    filter : {
        Q : 0,
        type : "lowpass",
        rolloff : -12
    },
    envelope : {
        attack : .001,
        decay : .001,
        sustain : 1,
        release : .01
    },
    filterEnvelope : {
        attack : .001,
        decay : 1,
        sustain : 1,
        release : 1,
        baseFrequency : 5000,
        octaves : 0,
        exponent : 1
    }
});

module.exports = {
    play : function(controller, time, event) {
        var note = Tonality.Note(controller.scale.key);
        note = controller.scale.add(note, event.get('step'));
        note.octave = 2;
        bassSynth.triggerAttackRelease(note.toString(), event.get('duration'), time);

        var endTime = Tone.Time(time).add(event.get('duration')).toSeconds();
        time = Tone.Time(time);
        if (event.get('seventh')) {
            var intervals = [4, 6, 7, 9];
        } else {
            var intervals = [4, 7, 9, 11];
        }       
        var rootNote = Tonality.Note(note);
        rootNote.octave = 4;
        var i = 0;
        do {
            note = controller.scale.add(rootNote, intervals[i % intervals.length]);
            arpSynth.triggerAttackRelease(note.toString(), '64n', time);
            time.add('64n');
            i++;
        } while (time.toSeconds() < endTime);
    }
}
   
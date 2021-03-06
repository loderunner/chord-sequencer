const Tone = require('tone');

var defaults = {
    "frequency" : "C4",
    "detune" : 0,
    "oscillator" : {
        "type" : "square"
    },
    "filter" : {
        "Q" : 6,
        "type" : "lowpass",
        "rolloff" : -24
    },
    "envelope" : {
        "attack" : 0.005,
        "decay" : 0.1,
        "sustain" : 0.9,
        "release" : 1
    },
    "filterEnvelope" : {
        "attack" : 0.06,
        "decay" : 0.2,
        "sustain" : 0.5,
        "release" : 2,
        "baseFrequency" : 200,
        "octaves" : 7,
        "exponent" : 2
    }
};

function PadSynth(options) {
    options = this.defaultArg(options, defaults);
    Tone.MonoSynth.call(this, options);

    this.pan = new Tone.Panner(0);
    this.envelope.disconnect(this.output);
    this.envelope.chain(this.pan, this.output);
    
    this.lfo = new Tone.LFO(1,-.65,.65);
    this.lfo.type = "sine";
    this.lfo.connect(this.pan.pan);
    this.lfo.start();

    return this;
}

Tone.extend(PadSynth, Tone.MonoSynth);

PadSynth.prototype.setNote = function(note, time) {
    Tone.MonoSynth.prototype.setNote.call(this, note, time);
    const freq = this.toFrequency(note);
    this.lfo.frequency.value = freq / 350;
}

function PandaPad() {

    this.padSynth = new Tone.PolySynth(12, PadSynth);
    this.padSynth.set({
        oscillator : {
            type : "fatsawtooth",
            spread : 30,
            count : 7
        },
        filter : {
            Q : 1,
            type : "lowpass",
            rolloff : -12
        },
        envelope : {
            attack : 1.5,
            attackCurve : 'linear',
            decay : 1,
            sustain : 1,
            release : 3,
            releaseCurve : 'exponential'
        },
        filterEnvelope : {
            attack : .75,
            attackCurve : 'linear',
            decay : .75,
            sustain : 0.25,
            release : 1.25,
            releaseCurve : 'exponential',
            baseFrequency : 2000,
            octaves : 0.25,
            exponent : 1
        }
    });

    this.reverb = new Tone.Freeverb().toMaster();
    this.reverb.set({
        roomSize : 0.6,
        dampening : 2000,
        wet : 0.6
    });

    this.padSynth.connect(this.reverb);
}

PandaPad.prototype.play = function(controller, time, event) {
    var note = Tonality.Note(controller.scale.key + '3');
    note = controller.scale.add(note, event.get('step'));
    note.octave = 3;
    this.padSynth.triggerAttackRelease(note.toString(), event.get('duration'), time);
    var numberOfNotes = event.get('seventh') ? 4 : 3;
    for (var i = 0; i < numberOfNotes; i ++) {
        note.octave = 4;
        this.padSynth.triggerAttackRelease(note.toString(), event.get('duration'), time);
        note = controller.scale.add(note, 2);
    }
}

PandaPad.prototype.dispose = function() {
    this.reverb.dispose();
    this.padSynth.dispose();
}

module.exports = {
    id : 'panda-pad',
    name: 'Panda Pad',
    params : [],
    createInstrument : function() { return new PandaPad(); },
    createView : function() {
        return '<div></div>';
    }
}
   
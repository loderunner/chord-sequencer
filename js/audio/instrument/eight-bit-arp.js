const Tone = require('tone');
const DropdownMenu = require('view/dropdown-menu.js');

function EightBitArp() {

    this.octaves = 4;
    this.subdivision = '64n';

    this.bassSynth = new Tone.MonoSynth().toMaster();
    this.bassSynth.set({
        oscillator : {
            type : "square6"
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

    this.arpSynth = new Tone.MonoSynth().toMaster();
    this.arpSynth.set({
        oscillator : {
            type : "square24"
        },
        filter : {
            Q : 0,
            type : "lowpass",
            rolloff : -12
        },
        envelope : {
            attack : .001,
            decay : .001,
            sustain : .9,
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

    this.pingPongDelay = new Tone.PingPongDelay("16n", 0.4).toMaster();
    this.pingPongDelay.output.gain.value = .1;
    this.arpSynth.connect(this.pingPongDelay);
}

EightBitArp.prototype.play = function(controller, time, event) {
    var note = Tonality.Note(controller.scale.key);
    note = controller.scale.add(note, event.get('step'));
    note.octave = 2;
    this.bassSynth.triggerAttackRelease(note.toString(), event.get('duration'), time);

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
        note.octave = ((note.octave - rootNote.octave) % this.octaves) + rootNote.octave;
        this.arpSynth.triggerAttackRelease(note.toString(), this.subdivision, time);
        time.add(this.subdivision);
        i++;
    } while (time.toSeconds() < endTime);
}

EightBitArp.prototype.dispose = function() {
    this.bassSynth.dispose();
    this.arpSynth.dispose();
}

EightBitArp.prototype.set = function(param, value) {
    if (param === 'octaves') {
        this.octaves = value;
    } else if (param === 'subdivision') {
        this.subdivision = value;
    }
}

EightBitArp.prototype.get = function(param) {
    if (param === 'octaves') {
        return this.octaves;
    } else if (param === 'subdivision') {
        return this.subdivision;
    }
}

EightBitArp.prototype.getParams = function() {
    return { 'octaves' : this.octaves, 'subdivision' : this.subdivision }
}

function EightBitArpView() {
    this.element = document.createElement('div');
    this.element.innerHTML = require('html!./eight-bit-arp.html');

    for (var dropdown of this.element.querySelectorAll('.dropdown-menu')) {
        DropdownMenu(dropdown);

        const self = this;
        dropdown.addEventListener('select', function(e) {
            e.stopPropagation();

            const changeEvent = new Event('change', {"bubbles":true});
            changeEvent.param = e.currentTarget.parentNode.classList[0];
            changeEvent.value = e.target.getAttribute('data-value');
            self.element.dispatchEvent(changeEvent);
        })
    }

    return this.element;
}

module.exports = {
    id : 'eight-bit-arp',
    name : '8-bit arpeggiator',
    params : ['octaves', 'subdivision'],
    createInstrument : function() { return new EightBitArp(); },
    createView : function() { return new EightBitArpView(); }
}
   
const _ = require('underscore');
const Backbone = require('backbone-nested-models');
const Tone = require('tone');

function AudioController(song) {
    _.extend(this, Backbone.Events);

    this.synth = new Tone.PolySynth(8, Tone.Synth).toMaster();

    const self = this;
    this.part = new Tone.Part(function(time, event) {
        self.synth.triggerAttackRelease('C3', '8n', time);
    }, ['0m', '4n', '2 * 4n', '3 * 4n']);
    this.part.start('0m');
    this.part.stop('8m');
    // part.loopStart = '0m';
    // part.loopEnd = '8m';
    // part.loop = true;

    Tone.Transport.loopStart = "0m";
    Tone.Transport.loop = true;

    this.song = song;

    this.listenTo(song.get('sequence'), 'change', this.updateSequence);

    return this;
}

AudioController.prototype.updateSequence = function(sequence) {
    console.log(sequence);
    if (sequence.hasChanged('tempo')) {
        Tone.Transport.bpm.value = sequence.get('tempo');
    }
    if (sequence.hasChanged('loopLength')) {
        Tone.Transport.loopEnd = sequence.get('loopLength');
    }
}

module.exports = AudioController;
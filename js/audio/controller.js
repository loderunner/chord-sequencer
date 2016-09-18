const _ = require('underscore');
const Backbone = require('backbone-nested-models');
const Tone = require('tone');

const Tonality = require('audio/tonality/tonality.js');

function AudioController(song) {
    _.extend(this, Backbone.Events);

    this.synth = new Tone.PolySynth(8, Tone.Synth).toMaster();

    const self = this;
    this.part = new Tone.Part(function(time, event) {
        var note = Tonality.Note(self.scale.key + '3');
        note = self.scale.add(note, event.get('step'));
        note.octave = 3;
        self.synth.triggerAttackRelease(note.toString(), event.get('duration'), time);
        for (var i = 0; i < 3; i ++) {
            note.octave = 4;
            self.synth.triggerAttackRelease(note.toString(), event.get('duration'), time);
            note = self.scale.add(note, 2);
        }
    });
    this.part.start('0m');
    this.part.stop('8m');

    Tone.Transport.loopStart = "0m";
    Tone.Transport.loopEnd = "8m";
    Tone.Transport.loop = true;

    this.song = song;

    this.sequence = song.get('sequence');
    this.listenTo(this.sequence, 'change:tempo', this.updateTempo);
    this.listenTo(this.sequence, 'change:loopLength', this.updateLoopLength);
    this.listenTo(this.sequence, 'change:key', this.updateKeyMode);
    this.listenTo(this.sequence, 'change:mode', this.updateKeyMode);

    this.chordList = this.sequence.get('chordList');
    this.listenTo(this.chordList, 'update', this.updateChordList);
    this.listenTo(this.chordList, 'change', this.updateChord);

    return this;
}

AudioController.prototype.updateTempo = function(sequence) {
    Tone.Transport.bpm.value = sequence.get('tempo');
}


AudioController.prototype.updateLoopLength = function(sequence) {
    Tone.Transport.loopEnd = sequence.get('loopLength');
}

AudioController.prototype.updateChordList = function(chordList, options) {
    _.each(options.changes.added, function(chord) {
        this.part.add(chord.get('start'), chord);
    }, this);

    _.each(options.changes.removed, function(chord) {
        this.part.remove(chord.get('start'), chord);
    }, this);
}

AudioController.prototype.updateChord = function(chord) {
    if (chord.hasChanged('start')) {
        this.part.remove(chord.previous('start'), chord);
        this.part.add(chord.get('start'), chord);
    }
}

AudioController.prototype.updateKeyMode = function() {
    this.scale = Tonality.Scale(this.sequence.get('key'), this.sequence.get('mode'));
}

module.exports = AudioController;
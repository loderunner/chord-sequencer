const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');
const Tone = require('tone');

module.exports = Backbone.View.extend({
    tagName : 'div',
    className : 'sequencer-container',

    // Lifecycle
    initialize : function() {
        this.grid = '16n';
        this.zoom = '1m';

        const chordList = this.model.get('chordList');
        this.listenTo(this.model, "change:loopLength", this.updateLoopLength);
        this.listenTo(chordList, "add", this.addChord);
        this.listenTo(chordList, "remove", this.removeChord);
        this.listenTo(chordList, "change", this.updateChord);
        this.create();

        this.initEvents();
    },

    create : function() {
        const html = require('html!view/html/sequencer.html');
        this.$el.append(html);
    },

    // Model events
    updateLoopLength : function(sequence) {
        const $backgrounds = this.$('.chord-background');
        $backgrounds.empty();

        const loopLength = sequence.get('loopLength');

        const viewInTicks = Tone.Time(this.zoom).toTicks();
        const gridInTicks = Tone.Time(this.grid).toTicks();
        const numberOf16ths = Tone.Time(loopLength).toTicks() / gridInTicks;
        for (var i = 0; i < numberOf16ths; i++) {
            const $chordBackground = $('<chord class="chord-background">');
            const startInTicks = gridInTicks * i;
            $chordBackground.css('left', 'calc(100% * ' + startInTicks + ' / ' + viewInTicks + ')');
            $chordBackground.css('width', 'calc(100% * ' + gridInTicks + ' / ' + viewInTicks + ' - 2px)');
            $backgrounds.append($chordBackground);
        }

        this.updateScroll();
    },

    updateChordList : function(sequence) {
    },

    addChord : function(chord, chordList) {
        console.log(chordList, chord);
    },

    removeChord : function(chord, chordList) {
        console.log(chordList, chord);
    },

    updateChord : function(chord, chordList) {
        console.log(chordList, chord);
    },

    // UI events
    events : {
        'mousedown .chord-sequencer' : 'updateScroll'
    },

    initEvents : function() {
        const $chordSequencer = this.$('.chord-sequencer');
        $chordSequencer.on('scroll', this.updateScroll.bind(this));
    },

    updateScroll : function(e) {
        const $chordSequencer = this.$('.chord-sequencer');
        const scrollLeft = $chordSequencer.get(0).scrollLeft;
        const maxScroll = $chordSequencer.get(0).scrollWidth - $chordSequencer.get(0).clientWidth;

        const $scrollIndicatorLeft = this.$('.scroll-indicator-left');
        if (scrollLeft > 0) {
            $scrollIndicatorLeft.removeClass('hidden');
        } else {
            $scrollIndicatorLeft.addClass('hidden');
        }

        const $scrollIndicatorRight = this.$('.scroll-indicator-right');
        if (scrollLeft >= maxScroll) {
            $scrollIndicatorRight.addClass('hidden');
        } else {
            $scrollIndicatorRight.removeClass('hidden');
        }
    }
});

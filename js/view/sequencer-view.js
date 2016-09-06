const $ = require('jquery');
const Easing = require('jquery.easing');
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
        const numberOfSubdivisions = Tone.Time(loopLength).toTicks() / gridInTicks;
        for (var i = 0; i < numberOfSubdivisions; i++) {
            const $chordBackground = $('<chord class="chord-background">');
            const beat = parseInt(Tone.Time(this.grid).mult(i).toBarsBeatsSixteenths().split(':')[1]);
            if ((beat%2) === 0)
            {
                $chordBackground.addClass('offbeat');
            }
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
        'click .chord-sequencer' : 'clickChordSequencer'
    },

    initEvents : function() {
        const $chordSequencer = this.$('.chord-sequencer');
        $chordSequencer.scroll(this.updateScroll.bind(this));

        const $scrollIndicatorLeft = this.$('.scroll-indicator-left');
        $scrollIndicatorLeft.click(this.clickScrollIndicator.bind(this));

        const $scrollIndicatorRight = this.$('.scroll-indicator-right');
        $scrollIndicatorRight.click(this.clickScrollIndicator.bind(this));
    },

    clickScrollIndicator : function(e) {
        const $chordSequencer = this.$('.chord-sequencer');
        const left = $(e.currentTarget).hasClass('scroll-indicator-left');
        const deltaScroll = (left?-1:1) * $chordSequencer.get(0).clientWidth;
        $chordSequencer.animate(
            { scrollLeft : $chordSequencer.scrollLeft() + deltaScroll},
            500,
            'easeOutCirc'
        );
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
    },

    clickChordSequencer : function(e) {
        const time = this.timeAtPosition(e.clientX, true);
        console.log(time.toNotation());
    },

    // Helpers
    timeAtPosition : function(x, quantize) {
        const $chordSequencer = this.$('.chord-sequencer');
        const loopLength = this.model.get('loopLength');

        var time = Tone.Time(loopLength);
        var xRatio = (x + $chordSequencer.scrollLeft() - $chordSequencer.offset().left) / $chordSequencer.get(0).scrollWidth;
        time.mult(xRatio);
        if (quantize === 'floor') {
            time.sub(Tone.Time(this.grid).div(2));
            time.quantize(Tone.Time(this.grid));
        }
        else if (quantize === true || quantize === 'quantize') {
            time.quantize(Tone.Time(this.grid));
        }
        
        return time;
    }
});

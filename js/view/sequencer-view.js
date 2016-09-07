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
        const chordList = this.model.get('chordList');
        this.listenTo(this.model, "change:loopLength", this.updateLoop);
        this.listenTo(this.model, "change:zoom", this.updateLoop);
        this.listenTo(this.model, "change:grid", this.updateLoop);
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
    updateLoop : function(sequence) {
        const $backgrounds = this.$('.chord-background');
        $backgrounds.empty();

        const loopLength = sequence.get('loopLength');

        const viewInTicks = Tone.Time(this.model.get('zoom')).toTicks();
        const gridInTicks = Tone.Time(this.model.get('grid')).toTicks();
        const numberOfSubdivisions = Tone.Time(loopLength).toTicks() / gridInTicks;
        var $chords = $();
        for (var i = 0; i < numberOfSubdivisions; i++) {
            const $chordBackground = $('<chord class="chord-background">');
            const beat = parseInt(Tone.Time(this.model.get('grid')).mult(i).toBarsBeatsSixteenths().split(':')[1]);
            if (beat&1)
            {
                $chordBackground.addClass('offbeat');
            }
            const startInTicks = gridInTicks * i;
            $chordBackground.css('left', 'calc(100% * ' + startInTicks + ' / ' + viewInTicks + ')');
            $chordBackground.css('width', 'calc(100% * ' + gridInTicks + ' / ' + viewInTicks + ' - 2px)');
            $chords = $chords.add($chordBackground);
        }
        $backgrounds.append($chords);

        this.updateScroll();

        var self = this;
        Tone.Transport.scheduleRepeat(function(time) {
            self.updateTime(time);
        }, "1i");
    },

    updateChordList : function(sequence) {
    },

    addChord : function(chord, chordList) {
    },

    removeChord : function(chord, chordList) {
    },

    updateChord : function(chord, chordList) {
    },

    updateTime : function() {
        const $chordSequencer = this.$('.chord-sequencer');
        const $positionIndicator = $chordSequencer.find('.position-indicator');
        const position = Tone.Time(Tone.Transport.position).toTicks();
        const loopLength = Tone.Time(this.model.get('loopLength')).toTicks();
        $positionIndicator.css('left', ($chordSequencer.get(0).scrollWidth * position / loopLength).toString() + 'px');
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
            time.sub(Tone.Time(this.model.get('grid')).div(2));
            time.quantize(Tone.Time(this.model.get('grid')));
        }
        else if (quantize === true || quantize === 'quantize') {
            time.quantize(Tone.Time(this.model.get('grid')));
        }
        
        return time;
    }
});

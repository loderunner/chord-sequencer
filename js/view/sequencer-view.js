const $ = require('jquery');
const Easing = require('jquery.easing');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');
const Tone = require('tone');

const ChordView = require('view/chord-view.js');

module.exports = Backbone.View.extend({
    tagName : 'div',
    className : 'sequencer-container',

    // Lifecycle
    initialize : function() {
        this.create();
        
        const chordList = this.model.get('chordList');
        this.listenTo(this.model, "change:loopLength", this.updateLoop);
        this.listenTo(this.model, "change:zoom", this.updateLoop);
        this.listenTo(this.model, "change:grid", this.updateLoop);
        this.listenTo(chordList, "add", this.addChord);

        var self = this;
        Tone.Transport.scheduleRepeat(function(time) {
            self.updateTime(time);
        }, "1i");
        this.initEvents();
    },

    create : function() {
        const html = require('html!view/html/sequencer.html');
        this.$el.append(html);

        this.$chordSequencer = this.$('.chord-sequencer');
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
    },

    updateChordList : function(sequence) {
    },

    addChord : function(chord, chordList, options) {
        const chordView = new ChordView({ model : chord, parent : this });
        this.$chordSequencer.append(chordView.$el);

        if (options && options.event) {
            const dragZone = chordView.$('.drag-zone-right');
            const event = new MouseEvent('mousedown', {
                screenX : dragZone.offset().left,
                screenY : dragZone.offset().top,
                clientX : 0,
                clientY : 0
            });
            dragZone[0].dispatchEvent(event);
        }
    },

    updateTime : function() {
        const x = this.offsetForTime(Tone.Time(Tone.Transport.position));
        const $positionIndicator = this.$chordSequencer.find('.position-indicator');
        $positionIndicator.css('left', x.toString() + 'px');
    },

    // UI events
    events : {
        'mousedown .chord-sequencer' : 'mouseDownChordSequencer'
    },

    initEvents : function() {
        this.$chordSequencer.scroll(this.updateScroll.bind(this));

        const $scrollIndicatorLeft = this.$('.scroll-indicator-left');
        $scrollIndicatorLeft.click(this.clickScrollIndicator.bind(this));

        const $scrollIndicatorRight = this.$('.scroll-indicator-right');
        $scrollIndicatorRight.click(this.clickScrollIndicator.bind(this));
    },

    clickScrollIndicator : function(e) {
        const left = $(e.currentTarget).hasClass('scroll-indicator-left');
        const deltaScroll = (left?-1:1) * this.$chordSequencer.get(0).clientWidth;
        this.$chordSequencer.animate(
            { scrollLeft : this.$chordSequencer.scrollLeft() + deltaScroll},
            500,
            'easeOutCirc'
        );
    },

    updateScroll : function(e) {
        const scrollLeft = this.$chordSequencer.get(0).scrollLeft;
        const maxScroll = this.$chordSequencer.get(0).scrollWidth - this.$chordSequencer.get(0).clientWidth;

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

    mouseDownChordSequencer : function(e) {
        var x = e.clientX + this.$chordSequencer.scrollLeft() - this.$chordSequencer.offset().left;
        const time = this.timeForOffset(x, 'floor');
        
        const chordList = this.model.get('chordList');
        chordList.add({
            step : 0,
            seventh : false,
            start : time.toNotation(),
            duration : this.model.get('grid')
        },
        {
            event : e
        });
    },

    // Helpers
    timeForOffset : function(x, quantize) {
        const loopLength = this.model.get('loopLength');

        const loopTime = Tone.Time(this.model.get('loopLength'));
        const zoomTime = Tone.Time(this.model.get('zoom'));
        if (loopTime.toTicks() < zoomTime.toTicks()) {
            var time = zoomTime;
        } else {
            var time = loopTime;
        }
        var maxTime = Math.max(Tone.Time(this.model.get('loopLength')).toTicks(), Tone.Time(this.model.get('zoom')).toTicks());;
        var xRatio = x / Math.max(this.$chordSequencer.get(0).scrollWidth, this.$chordSequencer.innerWidth());
        time.mult(xRatio);
        if (quantize == 'floor') {
            time.sub(Tone.Time(this.model.get('grid')).div(2));
            time.quantize(Tone.Time(this.model.get('grid')));
        }
        else if (quantize == true || quantize == 'quantize') {
            time.quantize(Tone.Time(this.model.get('grid')));
        }
        
        return time;
    },

    offsetForTime : function(time) {
        const position = time.toTicks();
        const loopLength = Math.max(Tone.Time(this.model.get('loopLength')).toTicks(), Tone.Time(this.model.get('zoom')).toTicks());
        return (this.$chordSequencer.get(0).scrollWidth * position / loopLength);
    }
});

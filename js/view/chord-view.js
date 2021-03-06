const $ = require('jquery');
const Easing = require('jquery.easing');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');
const Tone = require('tone');

const Utils = require('utils.js');
const Draggable = require('view/draggable.js');

module.exports = Backbone.View.extend({
    tagName: 'chord',

    // Lifecycle
    initialize : function(options) {
        this.parent = options.parent;

        this.sequence = this.model.collection.parent;

        this.create();

        this.listenTo(this.model, "change:start", this.updateStart);
        this.updateStart();
        this.listenTo(this.model, "change:duration", this.updateDuration);
        this.updateDuration();
        this.listenTo(this.model, "change:step", this.updateStep);
        this.updateStep();
        this.listenTo(this.model, "change:seventh", this.updateSeventh);
        this.updateSeventh();
        this.listenTo(this.model, "change:ninth", this.updateNinth);
        this.updateNinth();

        this.listenTo(this.sequence, "change:zoom", this.updatePosition);
        this.listenTo(this.model, "remove", this.removeChord);
    },

    create : function() {
        const html = require('html!view/html/chord.html');
        this.$el.append(html);

        this.$radioGroup = this.$('.radio-group');

        Draggable(this.$el.get(0));
        Draggable(this.$('.drag-zone-left').get(0));
        Draggable(this.$('.drag-zone-right').get(0));
    },

    // Model events
    updateStart : function() {
        const viewInTicks = Tone.Time(this.sequence.get('zoom')).toTicks();
        const startInTicks = Tone.Time(this.model.get('start')).toTicks();
        this.$el.css('left', "calc(100% * " + startInTicks + " / " + viewInTicks + ")");
    },

    updateDuration : function() {
        const viewInTicks = Tone.Time(this.sequence.get('zoom')).toTicks();
        const durationInTicks = Tone.Time(this.model.get('duration')).toTicks();
        this.$el.css('width', "calc(100% * " + durationInTicks + " / " + viewInTicks + " - 2px)");
    },

    updateStep : function() {
        const step = this.model.get('step');
        this.$radioGroup.children('.selected').removeClass('selected');
        this.$radioGroup.children('[data-value=' + step + ']').addClass('selected');
    },

    updateSeventh : function() {
        const $checkbox = this.$('.seventh-control .checkbox');
        if (this.model.get('seventh')) {
            $checkbox.removeClass('fa-square-o');
            $checkbox.addClass('fa-check-square-o');
        } else {
            $checkbox.addClass('fa-square-o');
            $checkbox.removeClass('fa-check-square-o');
        }
    },

    updateNinth : function() {
        const $checkbox = this.$('.ninth-control .checkbox');
    },

    updatePosition : function() {
        this.updateStart();
        this.updateDuration();
    },

    removeChord : function() {
        this.$el.remove();
    },

    // UI events
    events : {
        'click' :                           'clickChord',
        'click .step-group>span' :          'clickStep',
        'mousedown .step-group>span' :      Utils.stopPropagation,
        'click .seventh-control' :          'clickSeventh',
        'mousedown .seventh-control' :      Utils.stopPropagation,
        'draggable-begin' :                 'beginDragChord',
        'draggable-drag' :                  'dragChord',
        'draggable-end' :                   'endDragChord',
        'draggable-drag .drag-zone-left' :  'dragLeft',
        'draggable-drag .drag-zone-right' : 'dragRight'
    },

    clickChord : function(e) {
        e.stopPropagation();

        this.model.collection.remove(this.model);
    },

    clickStep : function(e) {
        e.stopPropagation();
        
        this.model.set('step', $(e.currentTarget).attr('data-value'));
    },

    clickSeventh : function(e) {
        e.stopPropagation();
        
        this.model.set('seventh', !this.model.get('seventh'));
    },

    beginDragChord : function(e) {
        this.clickX = e.originalEvent.pageX - this.$el.offset().left;
        this.$el.addClass('dragging');
    },

    dragChord : function(e) {
        e.stopPropagation();
        
        var x = e.originalEvent.pageX
                - this.clickX
                + this.parent.$chordSequencer.scrollLeft()
                - this.parent.$chordSequencer.offset().left;
        var time = this.parent.timeForOffset(x, true);

        if (time.toTicks() >= 0) {
            this.model.set('start', time.toNotation());
        }
    },

    endDragChord : function(e) {
        delete this.clickX;
        this.$el.removeClass('dragging');

        for (var i = 0; i < this.model.collection.length; i++) {
            const chord = this.model.collection.at(i);
            if (chord === this.model) {
                continue;
            }
            const cutStart = Tone.Time(this.model.get('start'));
            const cutEnd = Tone.Time(cutStart).add(this.model.get('duration'));
            const cuts = chord.cutout(cutStart, cutEnd);
            if ((cuts.left === null) && (cuts.right === null)) {
                // left and right are null, chord has been deleted
                // decrement index
                i--;
            }
        }
    },

    dragLeft : function(e) {
        e.stopPropagation();

        var x = e.originalEvent.pageX + this.parent.$chordSequencer.scrollLeft() - this.parent.$chordSequencer.offset().left;
        var time = this.parent.timeForOffset(x, true);

        var d = Tone.Time(this.model.get('start'))
                        .add(this.model.get('duration'))
                        .sub(time);
        if (d.toTicks() > 0) {
            this.model.set({
                start: time.toNotation(),
                duration: d.toNotation()
            });
        }
    },

    dragRight : function(e) {
        e.stopPropagation();
        
        var x = e.originalEvent.pageX + this.parent.$chordSequencer.scrollLeft() - this.parent.$chordSequencer.offset().left;
        var time = this.parent.timeForOffset(x, true);

        time.sub(Tone.Time(this.model.get('start')));
        if (time.toTicks() > 0) {
            this.model.set('duration', time.toNotation());
        }
    }
});
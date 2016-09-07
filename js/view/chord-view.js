const $ = require('jquery');
const Easing = require('jquery.easing');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');
const Tone = require('tone');

module.exports = Backbone.View.extend({
    tagName: 'chord',

    // Lifecycle
    initialize : function() {
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

        
    },

    create : function() {
        const html = require('html!view/html/chord.html');
        this.$el.append(html);

        this.$radioGroup = this.$('.radio-group');
    },

    // Model events
    updateStart : function() {
        const sequence = this.model.collection.parent;
        const viewInTicks = Tone.Time(sequence.get('loopLength')).toTicks();
        const startInTicks = Tone.Time(this.model.get('start')).toTicks();
        this.$el.css('left', "calc(100% * " + startInTicks + " / " + viewInTicks + ")");
    },

    updateDuration : function() {
        const sequence = this.model.collection.parent;
        const viewInTicks = Tone.Time(sequence.get('loopLength')).toTicks();
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

    // UI events
    events : {
        'click .step-group>span' : 'clickStep',
        'click .seventh-control' : 'clickSeventh'
    },

    clickStep : function(e) {
        e.stopPropagation();
        
        this.model.set('step', $(e.currentTarget).attr('data-value'));
    },

    clickSeventh : function(e) {
        e.stopPropagation();
        
        this.model.set('seventh', !this.model.get('se'));
    }
});
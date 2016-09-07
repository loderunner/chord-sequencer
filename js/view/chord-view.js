const $ = require('jquery');
const Easing = require('jquery.easing');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');
const Tone = require('tone');

module.exports = Backbone.View.extend({
    tagName: 'chord',

    // Lifecycle
    initialize : function() {
        this.listenTo(this.model, "change:start", this.updateStart);
        this.listenTo(this.model, "change:duration", this.updateDuration);
        this.listenTo(this.model, "change:step", this.updateStep);
        this.listenTo(this.model, "change:seventh", this.updateSeventh);
        this.create();
    },

    create : function() {
        const html = require('html!view/html/chord.html');
        this.$el.append(html);

        this.$radioGroup = this.$('.radio-group');
    },

    // Model events
    updateStart : function() {
        const sequence = this.model.collection.parent;
        const viewInTicks = Tone.Time(sequence.get('zoom')).toTicks();
        const startInTicks = Tone.Time(this.model.get('start')).toTicks();
        chordElement.style.left = 'calc(100% * ' + startInTicks + ' / ' + viewInTicks + ')';
    },

    updateDuration : function() {
        const sequence = this.model.collection.parent;
        const viewInTicks = Tone.Time(sequence.get('zoom')).toTicks();
        const durationInTicks = Tone.Time(this.model.get('duration')).toTicks();
        chordElement.style.width = 'calc(100% * ' + durationInTicks + ' / ' + viewInTicks + ' - 2px)';
    },

    updateStep : function() {
        const step = this.model.get('step');
        this.$radioGroup.children('.selected').removeClass('selected');
        this.$radioGroup.children('[data-value=' + step + ']').addClass('selected');
    },

    // UI events
    events : {
        'click .radio-group>span' : 'clickRadio'
    },

    clickRadio : function(e) {
        this.model.set('step', $(e.currentTarget).attr('data-value'));
    }
});
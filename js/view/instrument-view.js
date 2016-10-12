const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');

const Audio = require('audio/controller.js');

module.exports = Backbone.View.extend({
    tagName : 'section',
    className : 'instrument',

    // Lifecycle
    initialize : function() {
        this.create();
        
        this.listenTo(this.model, "change:id", this.updateId);
    },

    create : function() {
        this.$el.append('<h2 class="subtitle">Instrument</h2><div class="radio-group"></div>');
        this.$radioGroup = this.$('.radio-group');
        for (var instrumentId in Audio.Instruments) {
            const instrument = Audio.Instruments[instrumentId];
            this.$radioGroup.append('<span data-value="' + instrumentId + '">' + instrument.name + '</span>');
        }

        this.$el.append('<div class="instrument-view"></div>');
        this.$instrumentView = this.$('.instrument-view');
    },

    // Model events
    updateId : function() {
        this.$radioGroup.children('.selected').removeClass('selected');
        this.$radioGroup.children('[data-value="' + this.model.get('id') + '"]').addClass('selected');

        this.$instrumentView.children().remove();

        const instrumentId = this.model.get('id');
        if (instrumentId in Audio.Instruments) {
            const instrument = Audio.Instruments[instrumentId];
            this.$instrumentView.append(instrument.createView());
        }
    },

    // UI events
    events : {
        'click .radio-group>span' : 'clickRadio',
        'change .instrument-view' : 'changeParam'
    },

    clickRadio : function(e) {
        e.stopPropagation();
        
        this.model.set('id', $(e.currentTarget).attr('data-value'));
    },

    changeParam : function(e) {
        e.stopPropagation();

        this.model.set(e.originalEvent.param, e.originalEvent.value);
    }
});
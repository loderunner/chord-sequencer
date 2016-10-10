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
    },

    // Model events
    updateId : function() {
        this.$radioGroup.children('.selected').removeClass('selected');
        this.$radioGroup.children('[data-value="' + this.model.get('id') + '"]').addClass('selected');

        if (this.$instrumentView) {
            this.stopListening(this.$instrumentView);
            this.$el.children().remove('.instrument-view');
            delete(this.$instrumentView);
        }

        const instrumentId = this.model.get('id');
        if (instrumentId in Audio.Instruments) {
            const instrument = Audio.Instruments[instrumentId];
            this.$el.append(instrument.createView());
            this.$instrumentView = this.$el.children().last();
            this.$instrumentView.addClass('instrument-view');
        }
    },

    // UI events
    events : {
        'click .radio-group>span' : 'clickRadio',
        'change .instrument-view' : 'changeInstrument'
    },

    clickRadio : function(e) {
        e.stopPropagation();
        
        this.model.set('id', $(e.currentTarget).attr('data-value'));
    }
});
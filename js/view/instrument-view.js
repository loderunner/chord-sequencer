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
        
        this.listenTo(this.model, "change:instrument", this.updateInstrument);
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
    updateInstrument : function() {
        const instrument = this.model.get('instrument');
        this.$radioGroup.children('.selected').removeClass('selected');
        this.$radioGroup.children('[data-value="' + instrument + '"]').addClass('selected');
    },

    // UI events
    events : {
        'click .radio-group>span' : 'clickRadio'
    },

    clickRadio : function(e) {
        e.stopPropagation();
        
        this.model.set('instrument', $(e.currentTarget).attr('data-value'));
    }
});
const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');

const Tonality = require('audio/tonality/tonality.js');

module.exports = Backbone.View.extend({
    tagName : 'section',
    className : 'mode',

    // Lifecycle
    initialize : function() {
        this.create();
        this.listenTo(this.model, "change:mode", this.updateMode);
    },

    create : function() {
        this.$el.append('<h2 class="subtitle">Mode</h2><div class="radio-group"></div>');
        this.$radioGroup = this.$('.radio-group');
        for (var mode of Tonality.modes) {
            this.$radioGroup.append('<span data-value="' + mode + '"">' + mode + '</span>');
        }
    },

    // Model events
    updateMode : function() {
        const mode = this.model.get('mode');
        this.$radioGroup.children('.selected').removeClass('selected');
        this.$radioGroup.children('[data-value=' + mode + ']').addClass('selected');
    },

    // UI events
    events : {
        'click .radio-group>span' : 'clickRadio'
    },

    clickRadio : function(e) {
        e.stopPropagation();
        
        this.model.set('mode', $(e.currentTarget).attr('data-value'));
    }
});
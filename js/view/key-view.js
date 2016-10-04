const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');

const Tonality = require('audio/tonality/tonality.js');

module.exports = Backbone.View.extend({
    tagName : 'section',
    className : 'key',

    // Lifecycle
    initialize : function() {
        this.create();
        
        this.listenTo(this.model, "change:key", this.updateKey);
    },

    create : function() {
        this.$el.append('<h2 class="subtitle">Key</h2><div class="radio-group"></div>');
        this.$radioGroup = this.$('.radio-group');
        for (var key of Tonality.keys) {
            this.$radioGroup.append('<span data-value="' + key + '">' + key + '</span>');
        }
    },

    // Model events
    updateKey : function() {
        const key = this.model.get('key');
        this.$radioGroup.children('.selected').removeClass('selected');
        this.$radioGroup.children('[data-value="' + key + '"]').addClass('selected');
    },

    // UI events
    events : {
        'click .radio-group>span' : 'clickRadio'
    },

    clickRadio : function(e) {
        e.stopPropagation();
        
        this.model.set('key', $(e.currentTarget).attr('data-value'));
    }
});
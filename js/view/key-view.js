const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');
const Tonality = require('audio/tonality.js');

module.exports = Backbone.View.extend({
    tagName : 'section',
    className : 'key',

    initialize : function() {
        this.listenTo(this.model, "change", this.render);
        this.create();
    },

    events : {
        'click .radio-group>span' : 'clickRadio'
    },

    create : function() {
        this.$el.append('<h2 class="subtitle">Key</h2><div class="radio-group"></div>');
        this.$radioGroup = this.$('.radio-group');
        for (key of Tonality.keys) {
            this.$radioGroup.append('<span data-value="' + key + '"">' + key + '</span>');
        }
    },

    render : function() {
        if (this.model.hasChanged('key')) {
            const key = this.model.get('key');
            this.$radioGroup.children('.selected').removeClass('selected');
            this.$radioGroup.children('[data-value=' + key + ']').addClass('selected');
        }

        return this;
    },

    clickRadio : function(e) {
        this.model.set('key', $(e.currentTarget).attr('data-value'));
    }
});
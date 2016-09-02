const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');
const Tonality = require('audio/tonality.js');

module.exports = Backbone.View.extend({
    tagName : 'section',
    className : 'mode',

    initialize : function() {
        this.listenTo(this.model, "change", this.render);
        this.create();
    },

    events : {
        'click .radio-group>span' : 'clickRadio'
    },

    create : function() {
        this.$el.append('<h2 class="subtitle">Mode</h2><div class="radio-group"></div>');
        this.$radioGroup = this.$('.radio-group');
        for (mode of Tonality.modes) {
            this.$radioGroup.append('<span data-value="' + mode + '"">' + mode + '</span>');
        }
    },

    render : function() {
        if (this.model.hasChanged('mode')) {
            const mode = this.model.get('mode');
            this.$radioGroup.children('.selected').removeClass('selected');
            this.$radioGroup.children('[data-value=' + mode + ']').addClass('selected');
        }

        return this;
    },

    clickRadio : function(e) {
        this.model.set('mode', $(e.currentTarget).attr('data-value'));
    }
});
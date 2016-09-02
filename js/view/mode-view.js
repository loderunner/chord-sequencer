const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');

module.exports = Backbone.View.extend({
    tagName : 'section',
    className : 'mode',

    initialize : function() {
        this.listenTo(this.model, "change", this.render);
        this.create();
    },

    create : function() {
        this.$el.append('<h2 class="subtitle">Mode</h2>');
    },

    render : function() {
        if (this.model.hasChanged('mode')) {
        }

        return this;
    }
});
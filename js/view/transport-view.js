const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');

module.exports = Backbone.View.extend({
    tagName : 'section',
    className : 'transport',

    initialize : function() {
        this.listenTo(this.model, "change", this.render);
        this.create();
    },

    create : function() {
        const html = require('html!view/html/transport.html');
        this.$el.append(html);
    },

    render : function() {

        // Update changed values
        if (this.model.hasChanged('tempo')) {
        }

        if (this.model.hasChanged('loopLength')) {
        }

        return this;
    }
});
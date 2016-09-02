const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');

module.exports = Backbone.View.extend({
    tagName : 'div',
    className : 'song',

    initialize : function() {
        this.listenTo(this.model, "change", this.render);
    },

    template : _.template('<h1><%= title %></h1>'),

    render : function() {
        this.$el.append(this.template(this.model.attributes));
        return this;
    }
});
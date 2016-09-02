const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');

module.exports = Backbone.View.extend({
    tagName : 'div',
    className : 'song',

    initialize : function() {
        this.listenTo(this.model, "change", this.render);
    },

    template : _.template('<h1 class="title"><%= title %></h1>'),

    render : function() {
        if (this.$el.children().length === 0) {
            this.$el.append(this.template(this.model.toJSON()));
        } else {
            if (this.model.hasChanged('title')) {
                this.$('.title').text(this.model.get('title'));
            }
        }

        return this;
    }
});
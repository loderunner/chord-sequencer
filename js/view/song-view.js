const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');

module.exports = Backbone.View.extend({
    tagName : 'div',
    className : 'song',

    initialize : function() {
        this.listenTo(this.model, "change", this.render);
    },

    events : {
        'click .title' : 'clickTitle',
        'blur .edit' : 'blurEdit',
        'keypress .edit' : 'keyPressEdit',
        'keyDown .edit' : 'keyDownEdit'
    },

    template : _.template('<h1 class="title"><%= title %></h1><input class="edit" value="<%= title %>">'),

    render : function() {
        if (this.$el.children().length === 0) {
            this.$el.append(this.template(this.model.toJSON()));
            this.$title = this.$('.title');
            this.$edit = this.$('.edit');
        } else {
            if (this.model.hasChanged('title')) {
                this.$title.text(this.model.get('title'));
            }
        }

        return this;
    },

    clickTitle : function() {
        this.$edit.attr('value', this.model.get('title'));
        this.$el.addClass('editing');
        this.$edit.focus();
    },

    closeEdit : function(commit) {
        if (commit) {
            var value = this.$edit.val().trim();
            if (value) {
                this.model.set('title', value);
            }
        }

        this.$el.removeClass('editing');
    },

    blurEdit : function() {
        this.closeEdit(this.$el.hasClass('editing'));
    },

    keyPressEdit : function(e) {
        if (e.key === "Enter") {
            this.closeEdit(true);
        }
    },

    keyDownEdit : function(e) {
        if (e.key === 'Escape') {
            this.closeEdit(false);
        }
    }
});
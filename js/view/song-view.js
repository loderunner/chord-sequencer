const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');

const KeyView = require('view/key-view.js');
const ModeView = require('view/mode-view.js');
const TransportView = require('view/transport-view.js');

module.exports = Backbone.View.extend({
    tagName : 'div',
    className : 'song',

    // Lifecycle
    initialize : function() {
        this.listenTo(this.model, "change:title", this.updateTitle);
        this.create();
    },

    create : function() {
        const html = require('html!view/html/song.html');
        this.$el.append(html);

        this.$title = this.$('.title');
        this.$edit = this.$('.edit');

        const container = this.$('.row-container');
        const keyView = new KeyView({ model : this.model.get('sequence') });
        container.append(keyView.$el);
        const modeView = new ModeView({ model : this.model.get('sequence') });
        container.append(modeView.$el);

        const transportView = new TransportView({ model : this.model.get('sequence') });
        container.after(transportView.$el);
    },

    // Model events
    updateTitle : function() {
        this.$title.text(this.model.get('title'));
        this.$edit.attr('value', this.model.get('title'));
    },

    // UI events
    events : {
        'click .title' : 'clickTitle',
        'blur .edit' : 'blurEdit',
        'keypress .edit' : 'keyPressEdit',
        'keyDown .edit' : 'keyDownEdit'
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
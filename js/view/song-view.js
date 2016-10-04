const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');

const InstrumentView = require('view/instrument-view.js');
const SequencerView = require('view/sequencer-view.js');
const KeyView = require('view/key-view.js');
const ModeView = require('view/mode-view.js');
const TransportView = require('view/transport-view.js');

module.exports = Backbone.View.extend({
    tagName : 'div',
    className : 'song',

    // Lifecycle
    initialize : function() {
        this.create();
        
        this.listenTo(this.model, "change:title", this.updateTitle);
    },

    create : function() {
        const html = require('html!view/html/song.html');
        this.$el.append(html);

        this.$title = this.$('.title');
        this.$edit = this.$('.edit');

        const sequence = this.model.get('sequence');


        const container = this.$('.row-container');
        const keyView = new KeyView({ model : sequence });
        container.append(keyView.$el);
        const modeView = new ModeView({ model : sequence });
        container.append(modeView.$el);

        const instrumentView = new InstrumentView({ model : sequence });
        container.before(instrumentView.$el);

        const sequencerView = new SequencerView({ model : sequence });
        container.before(sequencerView.$el);

        const transportView = new TransportView({ model : sequence });
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

    clickTitle : function(e) {
        e.stopPropagation();
        
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
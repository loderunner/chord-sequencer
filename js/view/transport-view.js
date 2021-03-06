const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');
const Tone = require('tone');

const Draggable = require('view/draggable.js');
const DropdownMenu = require('view/dropdown-menu.js');

module.exports = Backbone.View.extend({
    tagName : 'section',
    className : 'transport',

    // Lifecycle
    initialize : function() {
        this.create();
        
        this.listenTo(this.model, "change:tempo", this.updateTempo);
        this.listenTo(this.model, "change:loopLength", this.updateLoopLength);
        this.listenTo(this.model, "change:zoom", this.updateZoom);
        this.listenTo(this.model, "change:grid", this.updateGrid);
    },

    create : function() {
        const html = require('html!view/html/transport.html');
        this.$el.append(html);
        this.$viewControl = this.$('.view-control');
        this.counter = this.$('.transport-control .counter').get(0);
        this.$loopControl = this.$('.loop-control');

        Draggable(this.$loopControl.find('.tempo.value')[0]);
        for (menu of this.$el.find('.dropdown-menu')) {
            DropdownMenu(menu);
        };

        var self = this;
        // Tone.Transport.scheduleRepeat(function(time) {
        //     self.updateTime(time);
        // }, "16n");
    },

    // Model events
    updateTempo : function() {
        this.$loopControl.find('.tempo.value').html(this.model.get('tempo').toString() + ' bpm');
    },

    updateLoopLength : function() {
        const loopLength = this.model.get('loopLength');
        const selectedItem = this.$loopControl.find('.loop-length li[data-value="' + loopLength + '"]');
        this.$loopControl.find('.loop-length .value').html(selectedItem.html());
    },

    updateZoom : function() {
        const zoom = this.model.get('zoom');
        const selectedItem = this.$viewControl.find('.zoom li[data-value="' + zoom + '"]');
        this.$viewControl.find('.zoom .value').html(selectedItem.html());
    },

    updateGrid : function() {
        const grid = this.model.get('grid');
        const selectedItem = this.$viewControl.find('.grid li[data-value="' + grid + '"]');
        this.$viewControl.find('.grid .value').html(selectedItem.html());
    },

    updateTime : function() {
        const bbs = Tone.Transport.position.split(':');
        for (var i = 0; i < 3; i++) {
            const n = parseInt(bbs[i]);
            if (n < 10) {
                bbs[i] = '0' + n.toString();
            }
        }
        this.counter.innerText = bbs.join(':');
    },

    // UI events
    events : {
        'click button.play' : 'clickPlay',
        'click button.stop' : 'clickStop',
        'draggable-drag .tempo.value' : 'dragTempo',
        'select .dropdown-menu.zoom' : 'selectZoom',
        'select .dropdown-menu.grid' : 'selectGrid',
        'select .dropdown-menu.loop-length' : 'selectLoopLength'
    },

    clickPlay : function() {
        Tone.Transport.start();
    },

    clickStop : function() {
        Tone.Transport.stop();
    },

    dragTempo : function(e) {
        const tempo = this.model.get('tempo');
        const $tempoEl = this.$loopControl.find('.tempo.value');
        const bpmMin = parseInt($tempoEl.attr('data-min'));
        const bpmMax = parseInt($tempoEl.attr('data-max'));
        this.model.set('tempo', Math.min(bpmMax, Math.max(bpmMin, Math.round(tempo - e.originalEvent.moveY))));
    },

    selectZoom : function(e) {
        this.model.set('zoom', e.target.getAttribute('data-value'));
    },


    selectGrid : function(e) {
        this.model.set('grid', e.target.getAttribute('data-value'));
    },

    selectLoopLength : function(e) {
        this.model.set('loopLength', e.target.getAttribute('data-value'));
    }
});
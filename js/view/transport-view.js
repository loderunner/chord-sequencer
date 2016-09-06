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
        this.listenTo(this.model, "change:tempo", this.updateTempo);
        this.listenTo(this.model, "change:loopLength", this.updateLoopLength);
        this.create();
    },

    create : function() {
        const html = require('html!view/html/transport.html');
        this.$el.append(html);
        this.$viewControl = this.$('.view-control');
        this.$transportControl = this.$('.transport-control');
        this.$loopControl = this.$('.loop-control');

        Draggable(this.$loopControl.find('.tempo.value')[0]);
        for (menu of this.$el.find('.dropdown-menu')) {
            DropdownMenu(menu);
        };

        var self = this;
        Tone.Transport.scheduleRepeat(function(time) {
            self.updateTime(time);
        }, "1i");
    },

    // Model events
    updateTempo : function() {
        this.$loopControl.find('.tempo.value').text(this.model.get('tempo').toString() + ' bpm');
    },

    updateLoopLength : function() {
        var loopLength = Tone.Time(this.model.get('loopLength')).toBarsBeatsSixteenths();
        loopLength = loopLength.split(':')[0];
        this.$loopControl.find('.loop-length .value').text(loopLength
                                                           + ' bar' 
                                                           + ((parseInt(loopLength) > 1) ? 's' : ''));
    },

    updateTime : function(time) {
        const barsBeatsSixteenths = _.map(Tone.Transport.position.split(':'), function(n) {
            n = parseInt(n);
            return ((n < 10) ? '0' : '') + n.toString();
        });
        this.$transportControl.find('.counter').text(barsBeatsSixteenths.join(':'));
    },

    // UI events
    events : {
        'click button.play' : 'clickPlay',
        'click button.stop' : 'clickStop',
        'draggable-drag .tempo.value' : 'dragTempo',
        'click .dropdown-menu' : 'clickDropdownMenu',
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
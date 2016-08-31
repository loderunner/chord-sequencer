const Backbone = require('backbone-nested-models');

const ChordList = require('model/chord-list.js');

module.exports = Backbone.Model.extend({
    relations : {
        'chordList' : ChordList
    }
});
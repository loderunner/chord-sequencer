const Backbone = require('backbone-nested-models');

const Sequence = require('model/sequence.js');


/**
 * @module Song
 * @class
 * 
 * This describes an entire project.
 *
 * @property {Sequence} Sequence    - The musical data of the song.
 *
 * @extends Backbone.Model
 */
module.exports = Backbone.Model.extend({
    relations : {
        'sequence' : Sequence
    },
    defaults : {
        sequence : function() { return new Sequence; }
    }
});
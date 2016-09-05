const Backbone = require('backbone-nested-models');

const Sequence = require('model/sequence.js');


/**
 * @module Song
 * @class
 * 
 * This describes an entire project.
 *
 * @property {string}   title       - The title of the song. Defaults to `'New Song'`
 * @property {Sequence} sequence    - The musical data of the song.
 *
 * @extends Backbone.Model
 */
module.exports = Backbone.Model.extend({
    relations : {
        'sequence' : Sequence
    },
    defaults : {
        sequence : {}
    }
});
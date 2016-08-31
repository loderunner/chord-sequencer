const Backbone = require('backbone-nested-models');

const Sequence = require('model/sequence.js');

module.exports = Backbone.Model.extend({
    relations : {
        'sequence' : Sequence
    }
});
const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone-nested-models');
const Tone = require('tone');

module.exports = Backbone.View.extend({
    tagName : 'section',
    className : 'transport',

    initialize : function() {
        this.listenTo(this.model, "change", this.render);
        this.create();
    },

    create : function() {
        const html = require('html!view/html/transport.html');
        this.$el.append(html);
        this.$viewControl = this.$('.view-control');
        this.$transportControl = this.$('.transport-control');
        this.$loopControl = this.$('.loop-control');
    },

    render : function() {

        // Update changed values
        if (this.model.hasChanged('tempo')) {
            this.$loopControl.find('.tempo .value').text(this.model.get('tempo'));
        }

        if (this.model.hasChanged('loopLength')) {
            var loopLength = Tone.Time(this.model.get('loopLength')).toBarsBeatsSixteenths();
            loopLength = loopLength.split(':')[0];
            this.$loopControl.find('.loop-length .value').text(loopLength
                                                               + ' bar' 
                                                               + ((parseInt(loopLength) > 1) ? 's' : ''));
        }

        return this;
    }
});
const Backbone = require('backbone-nested-models');
const Tone = require('tone');

/**
 * @module Chord
 * @class
 *
 * A `Chord` encapsulates a complete song.
 *
 * @property {string}       step        - The degree (or step) of the root note of the chord in the scale. Defaults to `0`.
 * @property {boolean}      seventh     - `true` if the chord contains a seventh note. Defaults to `false`.
 * @property {boolean}      ninth       - `true` if the chord contains a ninth note. Defaults to `false`.
 * @property {string}       start       - The start time of the chord in the sequence, in Tone.js time notation. Defaults to `'0m'`.
 * @property {string}       duration    - The duration of the chord, in Tone.js time notation. Defaults to `'16n'`.
 *
 * @extends Backbone.Model
 */
module.exports = Backbone.Model.extend({
    split : function(time) {
        if (!(time instanceof Tone.Time)) {
            time = Tone.Time(time);
        }

        const start = Tone.Time(this.get('start'));
        if (start.toTicks() >= time.toTicks()) {
            return { left : null, right : this };
        }

        const end = Tone.Time(start).add(Tone.Time(this.get('duration')));
        if (end.toTicks() <= time.toTicks()) {
            return { left : this, right : null };
        }

        const leftDuration = Tone.Time(time).sub(start);
        this.set('duration', leftDuration.toNotation());

        var rightChord = this.toJSON();
        rightChord.start = time.toNotation();
        rightChord.duration = end.sub(time).toNotation();
        rightChord = this.collection.add(rightChord);

        return { left : this, right : rightChord };
    },

    slice : function(sliceStart, sliceEnd) {
        if (!(sliceStart instanceof Tone.Time)) {
            sliceStart = Tone.Time(sliceStart);
        }

        if (!(sliceEnd instanceof Tone.Time)) {
            sliceEnd = Tone.Time(sliceEnd);
        }

        if (sliceStart.toTicks() > sliceEnd.toTicks()) {
            throw new RangeError("start is greater than end");
        }

        const chordStart = Tone.Time(this.get('start'));
        const chordEnd = Tone.Time(chordStart).add(this.get('duration'));
        if (sliceStart.toTicks() <= chordStart.toTicks()) {
            if (sliceEnd.toTicks() <= chordStart.toTicks()) {
                //             ____________
                //            |____________|
                //   ^    ^  
                // start end
                return { left : null, right : this };
            } else if (sliceEnd.toTicks() < chordEnd.toTicks()) {
                //             ____________
                //            |____________|
                //   ^                  ^  
                // start               end
                this.set({
                    start : sliceEnd.toNotation(),
                    duration : chordEnd.sub(sliceEnd).toNotation()
                });
                return { left : null, right : this };
            } else {
                //             ____________
                //            |____________|
                //   ^                                ^  
                // start                             end
                this.collection.remove(this);
                return { left : null, right : null };
            }
        } else if (sliceStart.toTicks() < chordEnd.toTicks()) {
            if (sliceEnd.toTicks() < chordEnd.toTicks()) {
                //             ____________
                //            |____________|
                //              ^       ^  
                //            start    end
                this.set('duration', sliceStart.sub(chordStart).toNotation());
                var rightChord = this.toJSON();
                rightChord.start = sliceEnd.toNotation();
                rightChord.duration = chordEnd.sub(sliceEnd).toNotation();
                rightChord = this.collection.add(rightChord);
                return { left : this, right : rightChord };
            } else {
                //             ____________
                //            |____________|
                //              ^                     ^  
                //            start                  end
                this.set('duration', sliceStart.sub(chordStart).toNotation());
                return { left : this, right : null };
            }
        } else {
                //             ____________
                //            |____________|
                //                           ^        ^  
                //                         start     end
                return { left : this, right : null };
        }
    },

    trim : function(trimStart, trimEnd) {
        if (!(trimStart instanceof Tone.Time)) {
            trimStart = Tone.Time(trimStart);
        }

        if (!(trimEnd instanceof Tone.Time)) {
            trimEnd = Tone.Time(trimEnd);
        }

        if (trimStart.toTicks() > trimEnd.toTicks()) {
            throw new RangeError("start is greater than end");
        }

        const chordStart = Tone.Time(this.get('start'));
        const chordEnd = Tone.Time(chordStart).add(this.get('duration'));
        if (trimStart.toTicks() <= chordStart.toTicks()) {
            if (trimEnd.toTicks() <= chordStart.toTicks()) {
                //             ____________
                //            |____________|
                //   ^    ^  
                // start end
                this.collection.remove(this);
                return null;
            } else if (trimEnd.toTicks() < chordEnd.toTicks()) {
                //             ____________
                //            |____________|
                //   ^                  ^  
                // start               end
                this.set({
                    duration : trimEnd.sub(chordStart).toNotation()
                });
                return this;
            } else {
                //             ____________
                //            |____________|
                //   ^                                ^  
                // start                             end
                return this;
            }
        } else if (trimStart.toTicks() < chordEnd.toTicks()) {
            if (trimEnd.toTicks() < chordEnd.toTicks()) {
                //             ____________
                //            |____________|
                //              ^       ^  
                //            start    end
                this.set({
                    start : trimStart,
                    duration : trimEnd.sub(trimStart).toNotation()
                });
                return this;
            } else {
                //             ____________
                //            |____________|
                //              ^                     ^  
                //            start                  end
                this.set({
                    start : trimStart,
                    duration : chordEnd.sub(trimStart).toNotation()
                });
                return this;
            }
        } else {
                //             ____________
                //            |____________|
                //                           ^        ^  
                //                         start     end
                this.collection.remove(this);
                return null;
        }
    }
});
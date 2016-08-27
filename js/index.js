var stopEvent = function (e) {
    e.stopPropagation();
    e.preventDefault();
}

var clickTime = function(x, quantize) {
    
    var chordSequencer = document.getElementById('chord-sequencer');
    var time = Tone.Time(part.loopEnd);
    var margin = parseFloat(window.getComputedStyle(chordSequencer)['margin-left']);
    x = x - chordSequencer.clientLeft - margin;
    var xRatio = x / (chordSequencer.offsetWidth);
    time.mult(xRatio);
    if (quantize === 'floor') {
        time.sub('32n');
        time.quantize('16n');
    }
    else if (quantize === true || quantize === 'quantize') {
        time.quantize('16n');
    }
    
    return time;
}

var beginDrag = function(e, target, callback) {
    e.stopPropagation();
    e.preventDefault();

    document.dragging = true;
    document.dragTarget = target;
    document.dragCallback = callback;

    document.addEventListener('mousemove', document.dragCallback, true);
    document.addEventListener('mouseup', endDrag, true);
    document.addEventListener('click', clickHandler = function(e) {
        e.stopPropagation();
        e.preventDefault();
        document.removeEventListener('click', clickHandler, true);
    }, true);
}

var endDrag = function(e) {
    e.stopPropagation();
    e.preventDefault();

    document.dragTarget.removeAttribute('dragging');

    document.removeEventListener('mousemove', document.dragCallback, true);
    document.removeEventListener('mouseup', endDrag, true);
    document.dragging = false;
    document.dragTarget = null;
    document.dragCallback = null;
}

const counters = document.getElementsByTagName("counter");
Tone.Transport.scheduleRepeat(function(time) {
    updateTime(time);
}, "1i");
Tone.Transport.scheduleRepeat(function(time) {
    updateChordTime(time);
}, "16n");

const keys = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const modes = ['Major', 'Minor', 'Harmonic', 'Melodic', 'Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];

var updateChordAt = function(time) {
    var event = part.at(time).value;
    var chordElement = document.querySelector('chord[data-time="' + time + '"]');
    
    var viewInTicks = Tone.Time('1m').toTicks();
    var startInTicks = Tone.Time(time).toTicks()
    chordElement.style.left = 'calc(100% * ' + startInTicks + ' / ' + viewInTicks + ')';
    var durationInTicks = Tone.Time(event.duration).toTicks();
    chordElement.style.width = 'calc(100% * ' + durationInTicks + ' / ' + viewInTicks + ' - 2px)';
    
    var stepGroup = chordElement.getElementsByClassName('step-group')[0];
    for (el of stepGroup.children) {
        if (el.getAttribute('data-value') == event.chord.root) {
            el.classList.add('selected');
        } else {
            el.classList.remove('selected');
        }
    }
    
    var seventhCheckbox = chordElement.getElementsByClassName('seventh-checkbox')[0];
    if (event.chord.numberOfNotes === 4) {
        seventhCheckbox.setAttribute('data-value', 'true');
        seventhCheckbox.classList.remove('fa-square-o');
        seventhCheckbox.classList.add('fa-check-square-o');
    } else {
        seventhCheckbox.setAttribute('data-value', 'false');
        seventhCheckbox.classList.remove('fa-check-square-o');
        seventhCheckbox.classList.add('fa-square-o');
    }
}

var updateTime = function(time) {
    var pos = Tone.Transport.position;
    for (counter of counters) {
        var i = pos.indexOf('.');
        if (i === -1) {
            counter.textContent = pos;
        } else {
            counter.textContent = pos.substring(0, i);
        }
    }
    
    var positionIndicator = document.getElementById('position-indicator');
    var positionInTicks = Tone.Time(pos).toTicks();
    var loopLength = Tone.Time(part.loopEnd).toTicks();
    positionIndicator.style.left = (positionIndicator.parentNode.scrollWidth * positionInTicks / loopLength).toString() + 'px';
}

var updateChordTime = function(time) {
    var chordElement = document.querySelector('chord[data-time="' + Tone.Time(Tone.Transport.position).toNotation() + '"]');
    if (chordElement) {
        chordElement.classList.add('playing');
    }
}

var updateKey = function() {
    const keySelector = document.getElementById('key-selector');
    for (el of keySelector.children) {
        if (el.getAttribute('data-value') == Tonality.key) {
            el.classList.add('selected');
        } else {
            el.classList.remove('selected');
        }
    }
}

var updateMode = function() {
    const keySelector = document.getElementById('mode-selector');
    for (el of keySelector.children) {
        if (el.getAttribute('data-value') == Tonality.mode) {
            el.classList.add('selected');
        } else {
            el.classList.remove('selected');
        }
    }
}

var updateBpm = function() {
    const bpmControl = document.getElementById('bpm-value');
    bpmControl.innerHTML = Math.round(Tone.Transport.bpm.value);
}

var chordMouseDown = function(chord, side) {
    return function(e) {

        chord.setAttribute('dragging', side.toString());

        beginDrag(e, chord, function(e) {
            var time = clickTime(e.pageX, true);
            
            var chordTime = document.dragTarget.getAttribute('data-time');
            var event = part.at(chordTime).value;
            if (side === 'right') {
                time.sub(Tone.Time(chordTime));
                if (time.toTicks() > 0) {
                    event.duration = time.toNotation();
                }
                updateChordAt(chordTime);
            } else if (side === 'left') {
                var eventEnd = Tone.Time(chordTime).add(Tone.Time(event.duration));
                var duration = eventEnd.sub(time);
                if (duration.toTicks() > 0) {
                    event.duration = duration.toNotation();
                    part.remove(chordTime);
                    part.add(time, event);
                    document.dragTarget.setAttribute('data-time', time.toNotation());
                    updateChordAt(time.toNotation());
                }
            }
        });
    }
}

var createChord = function(time) {
    part.add({
        'time' : time, 
        'duration' : Tone.Time('16n'), 
        'chord' : new Chord('I', 3)
    });
    
    var chord = document.createElement('chord');
    chord.setAttribute('data-time', time);
    chord.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        var xOffset = e.offsetX;
        
        chord.addEventListener('mousemove', mouseMoveHandler = function(e) {
            beginDrag(e, chord, function(e) {
                var time = clickTime(e.pageX - xOffset, true);

                var chordTime = document.dragTarget.getAttribute('data-time');
                var event = part.at(chordTime).value;
                part.remove(chordTime);
                part.add(time, event);
                document.dragTarget.setAttribute('data-time', time.toNotation());
                updateChordAt(time.toNotation());
            });
            
            chord.removeEventListener('mousemove', mouseMoveHandler);
        });
    });
    chord.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        removeChord(e.currentTarget.getAttribute('data-time'));
    });
    chord.addEventListener('animationend', function(e) {
        e.target.classList.remove('playing');
    });
    
    for (var side of ['left', 'right']) {
        var dragZone = document.createElement('div');
        dragZone.classList.add('drag-zone');
        dragZone.classList.add('drag-zone-' + side);
        dragZone.addEventListener('mousedown', chordMouseDown(chord, side));
        chord.appendChild(dragZone);
    }
    
    var seventhControl = document.createElement('div');
    seventhControl.classList.add('seventh-control');
    seventhControl.classList.add('checkbox');
    chord.appendChild(seventhControl);
    
    seventhControl.innerHTML = '7th ';
    var seventhCheckbox = document.createElement('i');
    seventhCheckbox.classList.add('seventh-checkbox');
    seventhCheckbox.classList.add('fa');
    seventhCheckbox.classList.add('fa-fw');
    seventhControl.appendChild(seventhCheckbox);
    
    seventhCheckbox.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        var parentChord = e.target.closest('chord');
        var time = parentChord.getAttribute('data-time');
        var c = part.at(time).value.chord;
        c.numberOfNotes = (e.target.getAttribute('data-value') === 'true') ? 3 : 4;
        updateChordAt(time);
    });
    
    var stepGroup = document.createElement('div');
    stepGroup.classList.add('step-group');
    stepGroup.classList.add('radio-group');
    for (var j = 6; j >= 0; j--) {
        var jRoman = RomanNumerals.toRoman(j);
        var step = document.createElement('span');
        step.setAttribute('data-value', jRoman);
        step.innerHTML = jRoman;
        stepGroup.appendChild(step);
        step.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            var parentChord = e.target.closest('chord');
            var time = parentChord.getAttribute('data-time');
            var c = part.at(time).value.chord;
            c.root = e.target.getAttribute('data-value');
            updateChordAt(time);
        });
    }
    chord.appendChild(stepGroup);
    
    return chord;
}

var removeChord = function(time) {
    part.remove(time);
    
    var chordElement = document.querySelector('chord[data-time="' + time + '"]');
    chordElement.parentNode.removeChild(chordElement);
}

document.addEventListener("DOMContentLoaded", createUI);
var stopEvent = function (e) {
    e.stopPropagation();
    e.preventDefault();
}

var clickTime = function(x, quantize) {
    
    var chordSequencer = document.getElementById('chord-sequencer');
    var time = Tone.Time(Tone.Transport.loopEnd);
    var rect = chordSequencer.getBoundingClientRect();
    var style = window.getComputedStyle(chordSequencer);
    var margin = parseFloat(style['margin-left']);
    x = x - chordSequencer.clientLeft - margin - rect.left + chordSequencer.scrollLeft;
    var xRatio = x / chordSequencer.scrollWidth;
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

    target.classList.add('dragging');

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

    if (document.dragTarget.localName === 'chord') {
        updateChordAt(document.dragTarget.getAttribute('data-time'), true);
    }

    document.dragTarget.removeAttribute('dragging');
    document.dragTarget.classList.remove('dragging');

    document.removeEventListener('mousemove', document.dragCallback, true);
    document.removeEventListener('mouseup', endDrag, true);
    document.dragging = false;
    document.dragTarget = null;
    document.dragCallback = null;
}

var updateScroll = function() {

    var chordSequencer = document.getElementById('chord-sequencer');
    var scrollIndicatorLeft = chordSequencer.parentNode.getElementsByClassName('scroll-indicator-left')[0];

    var scrollLeft = chordSequencer.scrollLeft;
    var maxScroll = chordSequencer.scrollWidth - chordSequencer.clientWidth;

    if (scrollLeft > 0) {
        scrollIndicatorLeft.classList.remove('hidden');
    } else {
        scrollIndicatorLeft.classList.add('hidden');
    }

    var scrollIndicatorRight = chordSequencer.parentNode.getElementsByClassName('scroll-indicator-right')[0];
    if (scrollLeft >= maxScroll) {
        scrollIndicatorRight.classList.add('hidden');
    } else {
        scrollIndicatorRight.classList.remove('hidden');
    }
}

const counters = document.getElementsByTagName("counter");
Tone.Transport.scheduleRepeat(function(time) {
    updateTime(time);
}, "1i");
Tone.Transport.scheduleRepeat(function(time) {
    updateChordTime(time);
}, "16n");

var updateChordAt = function(time, erase) {
    var event = part.at(time).value;
    var eventStart = Tone.Time(time).toTicks();
    var eventEnd = eventStart + Tone.Time(event.duration).toTicks();

    if (erase) {
        for (e of part._events) {
            if (e.value === event) {
                continue;
            }

        var start = e.startOffset;
        var end = start + Tone.Time(e.value.duration).toTicks();

            if (((eventStart <= start) && (eventEnd > start))
                || ((eventStart > start && (eventStart < end)))) {
                removeChord(Tone.Time(start.toString() + 'i').toNotation());
            }
        }
    }

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
    var loopLength = Tone.Time(Tone.Transport.loopEnd).toTicks();
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

var updateLoop = function() {

    var backgrounds = document.getElementById('chord-background');
    while (backgrounds.firstChild) {
        backgrounds.removeChild(backgrounds.firstChild);
    }

    var loopLength = Tone.Time(Tone.Transport.loopEnd);

    var numberOf16ths = loopLength.toTicks() / Tone.Time('16n').toTicks();
    var viewInTicks = Tone.Time('1m').toTicks();
    var sixteenthInTicks = Tone.Time('16n').toTicks();
    for (var i = 0; i < numberOf16ths; i++) {
        var chordBackground = document.createElement('chord');
        chordBackground.classList.add('background');
        var startInTicks = Tone.Time('16n').mult(i).toTicks();
        chordBackground.style.left = 'calc(100% * ' + startInTicks + ' / ' + viewInTicks + ')';
        chordBackground.style.width = 'calc(100% * ' + sixteenthInTicks + ' / ' + viewInTicks + ' - 2px)';
        backgrounds.appendChild(chordBackground);
    }

    var loopControl = document.getElementById('loop-control');
    loopControl.innerHTML = parseInt(loopLength.toBarsBeatsSixteenths()) + ' bars';
}

var updateBpm = function() {
    const bpmControl = document.getElementById('bpm-value');
    bpmControl.innerHTML = parseInt(Math.round(Tone.Transport.bpm.value)) + ' bpm';
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
        
        var mouseMoveHandler = function(e) {
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
        }

        chord.addEventListener('mousemove', mouseMoveHandler);

        chord.addEventListener('mouseup', function(e) {
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

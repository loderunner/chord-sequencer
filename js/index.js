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

document.addEventListener("DOMContentLoaded", function() {    
    var main = document.getElementById('main');
    
    var chordSection = document.createElement('div');
    chordSection.id = 'chord-sequencer';
    chordSection.classList.add('chord-sequencer');
    main.appendChild(chordSection);
    
    chordSection.addEventListener('mousedown', function(e) {
        var time = clickTime(e.pageX, 'floor');
        var chord = createChord(time.toNotation());
        e.currentTarget.appendChild(chord);
        updateChordAt(time.toNotation());
        
        chordMouseDown(chord, 'right')(e);
    });
    
    chordSection.addEventListener('mousewheel', function(e) {
        var x = e.wheelDeltaX;
        
        if (x === 0) {
            return;
        }

        var scroll = e.currentTarget.scrollLeft;
        var maxScroll = e.currentTarget.scrollWidth - e.currentTarget.clientWidth;

        if ((scroll === 0 && x > 0) || (scroll === maxScroll && x < 0)) {
            e.preventDefault();
        }
    });
    
    var numberOf16ths = Tone.Time(part.loopEnd).toTicks() / Tone.Time('16n').toTicks();
    var viewInTicks = Tone.Time('1m').toTicks();
    var sixteenthInTicks = Tone.Time('16n').toTicks();
    for (var i = 0; i < numberOf16ths; i++) {
        var chordBackground = document.createElement('chord');
        chordBackground.classList.add('background');
        var startInTicks = Tone.Time('16n').mult(i).toTicks();
        chordBackground.style.left = 'calc(100% * ' + startInTicks + ' / ' + viewInTicks + ')';
        chordBackground.style.width = 'calc(100% * ' + sixteenthInTicks + ' / ' + viewInTicks + ' - 2px)';
        chordSection.appendChild(chordBackground);
    }
    
    var positionIndicator = document.createElement('i');
    positionIndicator.id = 'position-indicator';
    positionIndicator.classList.add('fa');
    positionIndicator.classList.add('fa-caret-up');
    positionIndicator.classList.add('fa-lg');
    chordSection.appendChild(positionIndicator);
    
    var tonalitySection = document.createElement('section');
    main.appendChild(tonalitySection);
    
    //create key selector
    var keySelector = document.createElement('subsection');
    tonalitySection.appendChild(keySelector);
    var title = document.createElement('h1');
    title.innerHTML = 'Key';
    keySelector.appendChild(title);
    
    var keyElements = document.createElement('div');
    keyElements.classList.add('radio-group');
    keyElements.id = 'key-selector';
    for (key of keys) {
        var el = document.createElement('span');
        el.innerHTML = key;
        el.setAttribute('data-value', key);
        keyElements.appendChild(el);
        el.addEventListener('click', function(e) {
            Tonality.key = e.target.getAttribute('data-value');
            updateKey();
        });
    }
    keySelector.appendChild(keyElements);
    updateKey();
    
    //create mode selector
    var modeSelector = document.createElement('subsection');
    tonalitySection.appendChild(modeSelector);
    var title = document.createElement('h1');
    title.innerHTML = 'Mode';
    modeSelector.appendChild(title);
    
    var modeElements = document.createElement('div');
    modeElements.id = 'mode-selector';
    modeElements.classList.add('radio-group');
    for (mode of modes) {
        var el = document.createElement('span');
        el.innerHTML = mode;
        el.setAttribute('data-value', mode);
        modeElements.appendChild(el);
        el.addEventListener('click', function(e) {
            Tonality.mode = e.target.getAttribute('data-value');
            updateMode();
        });
    }
    modeSelector.appendChild(modeElements);
    updateMode();
    
    //create transport section
    var bottomSection = document.createElement('section');
    main.appendChild(bottomSection);
    
    var transport = document.createElement('subsection');
    transport.id = 'transport';
    bottomSection.appendChild(transport);
    
    var timeControl = document.createElement('div');
    timeControl.id = 'time-control';
    transport.appendChild(timeControl);
    
    var counter = document.createElement('counter');
    counter.innerHTML = '0:0:0';
    timeControl.appendChild(counter);
    
    var playButton = document.createElement('button');
    playButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
    playButton.id = 'button-start';
    playButton.addEventListener("click", function() {
        Tone.Transport.start();
    });
    timeControl.appendChild(playButton);
    
    var stopButton = document.createElement('button');
    stopButton.innerHTML = '<i class="fa fa-stop" aria-hidden="true"></i>';
    stopButton.id = 'button-stop';
    stopButton.addEventListener("click", function() {
        Tone.Transport.stop();
        updateTime();
    });
    timeControl.appendChild(stopButton);
    
    var bpmControl = document.createElement('div');
    bpmControl.id = 'bpm-control';
    transport.appendChild(bpmControl);
    var bpmValue = document.createElement('span');
    bpmValue.id = 'bpm-value';
    bpmValue.setAttribute('data-min', 40);
    bpmValue.setAttribute('data-max', 250);
    bpmValue.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        bpmValue.setAttribute('dragOrigin', e.clientX.toString() + ',' + e.clientY.toString());
        document.addEventListener('mousemove', function(e) {
            var dragOrigin = bpmValue.getAttribute('dragOrigin');
            if (dragOrigin) {
                var bpmMin = parseInt(bpmValue.getAttribute('data-min'));
                var bpmMax = parseInt(bpmValue.getAttribute('data-max'));
                var dy = e.clientY - parseInt(dragOrigin.split(',')[1]);
                Tone.Transport.bpm.value = Math.min(bpmMax, Math.max(bpmMin, Math.round(Tone.Transport.bpm.value - dy)));
                bpmValue.setAttribute('dragOrigin', e.clientX.toString() + ',' + e.clientY.toString());
                updateBpm();
            }
        });
        return false;
    });
    document.addEventListener('mouseup', function(e) {
        bpmValue.removeAttribute('dragOrigin');
        //document.removeEventListener('mousemove');
    });
    bpmControl.appendChild(bpmValue);
    updateBpm();
    
    var bpmLabel = document.createElement('span');
    bpmLabel.innerHTML = 'BPM';
    bpmControl.appendChild(bpmLabel);
});
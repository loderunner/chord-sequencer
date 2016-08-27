var createUI = function () {
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
}
var createUI = function () {
    var main = document.getElementById('main');

    var sequencerContainer = document.createElement('div');
    sequencerContainer.id = 'sequencer-container';
    main.appendChild(sequencerContainer);

    var chordSection = document.createElement('div');
    chordSection.id = 'chord-sequencer';
    chordSection.classList.add('chord-sequencer');
    sequencerContainer.appendChild(chordSection);

    var chordBackground = document.createElement('div');
    chordBackground.id = 'chord-background';
    chordSection.appendChild(chordBackground);

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

    chordSection.addEventListener('scroll', function(e) {
        updateScroll();
    });

    var scrollIndicatorLeft = document.createElement('div');
    scrollIndicatorLeft.classList.add('scroll-indicator');
    scrollIndicatorLeft.classList.add('scroll-indicator-left');
    scrollIndicatorLeft.classList.add('hidden');
    scrollIndicatorLeft.innerHTML = '<i class="fa fa-chevron-left fa-4" aria-hidden="true"></i>';
    sequencerContainer.insertBefore(scrollIndicatorLeft, chordSection);

    var scrollIndicatorRight = document.createElement('div');
    scrollIndicatorRight.classList.add('scroll-indicator');
    scrollIndicatorRight.classList.add('scroll-indicator-right');
    scrollIndicatorRight.classList.add('hidden');
    scrollIndicatorRight.innerHTML = '<i class="fa fa-chevron-right fa-4" aria-hidden="true"></i>';
    sequencerContainer.appendChild(scrollIndicatorRight);

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

    var loopControl = document.createElement('span');
    loopControl.id = 'loop-control';
    loopControl.addEventListener('click', function(e) {
        var bars = parseInt(Tone.Time(Tone.Transport.loopEnd).toBarsBeatsSixteenths()); 
        bars *= 2;
        if (bars <= 8) {
            Tone.Transport.loopEnd = bars.toString() + 'm';
        } else {
            Tone.Transport.loopEnd = '1m';
        }
        updateLoop();
    });
    bpmControl.appendChild(loopControl);
    updateLoop();

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
    });
    document.addEventListener('mouseup', function(e) {
        bpmValue.removeAttribute('dragOrigin');
        //document.removeEventListener('mousemove');
    });
    bpmControl.appendChild(bpmValue);
    updateBpm();

    updateScroll();
}
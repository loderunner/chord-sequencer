var synth = new Tone.PolySynth(8, Tone.Synth).toMaster();

var part = new Tone.Part(function(time, event) {
    var chord = event.chord;
    synth.triggerAttackRelease(chord.notes[0] + '3', event.duration, time);
    synth.triggerAttackRelease(chord.notes.map(function(n) { return n + '4'; }), event.duration, time);
});
    
part.start('0m');
part.stop('1m');
part.loopStart = '0m';
part.loopEnd = '1m';
part.loop = true;

Tone.Transport.bpm.value = 120;
Tone.Transport.loopStart = "0m";
Tone.Transport.loopEnd = "1m";
Tone.Transport.loop = true;
const allScales = require('./all-scales.json');
const letters = 'CDEFGAB';

for (mode in allScales) {
    for (key in allScales[mode]) {
        prevNote = ''
        for (note of allScales[mode][key]) {
            if ((prevNote !== '' && note[0] !== letters[(letters.indexOf(prevNote[0]) + 1) % letters.length])
                || (prevNote[0] === 'B' && note[0] === 'C' && note[note.length-1] !== '1')) {
                console.log(key + " " + mode + " : " + prevNote + " -> " + note);
                process.exit(1);
            }
            prevNote = note;
        }
    }
}
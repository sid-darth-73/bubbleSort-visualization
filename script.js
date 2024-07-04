const n = 20;
let arr = [];

init();

let audioCtx = null;
function playNote(freq) {
    freq = Math.floor(freq);
    if(audioCtx == null) {
        audioCtx = new(
            AudioContext || 
            webkitAudioContext || 
            window.webkitAudioContext
        )();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime + dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function init() {
    for(let i = 0; i<n; i++) {
        arr[i] = Math.random();
    }
    showBars();
}
function play() {
    const copy = [...arr];
    const moves = bubbleSort(copy);
    animate(moves);
}

function animate(moves) {
    if(moves.length == 0) {
        showBars();
        return;
    }
    const move = moves.shift();
    const [i,j] = move.indices;
    if(move.type == "swap") {
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    playNote(300 + arr[i] * 900);
    playNote(300 + arr[j] * 900);
    showBars(move);
    setTimeout(function() {
        animate(moves);
    }, 50);
}

function bubbleSort(arr) {
    const moves = [];
    do{
        var swapped = false;
        for(let i = 0; i<arr.length; i++) {
            //moves.push({ indices : [i-1,i], type : "compare"}); // comment out this line to avoid rest comparisions
            if(arr[i-1] > arr[i]) {
                swapped = true;
                moves.push({indices : [i-1,i], type : "swap"});
                [arr[i-1], arr[i]] = [arr[i], arr[i-1]];
            }
        }

    } while(swapped)
    return moves;
}
function showBars(move) {
    container.innerHTML = "";
    for(let i = 0; i<arr.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = arr[i] * 100 + "%";
        bar.classList.add("bar");
        if(move && move.indices.includes(i)) {
            bar.style.backgroundColor = move.type == "swap" ? "red" : "blue";
        }
        container.appendChild(bar);
    }
}
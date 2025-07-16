let timer;
let isRunning = false;
let startTime;
let elapsedTime = 0;
let lapCount = 1;

const display = document.querySelector('.display');
const startPauseBtn = document.getElementById('startPause');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');
const lapsList = document.getElementById('laps');

function formatTime(ms) {
    let date = new Date(ms);
    let hours = date.getUTCHours().toString().padStart(2, '0');
    let minutes = date.getUTCMinutes().toString().padStart(2, '0');
    let seconds = date.getUTCSeconds().toString().padStart(2, '0');
    let milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
    
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function updateDisplay() {
    display.textContent = formatTime(elapsedTime);
}

function toggleButtons() {
    resetBtn.disabled = elapsedTime === 0 && !isRunning;
    lapBtn.disabled = !isRunning && elapsedTime === 0;
}

function startTimer() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timer = setInterval(function() {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 10);
        isRunning = true;
        startPauseBtn.textContent = 'Pause';
        startPauseBtn.setAttribute('aria-label', 'Pause stopwatch');
        toggleButtons();
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startPauseBtn.textContent = 'Resume';
        startPauseBtn.setAttribute('aria-label', 'Resume stopwatch');
        toggleButtons();
    }
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    elapsedTime = 0;
    lapCount = 1;
    updateDisplay();
    startPauseBtn.textContent = 'Start';
    startPauseBtn.setAttribute('aria-label', 'Start stopwatch');
    lapsList.innerHTML = '';
    toggleButtons();
}

function recordLap() {
    if (isRunning || elapsedTime > 0) {
        const lapTime = formatTime(elapsedTime);
        const lapItem = document.createElement('li');
        lapItem.innerHTML = `
            <span class="lap-number">Lap ${lapCount}</span>
            <span class="lap-time">${lapTime}</span>
        `;
        lapsList.prepend(lapItem);
        lapCount++;
    }
}

// Button event listeners
startPauseBtn.addEventListener('click', function() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', recordLap);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    } else if (e.code === 'KeyL') {
        e.preventDefault();
        if (!lapBtn.disabled) {
            recordLap();
        }
    } else if (e.code === 'KeyR') {
        e.preventDefault();
        if (!resetBtn.disabled) {
            resetTimer();
        }
    }
});

// Initialize button states
toggleButtons();
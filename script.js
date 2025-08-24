// Extrem lustige Sprüche für ausgebuchte Tage
const funnyQuotes = [
    "Zeit ist relativ - aber bei uns ist sie immer knapp! ⏰",
    "Unser Kalender ist voller als ein U-Bahn in der Rush Hour! 🚇",
    "Wir haben mehr Termine als ein Zahnarzt in der Adventszeit! 🦷",
    "Zeit ist bei uns wie WLAN - immer da, aber nie verfügbar! 📶",
    "Wir sind so beschäftigt, dass selbst unsere Schatten Termine haben! 👥",
    "Unser Kalender läuft heißer als ein Laptop im Sommer! 🔥",
    "Zeit ist Geld - und wir sind pleite! 💸",
    "Wir haben einen Termin für unseren Termin! 📅",
    "Unser Kalender ist wie ein Tetris-Spiel - alles ist voll! 🎮",
    "Zeit ist wie ein Witz - wenn man sie braucht, ist sie weg! 😂",
    "Wir sind so beschäftigt, dass wir Termine im Schlaf haben! 😴",
    "Unser Kalender explodiert vor Terminen! 💥",
    "Zeit ist bei uns wie ein Witz - sie vergeht im Flug! 🚁",
    "Wir haben mehr Termine als ein Bäcker am Sonntag! 🥐",
    "Unser Kalender ist wie ein Schwarzes Loch - alles verschwindet! 🕳️",
    "Zeit ist bei uns wie ein Witz - sie läuft uns davon! 🏃‍♂️",
    "Wir sind so beschäftigt, dass selbst unsere Träume Termine haben! 💭",
    "Unser Kalender ist voller als ein Bienenstock! 🐝",
    "Zeit ist bei uns wie ein Witz - sie ist immer knapp! ⚡",
    "Wir haben mehr Termine als ein DJ auf einer Hochzeit! 🎵"
];

// Verfügbare Termine (nur wenige für den Spaß)
const availableDates = [
    '2025-09-05',
    '2025-09-30',
    '2025-10-05',
    '2025-10-25',
];

// Lustige Soundeffekte (mit Web Audio API)
let audioContext;
let oscillator;

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API nicht unterstützt');
    }
}

function playFunnySound(frequency = 440, duration = 200) {
    if (!audioContext) return;
    
    try {
        oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 2, audioContext.currentTime + duration / 1000);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
        console.log('Sound konnte nicht abgespielt werden');
    }
}

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// DOM-Elemente
const calendar = document.getElementById('calendar');
const currentMonthElement = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const funnyQuoteElement = document.getElementById('funnyQuote');
const statusTextElement = document.getElementById('statusText');

// Event Listener
prevMonthBtn.addEventListener('click', () => changeMonth(-1));
nextMonthBtn.addEventListener('click', () => changeMonth(1));

// Kalender initialisieren
function initCalendar() {
    renderCalendar();
    updateFunnyQuote();
}

// Monat wechseln
function changeMonth(direction) {
    currentMonth += direction;
    
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    
    renderCalendar();
}

// Kalender rendern
function renderCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    // Ersten Tag der Woche anpassen (Montag = 0)
    const firstDayOfWeek = firstDay.getDay();
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Kalender leeren
    calendar.innerHTML = '';
    
    // Tage vor dem Monatsanfang
    for (let i = startOffset - 1; i >= 0; i--) {
        const prevDate = new Date(firstDay);
        prevDate.setDate(prevDate.getDate() - i - 1);
        addCalendarDay(prevDate, 'other-month');
    }
    
    // Tage des Monats
    for (let i = 0; i <= endDate.getDate(); i++) {
        const currentDate = new Date(firstDay);
        currentDate.setDate(firstDay.getDate() + i);
        const dateString = formatDate(currentDate);
        const isAvailable = availableDates.includes(dateString);
        const isToday = isTodayDate(currentDate);
        
        let className = isAvailable ? 'available' : 'booked';
        if (isToday) className += ' today';
        
        addCalendarDay(currentDate, className);
    }
    
    // Tage nach dem Monatsende
    const lastDayOfWeek = endDate.getDay();
    const endOffset = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
    
    for (let i = 1; i <= endOffset; i++) {
        const nextDate = new Date(endDate);
        nextDate.setDate(endDate.getDate() + i);
        addCalendarDay(nextDate, 'other-month');
    }
    
    // Monatstitel aktualisieren
    const monthNames = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Status zurücksetzen wenn Monat gewechselt wird
    statusTextElement.innerHTML = `
        <div style="text-align: center; color: #667eea; font-style: italic;">
            <p>Klicke auf einen Tag, um den Termin-Status zu sehen!</p>
        </div>
    `;
}

// Kalendertag hinzufügen
function addCalendarDay(date, className) {
    const dayElement = document.createElement('div');
    dayElement.className = `calendar-day ${className}`;
    dayElement.textContent = date.getDate();
    
    if (className !== 'other-month') {
        dayElement.addEventListener('click', () => showDayStatus(date));
    }
    
    calendar.appendChild(dayElement);
}

// Datum formatieren
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Prüfen ob es heute ist
function isTodayDate(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// Termin-Status anzeigen
function showDayStatus(date) {
    const dateString = formatDate(date);
    const isAvailable = availableDates.includes(dateString);
    
    // Datum im deutschen Format formatieren
    const formattedDate = date.toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    if (isAvailable) {
        statusTextElement.innerHTML = `
            <div style="background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 20px; border-radius: 15px; text-align: center; box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3); animation: bounce 0.6s ease-in-out;">
                <h4 style="margin: 0 0 10px 0; font-size: 1.3rem;">🎉🎊🎉 MEGA GLÜCK! 🎉🎊🎉</h4>
                <p style="margin: 0; font-size: 1.1rem; font-weight: 600;">${formattedDate}</p>
                <small style="opacity: 0.9; display: block; margin-top: 10px;">Das ist ein Wunder! Schnell buchen, bevor es weg ist! 🚀</small>
                <div style="margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">
                    🎯 Nur noch ${Math.floor(Math.random() * 5) + 1} Termine verfügbar!<br>
                    ⚡ Schnell sein lohnt sich! 
                </div>
            </div>
        `;
        
        // Mega Konfetti-Explosion für verfügbare Termine
        createMegaConfetti();
        
        // Lustigen Sound abspielen
        playFunnySound(1000, 800);
        
    } else {
        const funnyReasons = [
            "Weil wir so beliebt sind! 😎",
            "Weil Zeit bei uns Gold wert ist! 💰",
            "Weil wir Termine sammeln wie Briefmarken! 📬",
            "Weil wir so beschäftigt sind wie ein Bienenstock! 🐝",
            "Weil wir Termine haben für unsere Termine! 📅📅",
            "Weil wir so beliebt sind wie ein Eisstand im Sommer! 🍦",
            "Weil wir Termine haben wie ein DJ auf einer Hochzeit! 🎵",
            "Weil wir so beschäftigt sind wie ein Bäcker am Sonntag! 🥐"
        ];
        
        const randomReason = funnyReasons[Math.floor(Math.random() * funnyReasons.length)];
        
        statusTextElement.innerHTML = `
            <div style="background: linear-gradient(135deg, #ff9800, #f57c00); color: white; padding: 20px; border-radius: 15px; text-align: center; box-shadow: 0 8px 25px rgba(255, 152, 0, 0.3); animation: shake 0.5s ease-in-out;">
                <h4 style="margin: 0 0 10px 0; font-size: 1.3rem;">😅😅😅 AUSGEBUCHT! 😅😅😅</h4>
                <p style="margin: 0; font-size: 1.1rem; font-weight: 600;">${formattedDate}</p>
                <small style="opacity: 0.9; display: block; margin-top: 10px;">${randomReason}</small>
                <div style="margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">
                    🎭 Versuche es morgen wieder!<br>
                    🍀 Vielleicht hast du Glück!
                </div>
            </div>
        `;
        
        // Lustigen Sound abspielen
        playFunnySound(200, 300);
        
        // Lustigen Spruch anzeigen wenn ausgebucht
        setTimeout(() => {
            updateFunnyQuote();
        }, 1000);
    }
}

// Lustigen Spruch aktualisieren
function updateFunnyQuote() {
    const randomQuote = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];
    funnyQuoteElement.querySelector('p').textContent = randomQuote;
    
    // Animation hinzufügen
    funnyQuoteElement.style.animation = 'none';
    funnyQuoteElement.offsetHeight; // Trigger reflow
    funnyQuoteElement.style.animation = 'slideInUp 0.5s ease-out';
}

// Zusätzliche lustige Sprüche für spezielle Situationen
function addSpecialQuotes() {
    // Alle verfügbaren Termine sind belegt
    if (availableDates.length === 0) {
        funnyQuotes.push("Wir sind so beschäftigt, dass wir sogar Termine für Termine haben! 📅📅");
        funnyQuotes.push("Unser Kalender ist wie ein Schwarzes Loch - alles verschwindet! 🕳️");
        funnyQuotes.push("Zeit ist bei uns wie ein Witz - wenn man sie braucht, ist sie weg! 😂");
    }
}

// Lustige Konfetti-Animation für verfügbare Termine
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'];
    const emojis = ['🎉', '🎊', '✨', '🌟', '💫', '🎈', '🎁', '🍀', '🌈', '🔥'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = Math.random() * 15 + 5 + 'px';
        confetti.style.height = Math.random() * 15 + 5 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-20px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Manchmal Emojis statt farbige Quadrate
        if (Math.random() > 0.7) {
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.style.backgroundColor = 'transparent';
            confetti.style.fontSize = Math.random() * 20 + 15 + 'px';
        }
        
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
            { 
                transform: `translateY(0px) rotate(0deg) scale(1)`, 
                opacity: 1 
            },
            { 
                transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: Math.random() * 4000 + 3000,
            easing: 'cubic-bezier(.25,.46,.45,.94)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
    
    // Lustigen Sound abspielen
    playFunnySound(800, 500);
}

// Mega Konfetti-Explosion für verfügbare Termine
function createMegaConfetti() {
    createConfetti();
    setTimeout(() => createConfetti(), 200);
    setTimeout(() => createConfetti(), 400);
    setTimeout(() => createConfetti(), 600);
    
    // Lustige Nachricht anzeigen
    const megaMessage = document.createElement('div');
    megaMessage.innerHTML = '🎉🎊🎉 MEGA PARTY! 🎉🎊🎉';
    megaMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
        color: white;
        padding: 20px 40px;
        border-radius: 50px;
        font-size: 2rem;
        font-weight: bold;
        z-index: 1001;
        animation: bounce 1s infinite;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(megaMessage);
    
    setTimeout(() => {
        megaMessage.remove();
    }, 3000);
}

// Witzige Hover-Effekte für Kalendertage
function addFunnyHoverEffects() {
    const days = document.querySelectorAll('.calendar-day');
    days.forEach(day => {
        day.addEventListener('mouseenter', () => {
            if (!day.classList.contains('other-month')) {
                day.style.transform = 'scale(1.1) rotate(5deg)';
                day.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                
                // Lustigen Sound abspielen
                playFunnySound(600, 100);
            }
        });
        
        day.addEventListener('mouseleave', () => {
            day.style.transform = '';
            day.style.boxShadow = '';
        });
    });
}

// Konfetti bei verfügbaren Terminen
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('available')) {
        createMegaConfetti();
    }
});

// Initialisierung der Audio-Funktionen
document.addEventListener('DOMContentLoaded', () => {
    initCalendar();
    addSpecialQuotes();
    
    // Alle 10 Sekunden einen neuen lustigen Spruch anzeigen
    setInterval(updateFunnyQuote, 10000);
    initAudio();
    addFunnyHoverEffects();
});
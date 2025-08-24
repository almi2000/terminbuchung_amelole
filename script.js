// Lustige Sprüche für ausgebuchte Tage
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
    "Zeit ist wie ein Witz - wenn man sie braucht, ist sie weg! 😂"
];

// Verfügbare Termine (nur wenige für den Spaß)
const availableDates = [
    '2024-12-15',
    '2024-12-22',
    '2025-01-05',
    '2025-01-12',
    '2025-01-19'
];

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
    for (let date = new Date(firstDay); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateString = formatDate(date);
        const isAvailable = availableDates.includes(dateString);
        const isToday = isTodayDate(date);
        
        let className = isAvailable ? 'available' : 'booked';
        if (isToday) className += ' today';
        
        addCalendarDay(date, className);
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
    
    if (isAvailable) {
        statusTextElement.innerHTML = `
            <span style="color: #4CAF50; font-weight: 600;">🎉 WOW! Ein freier Termin am ${date.toLocaleDateString('de-DE')}!</span><br>
            <small>Das ist ein Wunder! Schnell buchen, bevor es weg ist! 🚀</small>
        `;
    } else {
        statusTextElement.innerHTML = `
            <span style="color: #f44336; font-weight: 600;">😅 Leider ausgebucht am ${date.toLocaleDateString('de-DE')}</span><br>
            <small>Wie überraschend... 🙄</small>
        `;
        
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

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    initCalendar();
    addSpecialQuotes();
    
    // Alle 10 Sekunden einen neuen lustigen Spruch anzeigen
    setInterval(updateFunnyQuote, 10000);
});

// Zusätzliche Interaktivität
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('calendar-day')) {
        // Hover-Effekt verstärken
        e.target.style.transform = 'scale(1.1)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 200);
    }
});

// Lustige Konfetti-Animation für verfügbare Termine
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
            { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(.25,.46,.45,.94)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Konfetti bei verfügbaren Terminen
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('available')) {
        createConfetti();
    }
}); 
// הגדרת השאלות והתשובות למשחק
// אתה יכול לערוך את הטקסטים כאן למטה:

const questions = [
    {
        question: "מי אוהב אותך הכי הרבה בעולם ?",
        answers: ["שכנה מקומה 6", "ההוא שמעשן וזורק בדלים", "לאפה גרין", "שרה נתניהו"],
        // 'correct' מייצג את המיקום של התשובה הנכונה בסוגריים המרובעים (מתחיל מ-0)
        // בדוגמה זו התשובה השלישית היא הנכונה, לכן רשום 2
        correct: 2
    },
    {
        question: "מי האישה הכי טובה בעולם ?",
        answers: ["זאת שתמיד מכינה אוכל של מסעדות", "זאת שתמיד דואגת לכולם בהכל", "זאת שתמיד דוחפת אותנו קדימה", "כל התשובות נכונות"],
        // כאן התשובה הרביעית היא הנכונה - המיקום שלה הוא 3 (כי הספירה מ-0)
        correct: 3 
    },
    {
        question: "מה היית רוצה לקבל כמתנה ?",
        answers: ["נוקיה", "מוטורולה", "מכשיר חדש ומגניב (לא מגלה איזה)", "סוני אריקסון"],
        correct: 2
    }
];

// משתנים לשמירת המצב הנוכחי של המשחק
let currentQuestionIndex = 0;

// יצירת אובייקט סאונד עבור הלחיצות
const clickSound = new Audio('touch.mp3');
const correctSound = new Audio('2.mp3');
const prizeSound = new Audio('3.mp3'); // מנגן במסך הסיום עצמו
const finalSecretSound = new Audio('8.mp3'); // מתנגן כשלוחצים על המתנה
const errorSound = new Audio('error.mp3');

// פונקציה להפעלת צליל (עם איפוס שיאפשר ללחוץ מהר)
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(error => console.log('Audio playback prevented by browser:', error));
}

function playCorrectSound() {
    correctSound.currentTime = 0;
    correctSound.play().catch(error => console.log('Audio playback prevented by browser:', error));
}

function playPrizeSound() {
    prizeSound.currentTime = 0;
    prizeSound.play().catch(error => console.log('Audio playback prevented by browser:', error));
}

function playFinalSecretSound() {
    finalSecretSound.currentTime = 0;
    finalSecretSound.play().catch(error => console.log('Audio playback prevented by browser:', error));
}

function playErrorSound() {
    errorSound.currentTime = 0;
    errorSound.play().catch(error => console.log('Audio playback prevented by browser:', error));
}


// תפיסת האלמנטים מה-HTML (נשתמש ב-let כדי להקצות אותם בטעינה)
let startScreen, questionScreen, endScreen, startBtn, questionText, answersContainer, progressBar, restartBtn, giftBox, prizeImage, flipImage;

// אנחנו מוודאים שכל העמוד נטען לפני שאנחנו מנסים לתפוס כפתורים ולהוסיף להם לחיצות
document.addEventListener('DOMContentLoaded', () => {
    startScreen = document.getElementById('start-screen');
    questionScreen = document.getElementById('question-screen');
    endScreen = document.getElementById('end-screen');
    startBtn = document.getElementById('start-btn');
    questionText = document.getElementById('question-text');
    answersContainer = document.getElementById('answers-container');
    progressBar = document.getElementById('progress');
    restartBtn = document.getElementById('restart-btn');
    giftBox = document.getElementById('gift-box');
    prizeImage = document.getElementById('prize-image');
    flipImage = document.getElementById('flip-image');

    // הוספת מאזינים לכפתורים רק אחרי שווידאנו שהם קיימים
    if (startBtn) startBtn.addEventListener('click', () => { playClickSound(); startGame(); });
    if (restartBtn) restartBtn.addEventListener('click', () => { playClickSound(); startGame(); });
    if (giftBox) giftBox.addEventListener('click', openGift);
});

function openGift() {
    if (giftBox.classList.contains('open')) return;
    
    // עצירת מוזיקת הסיום (במידה ועוד מתנגנת) והפעלת סאונד ההפתעה
    prizeSound.pause();
    playFinalSecretSound();
    
    giftBox.classList.remove('shake');
    giftBox.classList.add('open');
    
    // חכה שהקופסה "תיפתח" ואז תקפיץ את 2 התמונות החוצה
    setTimeout(() => {
        giftBox.style.display = 'none';
        
        // הצג את שתי התמונות (הן יעופו באנימציה לצדדים שונים)
        prizeImage.classList.add('show');
        flipImage.classList.add('show');
        
        restartBtn.classList.remove('hidden');
    }, 600);
}

function startGame() {
    currentQuestionIndex = 0;
    startScreen.classList.remove('active');
    endScreen.classList.remove('active');
    questionScreen.classList.add('active');
    
    // מציג את תמונת הרקע רק במסך השאלות
    document.body.classList.add('questions-bg');
    
    updateProgress();
    showQuestion();
}

function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    
    // יצירת הכפתורים עבור התשובות
    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.classList.add('answer-btn');
        if (index === currentQuestion.correct) {
            button.dataset.correct = "true";
        }
        button.addEventListener('click', selectAnswer);
        answersContainer.appendChild(button);
    });
}

function resetState() {
    while (answersContainer.firstChild) {
        answersContainer.removeChild(answersContainer.firstChild);
    }
}

function updateProgress() {
    // עדכון סרגל ההתקדמות למעלה
    const progressPercent = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    // רגע לפני שמנגנים את צליל הלחיצה נבדוק אם התשובה נכונה
    const isCorrect = selectedBtn.dataset.correct === "true";
    
    // הפעלת סאונד כפתור או סאונד הצלחה בהתאם
    if (isCorrect) {
        playCorrectSound();
    } else {
        playErrorSound(); // מנגן צליל שגיאה אם התשובה לא נכונה
    }
    
    if (isCorrect) {
        // צבע את התשובה בירוק
        selectedBtn.classList.add('correct');
        
        // נטרל את שאר הכפתורים כדי למנוע לחיצה כפולה
        Array.from(answersContainer.children).forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.correct === "true") {
                btn.classList.add('correct');
            }
        });
        
        // המתנה של שנייה ומעבר לשאלה הבאה
        setTimeout(() => {
            currentQuestionIndex++;
            updateProgress();
            
            if (currentQuestionIndex < questions.length) {
                showQuestion();
            } else {
                showEndScreen();
            }
        }, 1200);
    } else {
        // צבע בשגיאה באדום והוסף אפקט רעידה חביב
        selectedBtn.classList.add('wrong');
        selectedBtn.classList.add('shake');
        
        // לאחר חצי שניה נקה את הרעידה כדי שיוכל לנסות שוב
        setTimeout(() => {
            selectedBtn.classList.remove('shake');
            selectedBtn.classList.remove('wrong');
        }, 600);
    }
}

function showEndScreen() {
    questionScreen.classList.remove('active');
    endScreen.classList.add('active');
    // מעדכן שכבר סיימנו 100% מהפס התקדמות
    progressBar.style.width = '100%';
    
    // מנגן את המנגינה של המסך הסופי לפני פתיחת המתנה
    playPrizeSound();
    
    // מסיר את הרקע כדי שמסך הפרס יראה נקי כמו מסך הפתיחה
    document.body.classList.remove('questions-bg');
    
    // איפוס מצב המתנה למקרה של משחק חוזר
    giftBox.classList.remove('open');
    giftBox.classList.add('shake');
    giftBox.style.display = 'block';
    
    // הסתרת 2 התמונות
    prizeImage.classList.remove('show');
    flipImage.classList.remove('show');
    
    restartBtn.classList.add('hidden');
}

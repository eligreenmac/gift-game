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

// תפיסת האלמנטים מה-HTML (נשתמש ב-let כדי להקצות אותם בטעינה)
let startScreen, questionScreen, endScreen, startBtn, questionText, answersContainer, progressBar, restartBtn, giftBox, prizeImage;

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

    // הוספת מאזינים לכפתורים רק אחרי שווידאנו שהם קיימים
    if (startBtn) startBtn.addEventListener('click', startGame);
    if (restartBtn) restartBtn.addEventListener('click', startGame);
    if (giftBox) giftBox.addEventListener('click', openGift);
});

function openGift() {
    if (giftBox.classList.contains('open')) return;
    
    giftBox.classList.remove('shake');
    giftBox.classList.add('open');
    
    // חכה שהקופסה "תיפתח" ואז תקפיץ את התמונה החוצה
    setTimeout(() => {
        giftBox.style.display = 'none';
        prizeImage.classList.add('show');
        restartBtn.classList.remove('hidden');
    }, 600);
}

function startGame() {
    currentQuestionIndex = 0;
    startScreen.classList.remove('active');
    endScreen.classList.remove('active');
    questionScreen.classList.add('active');
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
    const isCorrect = selectedBtn.dataset.correct === "true";
    
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
    
    // איפוס מצב המתנה למקרה של משחק חוזר
    giftBox.classList.remove('open');
    giftBox.classList.add('shake');
    giftBox.style.display = 'block';
    prizeImage.classList.remove('show');
    restartBtn.classList.add('hidden');
}

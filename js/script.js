// ============================================================
// EXAMQUEST - COMPLETE PRACTICE SCRIPT
// ============================================================


// ============================================================
// 1. QUESTION DATA
// ============================================================

const questions = [

    {
        question: "What is 10 + 5?",
        options: ["10", "15", "20", "25"],
        answer: "B",
        explanation: "10 + 5 = 15",
        difficulty: "Easy"
    },

    {
        question: "What is 20 × 3?",
        options: ["40", "50", "60", "70"],
        answer: "C",
        explanation: "20 × 3 = 60",
        difficulty: "Easy"
    },

    {
        question: "What is 100 ÷ 4?",
        options: ["20", "25", "30", "35"],
        answer: "B",
        explanation: "100 ÷ 4 = 25",
        difficulty: "Medium"
    }

];


// ============================================================
// 2. EXAM STATE
// ============================================================

let currentQuestion = 0;

let answerStatus =
    new Array(questions.length).fill(null);

let selectedAnswers =
    new Array(questions.length).fill(null);

let bookmarked =
    new Array(questions.length).fill(false);

let reviewLater =
    new Array(questions.length).fill(false);


// ============================================================
// 3. TIMER
// ============================================================

const EXAM_TIME = 30 * 60;

let timeLeft = EXAM_TIME;

let timerInterval = null;

let examFinished = false;


// ============================================================
// 4. LOCAL STORAGE KEYS
// ============================================================

const BOOKMARK_KEY =
    "examquest_bookmarks";


// ============================================================
// 5. GET HTML ELEMENTS
// ============================================================

// Question area

const questionText =
    document.getElementById("question-text");

const optionsContainer =
    document.getElementById("options-container");

const questionNumber =
    document.getElementById("question-number");

const difficulty =
    document.getElementById("difficulty");

const result =
    document.getElementById("result");


// Navigation buttons

const previousBtn =
    document.getElementById("previous-btn");

const nextBtn =
    document.getElementById("next-btn");

const reviewBtn =
    document.getElementById("review-btn");

const bookmarkBtn =
    document.getElementById("bookmark-btn");


// Timer

const timer =
    document.getElementById("timer");


// Progress

const progressPercentage =
    document.getElementById("progress-percentage");

const progressCount =
    document.getElementById("progress-count");

const correctCount =
    document.getElementById("correct-count");

const incorrectCount =
    document.getElementById("incorrect-count");

const unansweredCount =
    document.getElementById("unanswered-count");


// Question Navigator

const questionNavigator =
    document.getElementById("question-navigator");


// Final Results

const resultsScreen =
    document.getElementById("results-screen");

const finalPercentage =
    document.getElementById("final-percentage");

const finalTotal =
    document.getElementById("final-total");

const finalCorrect =
    document.getElementById("final-correct");

const finalIncorrect =
    document.getElementById("final-incorrect");

const finalUnanswered =
    document.getElementById("final-unanswered");


// Result buttons

const restartBtn =
    document.getElementById("restart-btn");

const dashboardBtn =
    document.getElementById("dashboard-btn");


// ============================================================
// 6. LOAD BOOKMARKS
// ============================================================

function loadBookmarks() {

    try {

        const saved =
            localStorage.getItem(BOOKMARK_KEY);

        if (!saved) {

            return;

        }

        const savedBookmarks =
            JSON.parse(saved);

        if (!Array.isArray(savedBookmarks)) {

            return;

        }

        savedBookmarks.forEach(
            function(index) {

                if (
                    index >= 0 &&
                    index < questions.length
                ) {

                    bookmarked[index] = true;

                }

            }
        );

    }

    catch (error) {

        console.error(
            "Could not load bookmarks:",
            error
        );

    }

}


// ============================================================
// 7. SAVE BOOKMARKS
// ============================================================

function saveBookmarks() {

    const bookmarkIndexes = [];

    bookmarked.forEach(
        function(value, index) {

            if (value) {

                bookmarkIndexes.push(index);

            }

        }
    );

    localStorage.setItem(
        BOOKMARK_KEY,
        JSON.stringify(bookmarkIndexes)
    );

}


// ============================================================
// 8. LOAD QUESTION
// ============================================================

function loadQuestion() {

    if (examFinished) {

        return;

    }


    const question =
        questions[currentQuestion];


    // --------------------------------------------------------
    // QUESTION NUMBER
    // --------------------------------------------------------

    if (questionNumber) {

        questionNumber.textContent =
            currentQuestion + 1;

    }


    // --------------------------------------------------------
    // QUESTION TEXT
    // --------------------------------------------------------

    if (questionText) {

        questionText.textContent =
            `${currentQuestion + 1}. ${question.question}`;

    }


    // --------------------------------------------------------
    // DIFFICULTY
    // --------------------------------------------------------

    if (difficulty) {

        difficulty.textContent =
            question.difficulty;

    }


    // --------------------------------------------------------
    // CLEAR OPTIONS
    // --------------------------------------------------------

    if (optionsContainer) {

        optionsContainer.innerHTML = "";

    }


    // --------------------------------------------------------
    // CLEAR RESULT
    // --------------------------------------------------------

    if (result) {

        result.innerHTML = "";

    }


    // --------------------------------------------------------
    // CREATE OPTIONS
    // --------------------------------------------------------

    question.options.forEach(
        function(option, index) {

            const letter =
                String.fromCharCode(65 + index);


            const label =
                document.createElement("label");


            label.className =
                "option";


            label.innerHTML = `

                <input
                    type="radio"
                    name="answer"
                    value="${letter}"
                >

                <span class="option-letter">
                    ${letter}.
                </span>

                <span>
                    ${option}
                </span>

            `;


            optionsContainer.appendChild(label);


            const radio =
                label.querySelector("input");


            // Restore previous selection

            if (
                selectedAnswers[currentQuestion] ===
                letter
            ) {

                radio.checked = true;

            }


            // Answer event

            radio.addEventListener(
                "change",
                function() {

                    selectAnswer(
                        this.value
                    );

                }
            );

        }
    );


    // --------------------------------------------------------
    // RESTORE ANSWER RESULT
    // --------------------------------------------------------

    if (
        selectedAnswers[currentQuestion] !==
        null
    ) {

        showAnswerResult(
            selectedAnswers[currentQuestion]
        );

        styleOptions();

    }


    // --------------------------------------------------------
    // PREVIOUS BUTTON
    // --------------------------------------------------------

    if (previousBtn) {

        previousBtn.disabled =
            currentQuestion === 0;

    }


    // --------------------------------------------------------
    // NEXT BUTTON
    // --------------------------------------------------------

    if (nextBtn) {

        if (
            currentQuestion ===
            questions.length - 1
        ) {

            nextBtn.textContent =
                "Finish";

        }

        else {

            nextBtn.textContent =
                "Next →";

        }

    }


    // --------------------------------------------------------
    // UPDATE UI
    // --------------------------------------------------------

    updateBookmarkButton();

    updateReviewButton();

    updateProgress();

    createQuestionNavigator();

}


// ============================================================
// 9. SELECT ANSWER
// ============================================================

function selectAnswer(selectedAnswer) {

    if (examFinished) {

        return;

    }


    const question =
        questions[currentQuestion];


    // Save selected answer

    selectedAnswers[currentQuestion] =
        selectedAnswer;


    // Check answer

    if (
        selectedAnswer ===
        question.answer
    ) {

        answerStatus[currentQuestion] =
            "correct";

    }

    else {

        answerStatus[currentQuestion] =
            "wrong";

    }


    // Show result

    showAnswerResult(
        selectedAnswer
    );


    // Style options

    styleOptions();


    // Update progress

    updateProgress();


    // Update navigator

    createQuestionNavigator();

}


// ============================================================
// 10. SHOW ANSWER RESULT
// ============================================================

function showAnswerResult(selectedAnswer) {

    const question =
        questions[currentQuestion];


    if (!result) {

        return;

    }


    // --------------------------------------------------------
    // CORRECT
    // --------------------------------------------------------

    if (
        selectedAnswer ===
        question.answer
    ) {

        result.innerHTML = `

            <div class="correct-result">

                <h3>
                    ✅ Correct! Well done 🎉
                </h3>

                <p>
                    You selected the right answer.
                </p>

            </div>

            <div class="explanation">

                <h3>
                    💡 Explanation
                </h3>

                <p>
                    ${question.explanation}
                </p>

            </div>

        `;

    }


    // --------------------------------------------------------
    // INCORRECT
    // --------------------------------------------------------

    else {

        const correctIndex =
            question.answer.charCodeAt(0) - 65;


        const correctOption =
            question.options[correctIndex];


        result.innerHTML = `

            <div class="wrong-result">

                <h3>
                    ❌ Incorrect
                </h3>

                <p>

                    Correct answer:

                    <strong>
                        ${question.answer}.
                        ${correctOption}
                    </strong>

                </p>

            </div>

            <div class="explanation">

                <h3>
                    💡 Explanation
                </h3>

                <p>
                    ${question.explanation}
                </p>

            </div>

        `;

    }

}


// ============================================================
// 11. STYLE OPTIONS
// ============================================================

function styleOptions() {

    const question =
        questions[currentQuestion];


    const selected =
        selectedAnswers[currentQuestion];


    const optionLabels =
        document.querySelectorAll(".option");


    optionLabels.forEach(
        function(label, index) {

            const letter =
                String.fromCharCode(
                    65 + index
                );


            label.classList.remove(
                "selected",
                "correct",
                "incorrect"
            );


            // Selected

            if (
                letter === selected
            ) {

                label.classList.add(
                    "selected"
                );

            }


            // Correct

            if (
                selected !== null &&
                letter === question.answer
            ) {

                label.classList.add(
                    "correct"
                );

            }


            // Wrong

            if (
                selected !== null &&
                letter === selected &&
                selected !== question.answer
            ) {

                label.classList.add(
                    "incorrect"
                );

            }

        }
    );

}


// ============================================================
// 12. NEXT BUTTON
// ============================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function() {

            if (examFinished) {

                return;

            }


            // Go next

            if (
                currentQuestion <
                questions.length - 1
            ) {

                currentQuestion++;

                loadQuestion();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }


            // Finish

            else {

                finishExam();

            }

        }
    );

}


// ============================================================
// 13. PREVIOUS BUTTON
// ============================================================

if (previousBtn) {

    previousBtn.addEventListener(
        "click",
        function() {

            if (examFinished) {

                return;

            }


            if (
                currentQuestion > 0
            ) {

                currentQuestion--;

                loadQuestion();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );

}


// ============================================================
// 14. REVIEW LATER
// ============================================================

if (reviewBtn) {

    reviewBtn.addEventListener(
        "click",
        function() {

            if (examFinished) {

                return;

            }


            reviewLater[currentQuestion] =
                !reviewLater[currentQuestion];


            updateReviewButton();

            createQuestionNavigator();

        }
    );

}


// ============================================================
// 15. UPDATE REVIEW BUTTON
// ============================================================

function updateReviewButton() {

    if (!reviewBtn) {

        return;

    }


    if (
        reviewLater[currentQuestion]
    ) {

        reviewBtn.textContent =
            "🔖 Review Marked";

        reviewBtn.classList.add(
            "active"
        );

    }

    else {

        reviewBtn.textContent =
            "🔖 Review Later";

        reviewBtn.classList.remove(
            "active"
        );

    }

}


// ============================================================
// 16. BOOKMARK BUTTON
// ============================================================

if (bookmarkBtn) {

    bookmarkBtn.addEventListener(
        "click",
        function() {

            if (examFinished) {

                return;

            }


            bookmarked[currentQuestion] =
                !bookmarked[currentQuestion];


            saveBookmarks();

            updateBookmarkButton();

        }
    );

}


// ============================================================
// 17. UPDATE BOOKMARK BUTTON
// ============================================================

function updateBookmarkButton() {

    if (!bookmarkBtn) {

        return;

    }


    if (
        bookmarked[currentQuestion]
    ) {

        bookmarkBtn.innerHTML =
            "🔖 Bookmarked";

        bookmarkBtn.classList.add(
            "bookmarked"
        );

    }

    else {

        bookmarkBtn.innerHTML =
            "🔖 Bookmark";

        bookmarkBtn.classList.remove(
            "bookmarked"
        );

    }

}


// ============================================================
// 18. QUESTION NAVIGATOR
// ============================================================

function createQuestionNavigator() {

    if (!questionNavigator) {

        return;

    }


    questionNavigator.innerHTML = "";


    questions.forEach(
        function(question, index) {

            const button =
                document.createElement("button");


            button.type =
                "button";


            button.className =
                "question-number";


            button.textContent =
                index + 1;


            // ------------------------------------------------
            // CURRENT
            // ------------------------------------------------

            if (
                index === currentQuestion
            ) {

                button.classList.add(
                    "current"
                );

            }


            // ------------------------------------------------
            // CORRECT
            // ------------------------------------------------

            else if (
                answerStatus[index] ===
                "correct"
            ) {

                button.classList.add(
                    "correct"
                );

            }


            // ------------------------------------------------
            // WRONG
            // ------------------------------------------------

            else if (
                answerStatus[index] ===
                "wrong"
            ) {

                button.classList.add(
                    "wrong"
                );

            }


            // ------------------------------------------------
            // UNANSWERED
            // ------------------------------------------------

            else {

                button.classList.add(
                    "unanswered"
                );

            }


            // ------------------------------------------------
            // REVIEW
            // ------------------------------------------------

            if (
                reviewLater[index]
            ) {

                button.classList.add(
                    "review"
                );

            }


            // ------------------------------------------------
            // BOOKMARK
            // ------------------------------------------------

            if (
                bookmarked[index]
            ) {

                button.classList.add(
                    "bookmarked"
                );

            }


            // ------------------------------------------------
            // CLICK
            // ------------------------------------------------

            button.addEventListener(
                "click",
                function() {

                    if (examFinished) {

                        return;

                    }


                    currentQuestion =
                        index;


                    loadQuestion();


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }
            );


            questionNavigator.appendChild(
                button
            );

        }
    );

}


// ============================================================
// 19. UPDATE PROGRESS
// ============================================================

function updateProgress() {

    let answered = 0;

    let correct = 0;

    let incorrect = 0;

    let unanswered = 0;


    answerStatus.forEach(
        function(status) {

            if (status === null) {

                unanswered++;

            }

            else {

                answered++;

            }


            if (
                status === "correct"
            ) {

                correct++;

            }


            if (
                status === "wrong"
            ) {

                incorrect++;

            }

        }
    );


    // --------------------------------------------------------
    // PERCENTAGE
    // --------------------------------------------------------

    const percentage =
        Math.round(
            (answered / questions.length) *
            100
        );


    // --------------------------------------------------------
    // PROGRESS PERCENTAGE
    // --------------------------------------------------------

    if (progressPercentage) {

        progressPercentage.textContent =
            `${percentage}%`;

    }


    // --------------------------------------------------------
    // PROGRESS COUNT
    // --------------------------------------------------------

    if (progressCount) {

        progressCount.textContent =
            `${answered} of ${questions.length} Questions`;

    }


    // --------------------------------------------------------
    // CORRECT
    // --------------------------------------------------------

    if (correctCount) {

        correctCount.textContent =
            correct;

    }


    // --------------------------------------------------------
    // INCORRECT
    // --------------------------------------------------------

    if (incorrectCount) {

        incorrectCount.textContent =
            incorrect;

    }


    // --------------------------------------------------------
    // UNANSWERED
    // --------------------------------------------------------

    if (unansweredCount) {

        unansweredCount.textContent =
            unanswered;

    }

}


// ============================================================
// 20. START TIMER
// ============================================================

function startTimer() {

    stopTimer();


    updateTimer();


    timerInterval =
        setInterval(
            function() {

                if (examFinished) {

                    return;

                }


                if (timeLeft > 0) {

                    timeLeft--;

                    updateTimer();

                }

                else {

                    stopTimer();

                    finishExam();

                }

            },
            1000
        );

}


// ============================================================
// 21. STOP TIMER
// ============================================================

function stopTimer() {

    if (
        timerInterval !== null
    ) {

        clearInterval(
            timerInterval
        );

        timerInterval = null;

    }

}


// ============================================================
// 22. UPDATE TIMER
// ============================================================

function updateTimer() {

    if (!timer) {

        return;

    }


    const minutes =
        Math.floor(
            timeLeft / 60
        );


    const seconds =
        timeLeft % 60;


    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    // Last minute warning

    if (timeLeft <= 60) {

        timer.classList.add(
            "timer-danger"
        );

    }

    else {

        timer.classList.remove(
            "timer-danger"
        );

    }

}


// ============================================================
// 23. FINISH EXAM
// ============================================================

function finishExam() {

    if (examFinished) {

        return;

    }


    examFinished = true;


    stopTimer();


    // --------------------------------------------------------
    // CALCULATE RESULT
    // --------------------------------------------------------

    const total =
        questions.length;


    const correct =
        answerStatus.filter(
            function(status) {

                return status === "correct";

            }
        ).length;


    const incorrect =
        answerStatus.filter(
            function(status) {

                return status === "wrong";

            }
        ).length;


    const unanswered =
        total -
        correct -
        incorrect;


    const percentage =
        Math.round(
            (correct / total) * 100
        );


    // --------------------------------------------------------
    // UPDATE FINAL RESULT
    // --------------------------------------------------------

    if (finalPercentage) {

        finalPercentage.textContent =
            `${percentage}%`;

    }


    if (finalTotal) {

        finalTotal.textContent =
            total;

    }


    if (finalCorrect) {

        finalCorrect.textContent =
            correct;

    }


    if (finalIncorrect) {

        finalIncorrect.textContent =
            incorrect;

    }


    if (finalUnanswered) {

        finalUnanswered.textContent =
            unanswered;

    }


    // --------------------------------------------------------
    // HIDE EXAM AREA
    // --------------------------------------------------------

    const practiceArea =
        document.getElementById(
            "practice-area"
        );


    const rightSidebar =
        document.querySelector(
            ".right-sidebar"
        );


    if (practiceArea) {

        practiceArea.style.display =
            "none";

    }


    if (rightSidebar) {

        rightSidebar.style.display =
            "none";

    }


    // --------------------------------------------------------
    // SHOW RESULTS SCREEN
    // --------------------------------------------------------

    if (resultsScreen) {

        resultsScreen.classList.remove(
            "hidden"
        );

        resultsScreen.style.display =
            "block";

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ============================================================
// 24. RESTART EXAM
// ============================================================

if (restartBtn) {

    restartBtn.addEventListener(
        "click",
        function() {

            restartExam();

        }
    );

}


function restartExam() {

    // --------------------------------------------------------
    // STOP OLD TIMER
    // --------------------------------------------------------

    stopTimer();


    // --------------------------------------------------------
    // RESET QUESTION
    // --------------------------------------------------------

    currentQuestion = 0;


    // --------------------------------------------------------
    // RESET ANSWERS
    // --------------------------------------------------------

    answerStatus =
        new Array(
            questions.length
        ).fill(null);


    selectedAnswers =
        new Array(
            questions.length
        ).fill(null);


    // --------------------------------------------------------
    // RESET REVIEW
    // --------------------------------------------------------

    reviewLater =
        new Array(
            questions.length
        ).fill(false);


    // --------------------------------------------------------
    // RESET TIMER
    // --------------------------------------------------------

    timeLeft =
        EXAM_TIME;


    // --------------------------------------------------------
    // RESET FINISH STATE
    // --------------------------------------------------------

    examFinished = false;


    // --------------------------------------------------------
    // SHOW PRACTICE AREA
    // --------------------------------------------------------

    const practiceArea =
        document.getElementById(
            "practice-area"
        );


    const rightSidebar =
        document.querySelector(
            ".right-sidebar"
        );


    if (practiceArea) {

        practiceArea.style.display =
            "";

    }


    if (rightSidebar) {

        rightSidebar.style.display =
            "";

    }


    // --------------------------------------------------------
    // HIDE RESULTS
    // --------------------------------------------------------

    if (resultsScreen) {

        resultsScreen.classList.add(
            "hidden"
        );

        resultsScreen.style.display =
            "none";

    }


    // --------------------------------------------------------
    // RESET RESULT
    // --------------------------------------------------------

    if (result) {

        result.innerHTML = "";

    }


    // --------------------------------------------------------
    // LOAD QUESTION 1
    // --------------------------------------------------------

    loadQuestion();


    // --------------------------------------------------------
    // RESET PROGRESS
    // --------------------------------------------------------

    updateProgress();


    // --------------------------------------------------------
    // RESET NAVIGATOR
    // --------------------------------------------------------

    createQuestionNavigator();


    // --------------------------------------------------------
    // START TIMER AGAIN
    // --------------------------------------------------------

    startTimer();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ============================================================
// 25. BACK TO DASHBOARD
// ============================================================

if (dashboardBtn) {

    dashboardBtn.addEventListener(
        "click",
        function() {

            window.location.href =
                "index.html";

        }
    );

}


// ============================================================
// 26. INITIALIZE EXAM
// ============================================================

function initializeExam() {

    loadBookmarks();

    currentQuestion = 0;

    answerStatus =
        new Array(
            questions.length
        ).fill(null);

    selectedAnswers =
        new Array(
            questions.length
        ).fill(null);

    reviewLater =
        new Array(
            questions.length
        ).fill(false);

    timeLeft =
        EXAM_TIME;

    examFinished = false;


    // Hide results initially

    if (resultsScreen) {

        resultsScreen.classList.add(
            "hidden"
        );

        resultsScreen.style.display =
            "none";

    }


    // Load first question

    loadQuestion();


    // Start timer

    startTimer();

}


// ============================================================
// 27. START APPLICATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        initializeExam();

    }
);
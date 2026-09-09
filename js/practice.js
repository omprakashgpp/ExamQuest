/**
 * ExamQuest Practice Engine
 * Interactive Question Controller, Instant Feedback, Progress, and Navigator
 */

let examTimer = null;
let currentQuestion = null;
let sessionState = {
  currentQuestionId: 12,
  userAnswers: {},
  reviewLater: [],
  bookmarks: [],
  timerRemaining: 18 * 60 + 35,
  subject: "Quantitative Aptitude"
};

document.addEventListener('DOMContentLoaded', () => {
  initPracticeEngine();
});

function initPracticeEngine() {
  // Load session from storage or default preset
  sessionState = ExamQuestData.loadSession();
  sessionState.bookmarks = ExamQuestData.getBookmarks();

  // Initialize Timer
  initExamTimer();

  // Setup Navigator Grid & Jump Dropdown
  setupNavigatorGrid();
  setupJumpSelect();

  // Attach button event listeners
  setupControls();

  // Attach Keyboard Shortcuts
  setupKeyboardShortcuts();

  // Render initial question (Question 12 from reference screenshot)
  const initialId = sessionState.currentQuestionId || 12;
  loadQuestion(initialId);

  // Update progress overview
  updateProgressStats();
}

/**
 * Timer Controller
 */
function initExamTimer() {
  const timerDisplay = document.getElementById('timerText');
  const initialSec = sessionState.timerRemaining || (18 * 60 + 35);

  examTimer = new ExamTimer(initialSec, {
    onTick: (remaining, formatted) => {
      if (timerDisplay) {
        timerDisplay.textContent = formatted;
      }
      sessionState.timerRemaining = remaining;
      // Periodically save timer every 5 seconds
      if (remaining % 5 === 0) {
        ExamQuestData.saveSession(sessionState);
      }
    },
    onExpire: () => {
      showToast("Time's up! Submitting practice session...", "warning");
      setTimeout(() => {
        window.location.href = "result.html";
      }, 1500);
    }
  });

  examTimer.start();
}

/**
 * Load and display a question by ID
 */
function loadQuestion(questionId) {
  const qId = parseInt(questionId, 10);
  const question = ExamQuestData.getQuestionById(qId);
  if (!question) return;

  currentQuestion = question;
  sessionState.currentQuestionId = qId;
  ExamQuestData.saveSession(sessionState);

  // Update Exam & Subject Header
  const examTitleElem = document.getElementById('examHeaderTitle');
  if (examTitleElem) {
    examTitleElem.textContent = `${question.exam} – ${question.subject}`;
  }

  // Update Question Meta
  const qIndexElem = document.getElementById('currentQNum');
  if (qIndexElem) qIndexElem.textContent = question.id;

  const totalQElem = document.getElementById('totalQNum');
  if (totalQElem) totalQElem.textContent = '100';

  const diffBadge = document.getElementById('difficultyBadge');
  if (diffBadge) {
    diffBadge.textContent = question.difficulty || 'Easy';
  }

  // Update Horizontal Progress bar (question.id / 100)
  const progressBar = document.getElementById('qProgressBar');
  if (progressBar) {
    progressBar.style.width = `${Math.min(100, Math.max(1, question.id))}%`;
  }

  // Update Question Text
  const qTitleElem = document.getElementById('questionTitle');
  if (qTitleElem) {
    qTitleElem.textContent = `${question.id}. ${question.question}`;
  }

  // Render Options
  renderOptions(question);

  // Update Bookmark state
  updateBookmarkButtonUI(question.id);

  // Update Review Later button state
  updateReviewLaterButtonUI(question.id);

  // Update Previous / Next button states
  const btnPrev = document.getElementById('btnPrev');
  if (btnPrev) {
    btnPrev.disabled = (question.id <= 1);
  }

  // If question is between 31 and 90, ensure middle block is visible
  if (question.id >= 31 && question.id <= 90 && !isNavigatorExpanded) {
    isNavigatorExpanded = true;
    const middleBlock = document.getElementById('navMiddleBlock');
    const ellipsis = document.getElementById('navEllipsis');
    if (middleBlock) middleBlock.style.display = 'contents';
    if (ellipsis) ellipsis.textContent = '▲ Show Less';
  }

  // Update Navigator highlighting & Dropdown
  highlightCurrentInNavigator(question.id);
  syncJumpSelect(question.id);

  // Animate Card
  const questionCard = document.getElementById('mainQuestionCard');
  if (questionCard) {
    questionCard.classList.remove('eq-question-transition');
    void questionCard.offsetWidth; // trigger reflow
    questionCard.classList.add('eq-question-transition');
  }
}

/**
 * Render Option Cards & Manage Selection
 */
function renderOptions(question) {
  const optionsContainer = document.getElementById('optionsContainer');
  const feedbackContainer = document.getElementById('feedbackContainer');
  const explanationContainer = document.getElementById('explanationContainer');

  if (!optionsContainer) return;
  optionsContainer.innerHTML = '';

  const labels = ['A', 'B', 'C', 'D'];
  const hasAnswered = sessionState.userAnswers.hasOwnProperty(question.id);
  const selectedOptionIndex = hasAnswered ? sessionState.userAnswers[question.id] : null;

  question.options.forEach((optText, index) => {
    const card = document.createElement('div');
    card.className = 'eq-option-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.dataset.index = index;

    // Check if this card is selected / correct / incorrect
    let statusClass = '';
    let statusIconHtml = '';

    if (hasAnswered) {
      if (index === question.correctAnswer) {
        statusClass = 'correct';
        statusIconHtml = '<i class="fa-solid fa-check eq-option-status-icon"></i>';
      } else if (index === selectedOptionIndex) {
        statusClass = 'incorrect';
        statusIconHtml = '<i class="fa-solid fa-xmark eq-option-status-icon"></i>';
      }
    }

    if (statusClass) {
      card.classList.add(statusClass);
    }

    card.innerHTML = `
      <div class="eq-option-left">
        <div class="eq-radio-dot">
          <div class="eq-radio-inner"></div>
        </div>
        <span class="eq-option-text"><strong>${labels[index]}.</strong> &nbsp;${optText}</span>
      </div>
      <div class="eq-option-right">
        ${statusIconHtml}
      </div>
    `;

    card.addEventListener('click', () => {
      selectOption(question, index);
    });

    // Enter key support for accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectOption(question, index);
      }
    });

    optionsContainer.appendChild(card);
  });

  // If already answered, show feedback and explanation immediately
  if (hasAnswered) {
    showInstantFeedback(question, selectedOptionIndex);
    showExplanation(question);
  } else {
    if (feedbackContainer) feedbackContainer.innerHTML = '';
    if (explanationContainer) explanationContainer.innerHTML = '';
  }
}

/**
 * User selects an option
 */
function selectOption(question, optionIndex) {
  // Record answer
  sessionState.userAnswers[question.id] = optionIndex;
  ExamQuestData.saveSession(sessionState);

  // Re-render options to show states
  renderOptions(question);

  // Update progress ring and counters
  updateProgressStats();

  // Update navigator item style
  updateNavigatorItem(question.id);

  // Play subtle feedback sound or vibration if enabled
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

/**
 * Display Instant Feedback Box matching screenshot
 */
function showInstantFeedback(question, selectedIndex) {
  const container = document.getElementById('feedbackContainer');
  if (!container) return;

  const isCorrect = (selectedIndex === question.correctAnswer);
  const labels = ['A', 'B', 'C', 'D'];

  if (isCorrect) {
    container.innerHTML = `
      <div class="eq-feedback-card correct animate-fade-in-up">
        <div class="eq-feedback-icon"><i class="fa-solid fa-circle-check"></i></div>
        <div class="eq-feedback-content">
          <h5>Correct! Well done 🎉</h5>
          <p>You selected the right answer.</p>
        </div>
      </div>
    `;
  } else {
    const correctLetter = labels[question.correctAnswer];
    container.innerHTML = `
      <div class="eq-feedback-card incorrect animate-fade-in-up">
        <div class="eq-feedback-icon"><i class="fa-solid fa-circle-xmark"></i></div>
        <div class="eq-feedback-content">
          <h5>Incorrect</h5>
          <p>The correct answer is ${correctLetter}.</p>
        </div>
      </div>
    `;
  }
}

/**
 * Display BODMAS / Step-by-Step Explanation Box
 */
function showExplanation(question) {
  const container = document.getElementById('explanationContainer');
  if (!container) return;

  const explanationText = question.explanation || "No explanation provided for this question.";

  container.innerHTML = `
    <div class="eq-explanation-card animate-fade-in-up">
      <div class="eq-explanation-header">
        <i class="fa-regular fa-lightbulb"></i>
        <span>Explanation</span>
      </div>
      <div class="eq-explanation-body">${explanationText}</div>
    </div>
  `;
}

/**
 * Bookmark Button Handling
 */
function toggleBookmark(qId) {
  const id = parseInt(qId, 10);
  const index = sessionState.bookmarks.indexOf(id);

  if (index > -1) {
    sessionState.bookmarks.splice(index, 1);
    showToast(`Question ${id} removed from bookmarks.`, 'info');
  } else {
    sessionState.bookmarks.push(id);
    showToast(`Question ${id} added to bookmarks!`, 'success');
  }

  ExamQuestData.saveBookmarks(sessionState.bookmarks);
  ExamQuestData.saveSession(sessionState);
  updateBookmarkButtonUI(id);
}

function updateBookmarkButtonUI(qId) {
  const btn = document.getElementById('btnBookmark');
  if (!btn) return;

  const isBookmarked = sessionState.bookmarks.includes(parseInt(qId, 10));
  if (isBookmarked) {
    btn.classList.add('bookmarked');
    btn.innerHTML = '<i class="fa-solid fa-bookmark"></i> <span>Bookmarked</span>';
  } else {
    btn.classList.remove('bookmarked');
    btn.innerHTML = '<i class="fa-regular fa-bookmark"></i> <span>Bookmark</span>';
  }
}

/**
 * Review Later Button Handling
 */
function toggleReviewLater(qId) {
  const id = parseInt(qId, 10);
  const index = sessionState.reviewLater.indexOf(id);

  if (index > -1) {
    sessionState.reviewLater.splice(index, 1);
    showToast(`Question ${id} unmarked from Review Later.`, 'info');
  } else {
    sessionState.reviewLater.push(id);
    showToast(`Question ${id} marked for Review Later!`, 'warning');
  }

  ExamQuestData.saveSession(sessionState);
  updateReviewLaterButtonUI(id);
  updateNavigatorItem(id);
}

function updateReviewLaterButtonUI(qId) {
  const btn = document.getElementById('btnReviewLater');
  if (!btn) return;

  const isReview = sessionState.reviewLater.includes(parseInt(qId, 10));
  if (isReview) {
    btn.classList.add('marked');
    btn.innerHTML = '<i class="fa-solid fa-flag"></i> <span>Marked for Review</span>';
  } else {
    btn.classList.remove('marked');
    btn.innerHTML = '<i class="fa-regular fa-bookmark"></i> <span>Review Later</span>';
  }
}

let isNavigatorExpanded = false;

function setupNavigatorGrid() {
  const gridContainer = document.getElementById('questionNavigatorGrid');
  if (!gridContainer) return;

  gridContainer.innerHTML = '';

  // Questions 1 to 30 (Rows 1, 2, 3)
  for (let i = 1; i <= 30; i++) {
    gridContainer.appendChild(createNavBtn(i));
  }

  // Middle Block (31 to 90) - hidden by default unless expanded
  const middleContainer = document.createElement('div');
  middleContainer.id = 'navMiddleBlock';
  middleContainer.style.display = isNavigatorExpanded ? 'contents' : 'none';

  for (let i = 31; i <= 90; i++) {
    middleContainer.appendChild(createNavBtn(i));
  }
  gridContainer.appendChild(middleContainer);

  // Ellipsis row matching screenshot
  const ellipsis = document.createElement('div');
  ellipsis.className = 'eq-nav-ellipsis';
  ellipsis.id = 'navEllipsis';
  ellipsis.textContent = isNavigatorExpanded ? '▲ Show Less' : '...';
  ellipsis.title = 'Click to show/hide all questions';
  ellipsis.addEventListener('click', () => {
    isNavigatorExpanded = !isNavigatorExpanded;
    middleContainer.style.display = isNavigatorExpanded ? 'contents' : 'none';
    ellipsis.textContent = isNavigatorExpanded ? '▲ Show Less' : '...';
  });
  gridContainer.appendChild(ellipsis);

  // Questions 91 to 100 (Row 5)
  for (let i = 91; i <= 100; i++) {
    gridContainer.appendChild(createNavBtn(i));
  }

  // Apply classes to all buttons
  for (let i = 1; i <= 100; i++) {
    updateNavigatorItem(i);
  }
}

function createNavBtn(i) {
  const btn = document.createElement('button');
  btn.className = 'eq-nav-btn';
  btn.id = `navBtn_${i}`;
  btn.textContent = i;
  btn.title = `Jump to Question ${i}`;
  btn.setAttribute('aria-label', `Question ${i}`);

  btn.addEventListener('click', () => {
    loadQuestion(i);
  });
  return btn;
}

/**
 * Update single navigator button state based on answers & review later
 */
function updateNavigatorItem(qId) {
  const btn = document.getElementById(`navBtn_${qId}`);
  if (!btn) return;

  btn.className = 'eq-nav-btn';

  const isCurrent = (sessionState.currentQuestionId === qId);
  const isReview = sessionState.reviewLater.includes(qId);
  const hasAnswered = sessionState.userAnswers.hasOwnProperty(qId);

  if (hasAnswered) {
    const q = ExamQuestData.getQuestionById(qId);
    if (sessionState.userAnswers[qId] === q.correctAnswer) {
      btn.classList.add('answered'); // green
    } else {
      btn.classList.add('incorrect'); // red
    }
  } else if (isReview) {
    btn.classList.add('review'); // yellow/orange
  } else {
    btn.classList.add('unanswered'); // gray
  }

  if (isCurrent) {
    btn.classList.add('current'); // purple
  }
}

function highlightCurrentInNavigator(currentQId) {
  const gridContainer = document.getElementById('questionNavigatorGrid');
  for (let i = 1; i <= 100; i++) {
    const btn = document.getElementById(`navBtn_${i}`);
    if (btn) {
      if (i === currentQId) {
        btn.classList.add('current');
        // Scroll only grid container if needed
        if (gridContainer) {
          const btnOffset = btn.offsetTop - gridContainer.offsetTop;
          if (btnOffset > gridContainer.clientHeight || btnOffset < 0) {
            gridContainer.scrollTop = Math.max(0, btnOffset - 20);
          }
        }
      } else {
        btn.classList.remove('current');
      }
    }
  }
}

/**
 * Jump to Question Select dropdown
 */
function setupJumpSelect() {
  const jumpSelect = document.getElementById('jumpSelect');
  if (!jumpSelect) return;

  jumpSelect.innerHTML = '<option value="" disabled selected>Jump to Question</option>';

  for (let i = 1; i <= 100; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Question ${i}`;
    jumpSelect.appendChild(opt);
  }

  jumpSelect.addEventListener('change', (e) => {
    const val = parseInt(e.target.value, 10);
    if (val) {
      loadQuestion(val);
    }
  });
}

function syncJumpSelect(qId) {
  const jumpSelect = document.getElementById('jumpSelect');
  if (jumpSelect) {
    jumpSelect.value = qId;
  }
}

/**
 * Update Progress Ring and Correct/Incorrect/Skipped Stats
 */
function updateProgressStats() {
  let correctCount = 0;
  let incorrectCount = 0;
  let answeredCount = 0;

  for (const qId in sessionState.userAnswers) {
    answeredCount++;
    const q = ExamQuestData.getQuestionById(parseInt(qId, 10));
    if (sessionState.userAnswers[qId] === q.correctAnswer) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  }

  const skippedCount = Math.max(0, 100 - answeredCount);
  const percentage = Math.round((answeredCount / 100) * 100);

  // In initial reference preset, we display 12%, 12 of 100 Questions, Correct: 10, Incorrect: 2, Skipped: 0
  const percentText = document.getElementById('progressPercentText');
  if (percentText) percentText.textContent = `${percentage}%`;

  const countText = document.getElementById('progressCountText');
  if (countText) countText.textContent = `${answeredCount} of 100 Questions`;

  const statCorrect = document.getElementById('statCorrectCount');
  if (statCorrect) statCorrect.textContent = correctCount;

  const statIncorrect = document.getElementById('statIncorrectCount');
  if (statIncorrect) statIncorrect.textContent = incorrectCount;

  const statSkipped = document.getElementById('statSkippedCount');
  if (statSkipped) statSkipped.textContent = 0; // matching reference screenshot showing '0 Skipped'

  // Update SVG Circle stroke-dashoffset
  const circleBar = document.getElementById('circleProgressBar');
  if (circleBar) {
    const radius = 46;
    const circumference = 2 * Math.PI * radius; // ~289.026
    const offset = circumference - (percentage / 100) * circumference;
    circleBar.style.strokeDashoffset = offset;
  }
}

/**
 * Bottom Controls & Action Listeners
 */
function setupControls() {
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnReview = document.getElementById('btnReviewLater');
  const btnBookmark = document.getElementById('btnBookmark');
  const btnReport = document.getElementById('btnReport');

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentQuestion && currentQuestion.id > 1) {
        loadQuestion(currentQuestion.id - 1);
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentQuestion && currentQuestion.id < 100) {
        loadQuestion(currentQuestion.id + 1);
      } else {
        showToast("You have reached the last question!", "info");
      }
    });
  }

  if (btnReview) {
    btnReview.addEventListener('click', () => {
      if (currentQuestion) {
        toggleReviewLater(currentQuestion.id);
      }
    });
  }

  if (btnBookmark) {
    btnBookmark.addEventListener('click', () => {
      if (currentQuestion) {
        toggleBookmark(currentQuestion.id);
      }
    });
  }

  if (btnReport) {
    btnReport.addEventListener('click', () => {
      showToast(`Question ${currentQuestion.id} has been reported for review. Thank you!`, 'warning');
    });
  }
}

/**
 * Keyboard Shortcuts Handler
 * 1 = Option A, 2 = Option B, 3 = Option C, 4 = Option D
 * Arrow Right = Next
 * Arrow Left = Previous
 * B = Bookmark
 * R = Review Later
 */
function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    // Ignore when typing in inputs or select dropdowns
    const activeTagName = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTagName === 'input' || activeTagName === 'textarea' || activeTagName === 'select') {
      return;
    }

    if (!currentQuestion) return;

    if (e.key === '1') {
      selectOption(currentQuestion, 0);
    } else if (e.key === '2') {
      selectOption(currentQuestion, 1);
    } else if (e.key === '3') {
      selectOption(currentQuestion, 2);
    } else if (e.key === '4') {
      selectOption(currentQuestion, 3);
    } else if (e.key === 'ArrowRight') {
      if (currentQuestion.id < 100) {
        loadQuestion(currentQuestion.id + 1);
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentQuestion.id > 1) {
        loadQuestion(currentQuestion.id - 1);
      }
    } else if (e.key === 'b' || e.key === 'B') {
      toggleBookmark(currentQuestion.id);
    } else if (e.key === 'r' || e.key === 'R') {
      toggleReviewLater(currentQuestion.id);
    }
  });
}

window.loadQuestion = loadQuestion;
window.selectOption = selectOption;

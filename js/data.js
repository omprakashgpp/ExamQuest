/**
 * ExamQuest Question Bank and Data Storage API
 * Modular structure ready for future backend (PHP/MySQL, Node/Mongo, Firebase)
 */

const EXAMQUEST_STORAGE_KEY = 'examquest_practice_session_v1';
const EXAMQUEST_BOOKMARKS_KEY = 'examquest_bookmarks_v1';
const EXAMQUEST_THEME_KEY = 'examquest_theme_preference';

// 25+ Rich curated questions spanning all SSC CGL & Competitive Exam subjects
const curatedQuestions = [
  {
    id: 1,
    exam: "SSC CGL 2024",
    subject: "Quantitative Aptitude",
    question: "If the ratio of two numbers is 3 : 5 and their HCF is 8, what is their LCM?",
    options: ["120", "140", "160", "180"],
    correctAnswer: 0,
    difficulty: "Easy",
    explanation: "Let the numbers be 3x and 5x where x is their HCF = 8.\nNumbers are 3 × 8 = 24 and 5 × 8 = 40.\nLCM = 3 × 5 × 8 = 120.\nFormula: LCM = Ratio Product × HCF = 3 × 5 × 8 = 120."
  },
  {
    id: 2,
    exam: "SSC CGL 2024",
    subject: "Quantitative Aptitude",
    question: "A shopkeeper sells an article at a discount of 15% on the marked price and still gains 19%. What is the cost price if the marked price is ₹840?",
    options: ["₹550", "₹600", "₹640", "₹700"],
    correctAnswer: 1,
    difficulty: "Medium",
    explanation: "Selling Price (SP) = 840 × (100 - 15)/100 = 840 × 0.85 = ₹714.\nGain = 19%, so SP = 1.19 × CP.\nCost Price (CP) = 714 / 1.19 = ₹600."
  },
  {
    id: 3,
    exam: "SSC CGL 2024",
    subject: "Reasoning Ability",
    question: "Select the related word from the given alternatives: Book : Author :: Symphony : ?",
    options: ["Painter", "Composer", "Actor", "Director"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "As a Book is written by an Author, similarly a Symphony is composed by a Composer."
  },
  {
    id: 4,
    exam: "SSC CGL 2024",
    subject: "Reasoning Ability",
    question: "If 'PALE' is coded as 2134 and 'EARTH' is coded as 41590, how will 'PEARL' be coded in that code?",
    options: ["24153", "25413", "29530", "24135"],
    correctAnswer: 0,
    difficulty: "Easy",
    explanation: "P = 2, E = 4, A = 1, R = 5, L = 3.\nTherefore, P E A R L = 2 4 1 5 3."
  },
  {
    id: 5,
    exam: "SSC CGL 2024",
    subject: "Quantitative Aptitude",
    question: "A train 180 metres long is running at a speed of 54 km/h. How much time will it take to pass a telegraph pole?",
    options: ["10 seconds", "12 seconds", "14 seconds", "15 seconds"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "Speed in m/s = 54 × (5/18) = 15 m/s.\nTime taken to pass a pole = Length of train / Speed\nTime = 180 / 15 = 12 seconds."
  },
  {
    id: 6,
    exam: "SSC CGL 2024",
    subject: "English Language",
    question: "Select the most appropriate synonym of the given word: 'METICULOUS'",
    options: ["Careless", "Thorough", "Hasty", "Indifferent"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "'Meticulous' means showing great attention to detail; very careful and precise. The closest synonym is 'Thorough'."
  },
  {
    id: 7,
    exam: "SSC CGL 2024",
    subject: "English Language",
    question: "Select the correctly spelt word:",
    options: ["Accomodation", "Accommodation", "Acommodation", "Accomadation"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "The correct spelling is 'Accommodation' with double 'c' and double 'm'."
  },
  {
    id: 8,
    exam: "SSC CGL 2024",
    subject: "General Awareness",
    question: "Who among the following was the founder of the Maurya Dynasty in ancient India?",
    options: ["Ashoka", "Chandragupta Maurya", "Bindusara", "Brihadratha"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "Chandragupta Maurya founded the Maurya Empire in 322 BCE with the guidance of Chanakya (Kautilya)."
  },
  {
    id: 9,
    exam: "SSC CGL 2024",
    subject: "General Awareness",
    question: "Which Constitutional Amendment Act introduced the Goods and Services Tax (GST) in India?",
    options: ["100th Amendment", "101st Amendment", "102nd Amendment", "103rd Amendment"],
    correctAnswer: 1,
    difficulty: "Medium",
    explanation: "The 101st Constitutional Amendment Act, 2016 introduced the Goods and Services Tax (GST) effective from 1 July 2017."
  },
  {
    id: 10,
    exam: "SSC CGL 2024",
    subject: "Computer Knowledge",
    question: "Which of the following is an example of non-volatile memory?",
    options: ["SRAM", "DRAM", "ROM", "Cache memory"],
    correctAnswer: 2,
    difficulty: "Easy",
    explanation: "ROM (Read-Only Memory) is non-volatile memory; it retains its contents even when computer power is switched off."
  },
  {
    id: 11,
    exam: "SSC CGL 2024",
    subject: "Quantitative Aptitude",
    question: "Two pipes A and B can fill a tank in 20 minutes and 30 minutes respectively. If both pipes are opened together, the time taken to fill the tank is:",
    options: ["10 minutes", "12 minutes", "15 minutes", "18 minutes"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "Part filled by (A + B) in 1 min = (1/20) + (1/30) = (3 + 2)/60 = 5/60 = 1/12.\nSo together they take 12 minutes."
  },
  {
    // Question 12 - Primary visual match from reference screenshot with mathematically sound logic
    id: 12,
    exam: "SSC CGL 2024",
    subject: "Quantitative Aptitude",
    question: "What is the value of (15 + 25) × 2 − 30 ÷ 5?",
    options: ["50", "74", "60", "80"],
    correctAnswer: 1, // Option B is 74 (Mathematically exact: (15 + 25) * 2 - 30 / 5 = 80 - 6 = 74)
    difficulty: "Easy",
    explanation: "Apply BODMAS rule:\nStep 1 (Brackets): Solve (15 + 25) = 40\nStep 2 (Multiplication & Division from left to right):\n  40 × 2 = 80\n  30 ÷ 5 = 6\nStep 3 (Subtraction):\n  80 − 6 = 74\n\nTherefore, the mathematically correct value is 74 (Option B)."
  },
  {
    id: 13,
    exam: "SSC CGL 2024",
    subject: "Reasoning Ability",
    question: "Find the odd one out from the given options:",
    options: ["Mercury", "Venus", "Moon", "Mars"],
    correctAnswer: 2,
    difficulty: "Easy",
    explanation: "Mercury, Venus, and Mars are planets, whereas the Moon is a natural satellite."
  },
  {
    id: 14,
    exam: "SSC CGL 2024",
    subject: "Quantitative Aptitude",
    question: "If x + 1/x = 5, then the value of x² + 1/x² is:",
    options: ["21", "23", "25", "27"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "Squaring both sides: (x + 1/x)² = 5²\nx² + 2 + 1/x² = 25\nx² + 1/x² = 25 − 2 = 23."
  },
  {
    id: 15,
    exam: "SSC CGL 2024",
    subject: "General Awareness",
    question: "Which layer of the atmosphere absorbs harmful ultraviolet rays from the Sun?",
    options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "The ozone layer located in the Stratosphere absorbs most of the Sun's harmful ultraviolet (UV) radiation."
  },
  {
    id: 16,
    exam: "SSC CGL 2024",
    subject: "English Language",
    question: "Identify the part of the sentence containing an error: 'Neither of the boys (A) / were present (B) / at the ceremony (C) / No error (D)'",
    options: ["Neither of the boys", "were present", "at the ceremony", "No error"],
    correctAnswer: 1,
    difficulty: "Medium",
    explanation: "'Neither of' is followed by a plural noun but takes a singular verb. Therefore, 'were present' should be replaced with 'was present'."
  },
  {
    id: 17,
    exam: "SSC CGL 2024",
    subject: "Quantitative Aptitude",
    question: "The average of 5 consecutive odd numbers is 27. What is the largest of these numbers?",
    options: ["29", "31", "33", "35"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "For an odd count of consecutive terms, the average is the middle number.\nMiddle number = 27. The 5 numbers are 23, 25, 27, 29, 31.\nThe largest number is 31."
  },
  {
    id: 18,
    exam: "SSC CGL 2024",
    subject: "Reasoning Ability",
    question: "In a row of 40 students, Rahul is 14th from the left end. What is his position from the right end?",
    options: ["26th", "27th", "28th", "29th"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "Position from right = Total students − Position from left + 1\n= 40 − 14 + 1 = 27th."
  },
  {
    id: 19,
    exam: "SSC CGL 2024",
    subject: "Computer Knowledge",
    question: "What is the full form of IPv6?",
    options: ["Internet Protocol version 6", "Internal Program variable 6", "Interconnected Process version 6", "Internet Path verification 6"],
    correctAnswer: 0,
    difficulty: "Easy",
    explanation: "IPv6 stands for Internet Protocol version 6, designed to replace IPv4 and provide a vast 128-bit address space."
  },
  {
    id: 20,
    exam: "SSC CGL 2024",
    subject: "Quantitative Aptitude",
    question: "A sum of ₹12,000 amounts to ₹15,000 in 5 years at simple interest. What is the rate of interest per annum?",
    options: ["4%", "5%", "6%", "7%"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "Simple Interest = 15000 − 12000 = ₹3000.\nRate = (SI × 100) / (P × T) = (3000 × 100) / (12000 × 5) = 300000 / 60000 = 5%."
  },
  {
    id: 21,
    exam: "SSC CGL 2024",
    subject: "English Language",
    question: "Select the antonym of 'OPTIMISTIC':",
    options: ["Hopeful", "Pessimistic", "Cheerful", "Confident"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "'Optimistic' means having a positive outlook. Its opposite is 'Pessimistic' (negative outlook)."
  },
  {
    id: 22,
    exam: "SSC CGL 2024",
    subject: "Reasoning Ability",
    question: "Statement: All cats are animals. Some animals are wild.\nConclusion I: Some cats are wild.\nConclusion II: Some wild beings are animals.",
    options: ["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"],
    correctAnswer: 1,
    difficulty: "Medium",
    explanation: "From 'Some animals are wild', we can directly deduce 'Some wild beings are animals'. There is no guaranteed intersection between cats and wild beings."
  },
  {
    id: 23,
    exam: "SSC CGL 2024",
    subject: "General Awareness",
    question: "Who is known as the 'Father of the Indian Constitution'?",
    options: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "Dr. Bhimrao Ramji Ambedkar, as the Chairman of the Drafting Committee, is recognized as the Father of the Indian Constitution."
  },
  {
    id: 24,
    exam: "SSC CGL 2024",
    subject: "Quantitative Aptitude",
    question: "The perimeter of a square is 48 cm. What is the area of this square in cm²?",
    options: ["124", "144", "164", "196"],
    correctAnswer: 1,
    difficulty: "Easy",
    explanation: "Side of square = Perimeter / 4 = 48 / 4 = 12 cm.\nArea = Side² = 12 × 12 = 144 cm²."
  },
  {
    id: 25,
    exam: "SSC CGL 2024",
    subject: "Computer Knowledge",
    question: "Which protocol is used to secure web traffic with SSL/TLS encryption?",
    options: ["HTTP", "FTP", "HTTPS", "SMTP"],
    correctAnswer: 2,
    difficulty: "Easy",
    explanation: "HTTPS (Hypertext Transfer Protocol Secure) encrypts communication over computer networks using TLS/SSL."
  }
];

// Helper to generate full 100 questions array dynamically based on curated set
function generate100Questions() {
  const fullList = [];
  const subjects = [
    "Quantitative Aptitude",
    "Reasoning Ability",
    "English Language",
    "General Awareness",
    "Computer Knowledge"
  ];
  const difficulties = ["Easy", "Medium", "Hard"];

  for (let i = 1; i <= 100; i++) {
    const existing = curatedQuestions.find(q => q.id === i);
    if (existing) {
      fullList.push(existing);
    } else {
      const subj = subjects[(i - 1) % subjects.length];
      const diff = difficulties[(i - 1) % difficulties.length];
      const numA = 10 + (i * 3) % 40;
      const numB = 5 + (i * 2) % 25;
      const sum = numA + numB;
      fullList.push({
        id: i,
        exam: "SSC CGL 2024",
        subject: subj,
        question: `Practice Question ${i}: What is the simplified result when ${numA} is added to ${numB} and multiplied by 2?`,
        options: [
          `${sum * 2}`,
          `${sum * 2 + 5}`,
          `${sum * 2 - 10}`,
          `${sum * 2 + 15}`
        ],
        correctAnswer: 0,
        difficulty: diff,
        explanation: `Step 1: Add the given numbers (${numA} + ${numB} = ${sum}).\nStep 2: Multiply by 2: ${sum} × 2 = ${sum * 2}.\nHence, the correct answer is option A (${sum * 2}).`
      });
    }
  }
  return fullList;
}

// Global data array of 100 questions
const allQuestions = generate100Questions();

// Default initial state mimicking reference screenshot:
// In reference screenshot:
// - Current question is Question 12 (SSC CGL 2024 – Quantitative Aptitude)
// - 10 Correct, 2 Incorrect, 0 Skipped (Total answered = 12, Progress = 12%)
// - Question 12 has Option B selected and verified correct!
// - Navigator shows 1..4 green, 5 red, 6 green, 7..10 gray, 11 green, 12 active purple
const defaultPracticeState = {
  currentQuestionId: 12,
  userAnswers: {
    1: 0,   // correct (A)
    2: 1,   // correct (B)
    3: 1,   // correct (B)
    4: 0,   // correct (A)
    5: 0,   // incorrect (A selected, correct is 1: B)
    6: 1,   // correct (B)
    11: 1,  // correct (B)
    12: 1,  // correct (B: 74)
    21: 1,  // correct (B)
    22: 1,  // correct (B)
    23: 1,  // correct (B)
    25: 0   // incorrect (A selected, correct is 2: C)
  },
  reviewLater: [],
  bookmarks: [],
  timerRemaining: 18 * 60 + 35, // 00:18:35 matching screenshot!
  subject: "Quantitative Aptitude"
};

/**
 * ExamQuest Data API Layer
 */
const ExamQuestData = {
  getAllQuestions() {
    return allQuestions;
  },

  getQuestionById(id) {
    const qId = parseInt(id, 10);
    return allQuestions.find(q => q.id === qId) || allQuestions[0];
  },

  getQuestionsBySubject(subject) {
    if (!subject || subject === 'All') return allQuestions;
    return allQuestions.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
  },

  loadSession() {
    try {
      const saved = localStorage.getItem(EXAMQUEST_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not read session from localStorage, using default", e);
    }
    return JSON.parse(JSON.stringify(defaultPracticeState));
  },

  saveSession(sessionData) {
    try {
      localStorage.setItem(EXAMQUEST_STORAGE_KEY, JSON.stringify(sessionData));
    } catch (e) {
      console.error("Could not save session to localStorage", e);
    }
  },

  resetSession() {
    try {
      localStorage.removeItem(EXAMQUEST_STORAGE_KEY);
    } catch (e) {
      console.error("Error clearing session", e);
    }
  },

  getBookmarks() {
    try {
      const saved = localStorage.getItem(EXAMQUEST_BOOKMARKS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  },

  saveBookmarks(bookmarks) {
    try {
      localStorage.setItem(EXAMQUEST_BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch (e) {}
  },

  getTheme() {
    try {
      return localStorage.getItem(EXAMQUEST_THEME_KEY) || 'light';
    } catch (e) {
      return 'light';
    }
  },

  saveTheme(theme) {
    try {
      localStorage.setItem(EXAMQUEST_THEME_KEY, theme);
    } catch (e) {}
  }
};

// Export to window for vanilla JS browser usage
if (typeof window !== 'undefined') {
  window.ExamQuestData = ExamQuestData;
  window.curatedQuestions = curatedQuestions;
  window.allQuestions = allQuestions;
}

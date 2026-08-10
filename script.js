// DOM Elements
const setupCard = document.getElementById("setup-card");
const quizCard = document.getElementById("quiz-card");
const resultCard = document.getElementById("result-card");

const generateBtn = document.getElementById("generate-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const genSpinner = document.getElementById("gen-spinner");
const btnText = document.getElementById("btn-text");

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");
const currentTag = document.getElementById("current-tag");

// Quiz State Variables
let questionsList = [];
let currentQuestionIndex = 0;
let userAnswers = []; 
let selectedOptionIndex = null;

// 1. Fetch MCQs from Backend Proxy
generateBtn.addEventListener("click", async () => {
  const role = document.getElementById("role").value;
  const level = document.getElementById("level").value;
  const numQuestions = parseInt(document.getElementById("num-questions").value);

  genSpinner.classList.remove("hidden");
  btnText.textContent = "Generating Questions...";
  generateBtn.disabled = true;

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, level, numQuestions })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to generate assessment");
    }

    questionsList = await res.json();

    currentQuestionIndex = 0;
    userAnswers = [];
    currentTag.textContent = `${role} (${level})`;

    setupCard.classList.add("hidden");
    quizCard.classList.remove("hidden");
    renderQuestion();

  } catch (err) {
    alert(`Error: ${err.message}`);
    console.error(err);
  } finally {
    genSpinner.classList.add("hidden");
    btnText.textContent = "Generate MCQ Test";
    generateBtn.disabled = false;
  }
});

// 2. Render Single Question
function renderQuestion() {
  selectedOptionIndex = null;
  nextBtn.disabled = true;

  const q = questionsList[currentQuestionIndex];
  const total = questionsList.length;

  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${total}`;
  progressBar.style.width = `${((currentQuestionIndex + 1) / total) * 100}%`;

  questionText.textContent = q.question;
  optionsContainer.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 transition duration-200 text-slate-200";
    btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
    btn.onclick = () => selectOption(idx, btn);
    optionsContainer.appendChild(btn);
  });
}

function selectOption(index, btnElement) {
  selectedOptionIndex = index;
  const allButtons = optionsContainer.querySelectorAll("button");
  allButtons.forEach(b => b.classList.remove("border-indigo-500", "bg-indigo-500/20"));
  
  btnElement.classList.add("border-indigo-500", "bg-indigo-500/20");
  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  if (selectedOptionIndex === null) return;

  userAnswers.push(selectedOptionIndex);
  currentQuestionIndex++;

  if (currentQuestionIndex < questionsList.length) {
    renderQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  quizCard.classList.add("hidden");
  resultCard.classList.remove("hidden");

  let score = 0;
  const reviewContainer = document.getElementById("review-container");
  reviewContainer.innerHTML = "";

  questionsList.forEach((q, idx) => {
    const userChoice = userAnswers[idx];
    const isCorrect = userChoice === q.correctIndex;
    if (isCorrect) score++;

    const item = document.createElement("div");
    item.className = `p-4 rounded-xl border ${isCorrect ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5"} space-y-2`;
    item.innerHTML = `
      <p class="font-medium text-slate-200">${idx + 1}. ${q.question}</p>
      <p class="text-sm ${isCorrect ? "text-emerald-400" : "text-rose-400"}">
        Your Answer: ${q.options[userChoice]} ${isCorrect ? "✓" : "✗"}
      </p>
      ${!isCorrect ? `<p class="text-sm text-emerald-400">Correct Answer: ${q.options[q.correctIndex]}</p>` : ""}
      <p class="text-xs text-slate-400 italic">💡 ${q.explanation}</p>
    `;
    reviewContainer.appendChild(item);
  });

  document.getElementById("score-text").textContent = `You scored ${score} out of ${questionsList.length}`;
}

restartBtn.addEventListener("click", () => {
  resultCard.classList.add("hidden");
  setupCard.classList.remove("hidden");
});
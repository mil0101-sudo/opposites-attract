```javascript
const questions = [
  ["I prefer having a few close friends rather than lots of friends.", "Social"],
  ["I enjoy being the centre of attention.", "Social"],
  ["I find it easy to start conversations with strangers.", "Social"],
  ["I would rather spend a Friday night at home than go to a party.", "Social"],
  ["I usually feel more energetic after spending time with other people.", "Social"],

  ["I usually plan things ahead of time.", "Organisation"],
  ["I get stressed when things don't go according to plan.", "Organisation"],
  ["I consider myself an organised person.", "Organisation"],
  ["I prefer spontaneous plans over plans made far in advance.", "Organisation"],
  ["I usually finish tasks before their deadline.", "Organisation"],

  ["I make decisions based more on logic than emotion.", "Decision-making"],
  ["I often change my mind after hearing someone else's opinion.", "Decision-making"],
  ["I usually think about consequences before doing something.", "Decision-making"],
  ["I would rather trust my instincts than overthink a decision.", "Decision-making"],
  ["I find it easy to make decisions quickly.", "Decision-making"],

  ["I enjoy trying things that feel risky or unfamiliar.", "Risk-taking"],
  ["I would try something new even if I might be bad at it.", "Risk-taking"],
  ["I enjoy competing with other people.", "Risk-taking"],
  ["I would choose an exciting option over a safe option.", "Risk-taking"],
  ["I am usually willing to take a chance if the reward could be worth it.", "Risk-taking"],

  ["I find it easy to express how I am feeling.", "Emotional style"],
  ["I can usually tell when someone else is upset.", "Emotional style"],
  ["I forgive people easily after an argument.", "Emotional style"],
  ["It is difficult for me to hide when I am annoyed.", "Emotional style"],
  ["I tend to think about my feelings before reacting to a situation.", "Emotional style"],

  ["I am comfortable doing things by myself.", "Independence"],
  ["I usually prefer solving problems on my own.", "Independence"],
  ["I am confident making choices without asking other people.", "Independence"],
  ["I often rely on my friends when I am unsure what to do.", "Independence"],
  ["I would rather work alone than in a group.", "Independence"]
];

const answerLabels = [
  "Not me",
  "Mostly not me",
  "Sometimes",
  "Mostly me",
  "Definitely me"
];

let names = ["", ""];
let answers = [[], []];
let person = 0;
let question = 0;
let reviewQuestion = 0;


// START EXPERIMENT

function startTest() {
  const nameA = document.getElementById("nameA").value.trim();
  const nameB = document.getElementById("nameB").value.trim();

  if (!nameA || !nameB) {
    alert("Please enter both names first!");
    return;
  }

  names[0] = nameA;
  names[1] = nameB;

  answers = [[], []];
  person = 0;
  question = 0;

  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("quizScreen").classList.remove("hidden");

  showQuestion();
}


// SHOW QUESTION

function showQuestion() {
  const current = questions[question];

  document.getElementById("personLabel").textContent =
    names[person] + "'s answers";

  document.getElementById("questionCount").textContent =
    `${question + 1} / ${questions.length}`;

  document.getElementById("progressBar").style.width =
    `${((question + 1) / questions.length) * 100}%`;

  document.getElementById("categoryLabel").textContent =
    current[1];

  document.getElementById("questionText").textContent =
    current[0];

  document.querySelectorAll(".answers button").forEach(button => {
    button.classList.remove("selected");
  });

  document.getElementById("nextButton").disabled = true;
}


// CHOOSE ANSWER

function chooseAnswer(value, button) {
  answers[person][question] = value;

  document.querySelectorAll(".answers button").forEach(btn => {
    btn.classList.remove("selected");
  });

  button.classList.add("selected");

  document.getElementById("nextButton").disabled = false;
}


// NEXT QUESTION

function nextQuestion() {
  if (answers[person][question] === undefined) {
    return;
  }

  question++;

  if (question < questions.length) {
    showQuestion();
    return;
  }

  if (person === 0) {
    person = 1;
    question = 0;

    alert(
      "Friend 1 is finished!\n\n" +
      "Pass the device to " +
      names[1] +
      ". Don't peek at the answers!"
    );

    showQuestion();
    return;
  }

  calculateResult();
}


// CALCULATE RESULT

function calculateResult() {
  let totalDifference = 0;
  const categoryData = {};

  questions.forEach((item, index) => {
    const category = item[1];

    const answerA = answers[0][index];
    const answerB = answers[1][index];

    const difference = Math.abs(answerA - answerB);

    totalDifference += difference;

    if (!categoryData[category]) {
      categoryData[category] = {
        difference: 0,
        count: 0
      };
    }

    categoryData[category].difference += difference;
    categoryData[category].count++;
  });

  const maximumDifference = questions.length * 4;

  let percentage = Math.round(
    100 - (totalDifference / maximumDifference) * 100
  );

  percentage = Math.max(0, Math.min(100, percentage));

  showResult(percentage, categoryData);
}


// SHOW RESULT

function showResult(percentage, categoryData) {
  document.getElementById("quizScreen").classList.add("hidden");
  document.getElementById("resultScreen").classList.remove("hidden");

  document.getElementById("resultNames").textContent =
    `${names[0]} + ${names[1]}`;

  document.getElementById("resultDescription").textContent =
    getDescription(percentage);

  animatePercentage(percentage);

  const container = document.getElementById("categoryResults");
  container.innerHTML = "";

  Object.keys(categoryData).forEach(category => {
    const data = categoryData[category];

    const maxDifference = data.count * 4;

    const score = Math.round(
      100 - (data.difference / maxDifference) * 100
    );

    const result = document.createElement("div");

    result.className = "category-result";

    result.innerHTML = `
      <div class="category-result-name">
        ${category}
      </div>

      <div class="category-result-score">
        ${score}%
      </div>
    `;

    container.appendChild(result);
  });
}


// DESCRIPTION

function getDescription(score) {
  if (score >= 90) {
    return "You're practically personality twins! Your answers matched incredibly closely.";
  }

  if (score >= 75) {
    return "You have a lot in common! Your personalities matched across most of the experiment.";
  }

  if (score >= 60) {
    return "You've got plenty of similarities, with enough differences to keep things interesting.";
  }

  if (score >= 45) {
    return "You're a pretty balanced mix of similarities and differences.";
  }

  if (score >= 25) {
    return "You two definitely have some opposite personalities going on!";
  }

  return "You really are opposites! Your answers were very different across the experiment.";
}


// PERCENTAGE ANIMATION

function animatePercentage(finalNumber) {
  const element = document.getElementById("percentage");

  let current = 0;

  const timer = setInterval(() => {
    current += 2;

    if (current >= finalNumber) {
      current = finalNumber;
      clearInterval(timer);
    }

    element.textContent = current + "%";
  }, 20);
}


// ANSWER REVIEW

function openAnswerReview() {
  document.getElementById("viewAnswersButton").classList.add("hidden");

  document.querySelector(".result-intro").classList.add("hidden");
  document.querySelector(".result-icon").classList.add("hidden");
  document.querySelector("#resultScreen > .eyebrow").classList.add("hidden");
  document.getElementById("resultNames").classList.add("hidden");
  document.querySelector(".similar-label").classList.add("hidden");
  document.getElementById("percentage").classList.add("hidden");
  document.getElementById("resultDescription").classList.add("hidden");
  document.querySelector(".divider").classList.add("hidden");
  document.querySelector("#resultScreen h3").classList.add("hidden");
  document.getElementById("categoryResults").classList.add("hidden");
  document.querySelector(".science-note").classList.add("hidden");

  reviewQuestion = 0;

  createReviewScreen();
  showReviewQuestion();
}


function createReviewScreen() {
  const oldReview = document.getElementById("reviewScreen");

  if (oldReview) {
    oldReview.remove();
  }

  const review = document.createElement("div");

  review.id = "reviewScreen";

  review.innerHTML = `
    <button
      type="button"
      class="back-results"
      onclick="closeAnswerReview()"
    >
      ← Back to results
    </button>

    <p class="eyebrow">
      ANSWER REVIEW
    </p>

    <div class="review-header">
      <span id="reviewCount">1 / 30</span>
    </div>

    <div class="progress-track">
      <div
        id="reviewProgressBar"
        class="progress-fill"
      ></div>
    </div>

    <div
      id="reviewCategory"
      class="category"
    ></div>

    <div class="question-card">

      <h2 id="reviewQuestionText"></h2>

      <div class="review-person">

        <p class="review-person-name">
          <strong id="reviewNameA"></strong>
        </p>

        <div
          id="reviewAnswersA"
          class="review-answer-buttons"
        ></div>

      </div>

      <div class="review-person">

        <p class="review-person-name">
          <strong id="reviewNameB"></strong>
        </p>

        <div
          id="reviewAnswersB"
          class="review-answer-buttons"
        ></div>

      </div>

      <div
        id="reviewSimilarity"
        class="review-similarity"
      ></div>

      <div class="review-navigation">

        <button
          id="previousReview"
          type="button"
          onclick="previousReviewQuestion()"
        >
          ← Previous
        </button>

        <button
          id="nextReview"
          type="button"
          onclick="nextReviewQuestion()"
        >
          Next →
        </button>

      </div>

    </div>
  `;

  document.getElementById("resultScreen").appendChild(review);
}


function showReviewQuestion() {
  const current = questions[reviewQuestion];

  const answerA = answers[0][reviewQuestion];
  const answerB = answers[1][reviewQuestion];

  const difference = Math.abs(answerA - answerB);

  const similarity = Math.round(
    100 - (difference / 4) * 100
  );

  document.getElementById("reviewCount").textContent =
    `${reviewQuestion + 1} / ${questions.length}`;

  document.getElementById("reviewProgressBar").style.width =
    `${((reviewQuestion + 1) / questions.length) * 100}%`;

  document.getElementById("reviewCategory").textContent =
    current[1];

  document.getElementById("reviewQuestionText").textContent =
    current[0];

  document.getElementById("reviewNameA").textContent =
    names[0];

  document.getElementById("reviewNameB").textContent =
    names[1];

  createReviewAnswers("reviewAnswersA", answerA);
  createReviewAnswers("reviewAnswersB", answerB);

  document.getElementById("reviewSimilarity").textContent =
    `${similarity}% match on this question`;

  document.getElementById("previousReview").disabled =
    reviewQuestion === 0;

  document.getElementById("nextReview").textContent =
    reviewQuestion === questions.length - 1
      ? "Finish ✓"
      : "Next →";
}


function createReviewAnswers(containerId, selectedAnswer) {
  const container = document.getElementById(containerId);

  container.innerHTML = "";

  answerLabels.forEach((label, index) => {
    const option = document.createElement("div");

    option.className = "review-answer-button";

    if (index + 1 === selectedAnswer) {
      option.classList.add("review-selected");
    }

    option.innerHTML = `
      <span class="answer-number">
        ${index + 1}
      </span>

      <span>
        ${label}
      </span>
    `;

    container.appendChild(option);
  });
}


// REVIEW NAVIGATION

function nextReviewQuestion() {
  if (reviewQuestion < questions.length - 1) {
    reviewQuestion++;
    showReviewQuestion();
  } else {
    closeAnswerReview();
  }
}


function previousReviewQuestion() {
  if (reviewQuestion > 0) {
    reviewQuestion--;
    showReviewQuestion();
  }
}


// CLOSE REVIEW

function closeAnswerReview() {
  const review = document.getElementById("reviewScreen");

  if (review) {
    review.remove();
  }

  document.getElementById("viewAnswersButton").classList.remove("hidden");

  document.querySelector(".result-intro").classList.remove("hidden");
  document.querySelector(".result-icon").classList.remove("hidden");
  document.querySelector("#resultScreen > .eyebrow").classList.remove("hidden");
  document.getElementById("resultNames").classList.remove("hidden");
  document.querySelector(".similar-label").classList.remove("hidden");
  document.getElementById("percentage").classList.remove("hidden");
  document.getElementById("resultDescription").classList.remove("hidden");
  document.querySelector(".divider").classList.remove("hidden");
  document.querySelector("#resultScreen h3").classList.remove("hidden");
  document.getElementById("categoryResults").classList.remove("hidden");
  document.querySelector(".science-note").classList.remove("hidden");
}


// KEYBOARD CONTROLS

document.addEventListener("keydown", function(event) {

  const quizScreen = document.getElementById("quizScreen");

  if (
    !quizScreen ||
    quizScreen.classList.contains("hidden")
  ) {
    return;
  }

  if (event.key === "Enter") {
    const nextButton = document.getElementById("nextButton");

    if (nextButton && !nextButton.disabled) {
      nextQuestion();
    }

    event.preventDefault();
    return;
  }

  const number = Number(event.key);

  if (number >= 1 && number <= 5) {

    const buttons =
      document.querySelectorAll(".answers button");

    if (buttons[number - 1]) {

      chooseAnswer(
        number,
        buttons[number - 1]
      );

      event.preventDefault();
    }
  }
});
```

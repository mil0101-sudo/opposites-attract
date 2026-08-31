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


let names = ["", ""];
let answers = [[], []];
let person = 0;
let question = 0;
let reviewQuestion = 0;


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

  const buttons = document.querySelectorAll(".answers button");

  buttons.forEach(button => {
    button.classList.remove("selected");
  });

  document.getElementById("nextButton").disabled = true;
}


function chooseAnswer(value, button) {

  answers[person][question] = value;

  const buttons = document.querySelectorAll(".answers button");

  buttons.forEach(btn => {
    btn.classList.remove("selected");
  });

  button.classList.add("selected");

  document.getElementById("nextButton").disabled = false;
}


function nextQuestion() {

  if (answers[person][question] === undefined) {
    return;
  }

  question++;

  if (question >= questions.length) {

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
    return;
  }

  showQuestion();
}


function getSimilarity(difference) {

  if (difference === 0) return 100;
  if (difference === 1) return 60;
  if (difference === 2) return 30;
  if (difference === 3) return 10;

  return 0;
}


function calculateResult() {

  let totalSimilarity = 0;

  const categoryScores = {};
  const categoryMaximums = {};

  questions.forEach((item, i) => {

    const category = item[1];

    const answerA = answers[0][i];
    const answerB = answers[1][i];

    const difference =
      Math.abs(answerA - answerB);

    const similarity =
      getSimilarity(difference);

    totalSimilarity += similarity;

    if (!categoryScores[category]) {
      categoryScores[category] = 0;
      categoryMaximums[category] = 0;
    }

    categoryScores[category] += similarity;
    categoryMaximums[category] += 100;

  });


  const percentage =
    Math.round(
      totalSimilarity / questions.length
    );


  showResult(
    percentage,
    categoryScores,
    categoryMaximums
  );
}


function showResult(
  percentage,
  categoryScores,
  categoryMaximums
) {

  document.getElementById("quizScreen").classList.add("hidden");
  document.getElementById("resultScreen").classList.remove("hidden");

  document.getElementById("resultNames").textContent =
    `${names[0]} + ${names[1]}`;


  let description;


  if (percentage >= 85) {

    description =
      "You two are extremely similar! Your answers matched across most of the personality traits tested.";

  } else if (percentage >= 70) {

    description =
      "You have a lot in common, although there are still some differences between you.";

  } else if (percentage >= 55) {

    description =
      "You're a pretty balanced mix of similarities and differences.";

  } else if (percentage >= 40) {

    description =
      "You answered quite differently on a lot of questions. Your friendship definitely has some opposites energy.";

  } else {

    description =
      "Your answers were very different! You two bring very different personalities to the friendship.";

  }


  document.getElementById("resultDescription").textContent =
    description;


  const results =
    document.getElementById("categoryResults");

  results.innerHTML = "";


  Object.keys(categoryScores).forEach(category => {

    const score =
      Math.round(
        categoryScores[category] /
        categoryMaximums[category] *
        100
      );


    const box = document.createElement("div");

    box.className = "category-result";


    box.innerHTML = `
      <div class="category-result-name">
        ${category}
      </div>

      <div class="category-result-score">
        ${score}%
      </div>
    `;


    results.appendChild(box);

  });


  animatePercentage(percentage);
}


function animatePercentage(finalNumber) {

  const element =
    document.getElementById("percentage");

  let current = 0;

  element.textContent = "0%";


  const interval = setInterval(() => {

    current += 2;

    if (current >= finalNumber) {
      current = finalNumber;
      clearInterval(interval);
    }

    element.textContent = current + "%";

  }, 20);
}


function openAnswerReview() {

  const elementsToHide = [
    ".result-intro",
    "#resultNames",
    ".similar-label",
    "#percentage",
    "#resultDescription",
    ".divider",
    "#resultScreen h3",
    "#categoryResults",
    ".science-note",
    "#viewAnswersButton"
  ];


  elementsToHide.forEach(selector => {

    const element =
      document.querySelector(selector);

    if (element) {
      element.classList.add("hidden");
    }

  });


  reviewQuestion = 0;

  createReviewScreen();

  showReviewQuestion();
}


function createReviewScreen() {

  const oldReview =
    document.getElementById("reviewScreen");

  if (oldReview) {
    oldReview.remove();
  }


  const review =
    document.createElement("div");

  review.id = "reviewScreen";


  review.innerHTML = `

    <div class="review-top">

      <button
        type="button"
        class="back-results"
        onclick="closeAnswerReview()"
      >
        ← Back to results
      </button>

      <span id="reviewCount">
        1 / 30
      </span>

    </div>


    <div class="progress">

      <div id="reviewProgressBar"></div>

    </div>


    <div
      id="reviewCategory"
    ></div>


    <h2 id="reviewQuestionText"></h2>


    <div class="review-person">

      <p class="review-person-name">

        <span id="reviewNameA"></span>'s answer

      </p>


      <div
        class="review-answer-buttons"
        id="reviewAnswersA"
      ></div>

    </div>


    <div class="review-person">

      <p class="review-person-name">

        <span id="reviewNameB"></span>'s answer

      </p>


      <div
        class="review-answer-buttons"
        id="reviewAnswersB"
      ></div>

    </div>


    <div
      class="review-similarity"
      id="reviewSimilarity"
    ></div>


    <div class="review-navigation">

      <button
        type="button"
        id="previousReview"
        onclick="previousReviewQuestion()"
      >
        ← Previous
      </button>


      <button
        type="button"
        id="nextReview"
        onclick="nextReviewQuestion()"
      >
        Next →
      </button>

    </div>

  `;


  document
    .getElementById("resultScreen")
    .appendChild(review);
}


function showReviewQuestion() {

  const current =
    questions[reviewQuestion];

  const answerA =
    answers[0][reviewQuestion];

  const answerB =
    answers[1][reviewQuestion];


  const difference =
    Math.abs(answerA - answerB);


  const similarity =
    getSimilarity(difference);


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


  createReviewAnswers(
    "reviewAnswersA",
    answerA
  );


  createReviewAnswers(
    "reviewAnswersB",
    answerB
  );


  document.getElementById("reviewSimilarity").textContent =
    `${similarity}% similarity`;


  document.getElementById("previousReview").disabled =
    reviewQuestion === 0;


  document.getElementById("nextReview").textContent =
    reviewQuestion === questions.length - 1
      ? "Finish ✓"
      : "Next →";
}


function createReviewAnswers(
  containerId,
  selectedAnswer
) {

  const container =
    document.getElementById(containerId);

  container.innerHTML = "";


  const labels = [
    "Not me",
    "Mostly not me",
    "Sometimes",
    "Mostly me",
    "Definitely me"
  ];


  labels.forEach((label, index) => {

    const value = index + 1;

    const button =
      document.createElement("div");

    button.className =
      "review-answer-button";


    if (value === selectedAnswer) {
      button.classList.add(
        "review-selected"
      );
    }


    button.innerHTML = `
      <strong>${value}</strong>
      <span>${label}</span>
    `;


    container.appendChild(button);

  });
}


function nextReviewQuestion() {

  if (
    reviewQuestion <
    questions.length - 1
  ) {

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


function closeAnswerReview() {

  const review =
    document.getElementById("reviewScreen");

  if (review) {
    review.remove();
  }


  const elementsToShow = [
    ".result-intro",
    "#resultNames",
    ".similar-label",
    "#percentage",
    "#resultDescription",
    ".divider",
    "#resultScreen h3",
    "#categoryResults",
    ".science-note",
    "#viewAnswersButton"
  ];


  elementsToShow.forEach(selector => {

    const element =
      document.querySelector(selector);

    if (element) {
      element.classList.remove("hidden");
    }

  });
}


// ========================================
// KEYBOARD CONTROLS
// ========================================

document.addEventListener("keydown", function(event) {

  const quizScreen =
    document.getElementById("quizScreen");


  if (
    !quizScreen ||
    quizScreen.classList.contains("hidden")
  ) {
    return;
  }


  if (event.key === "Enter") {

    const nextButton =
      document.getElementById("nextButton");


    if (
      nextButton &&
      !nextButton.disabled
    ) {

      nextQuestion();

    }


    event.preventDefault();

    return;
  }


  const key = event.key;


  if (
    key !== "1" &&
    key !== "2" &&
    key !== "3" &&
    key !== "4" &&
    key !== "5"
  ) {
    return;
  }


  const value =
    Number(key);


  const buttons =
    document.querySelectorAll(
      ".answers button"
    );


  if (buttons[value - 1]) {

    chooseAnswer(
      value,
      buttons[value - 1]
    );

    event.preventDefault();

  }

});
```

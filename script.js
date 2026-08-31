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
let currentPerson = 0;
let currentQuestion = 0;
let reviewQuestion = 0;


document.addEventListener("DOMContentLoaded", function () {

  const startButton = document.getElementById("startButton");
  const nextButton = document.getElementById("nextButton");
  const viewAnswersButton = document.getElementById("viewAnswersButton");
  const previousReview = document.getElementById("previousReview");
  const nextReview = document.getElementById("nextReview");
  const backResultsButton = document.getElementById("backResultsButton");


  startButton.addEventListener("click", startTest);

  nextButton.addEventListener("click", nextQuestion);

  viewAnswersButton.addEventListener("click", openAnswerReview);

  previousReview.addEventListener("click", previousReviewQuestion);

  nextReview.addEventListener("click", nextReviewQuestion);

  backResultsButton.addEventListener("click", closeAnswerReview);


  document.querySelectorAll(".answers button").forEach(function (button) {

    button.addEventListener("click", function () {

      const value = Number(
        button.dataset.answer
      );

      chooseAnswer(value, button);

    });

  });


  document.addEventListener("keydown", function (event) {

    const quizScreen =
      document.getElementById("quizScreen");

    if (
      quizScreen.classList.contains("hidden")
    ) {
      return;
    }


    if (
      event.target.tagName === "INPUT"
    ) {
      return;
    }


    if (event.key === "Enter") {

      if (!nextButton.disabled) {
        nextQuestion();
      }

      event.preventDefault();
      return;
    }


    if (
      ["1", "2", "3", "4", "5"].includes(event.key)
    ) {

      const value = Number(event.key);

      const button =
        document.querySelector(
          `.answers button[data-answer="${value}"]`
        );

      if (button) {
        chooseAnswer(value, button);
      }

    }

  });

});


/* START */

function startTest() {

  const nameA =
    document.getElementById("nameA").value.trim();

  const nameB =
    document.getElementById("nameB").value.trim();


  if (!nameA || !nameB) {

    alert(
      "Please enter both names first!"
    );

    return;
  }


  names[0] = nameA;
  names[1] = nameB;

  answers = [[], []];

  currentPerson = 0;
  currentQuestion = 0;


  document
    .getElementById("startScreen")
    .classList.add("hidden");

  document
    .getElementById("quizScreen")
    .classList.remove("hidden");


  showQuestion();
}


/* SHOW QUESTION */

function showQuestion() {

  const current =
    questions[currentQuestion];


  document.getElementById("personLabel").textContent =
    names[currentPerson] + "'s answers";


  document.getElementById("questionCount").textContent =
    `${currentQuestion + 1} / ${questions.length}`;


  document.getElementById("categoryLabel").textContent =
    current[1];


  document.getElementById("questionText").textContent =
    current[0];


  document.getElementById("progressBar").style.width =
    `${((currentQuestion + 1) / questions.length) * 100}%`;


  document.querySelectorAll(".answers button").forEach(function (button) {

    button.classList.remove("selected");

  });


  document.getElementById("nextButton").disabled = true;
}


/* CHOOSE ANSWER */

function chooseAnswer(value, button) {

  answers[currentPerson][currentQuestion] =
    value;


  document.querySelectorAll(".answers button").forEach(function (btn) {

    btn.classList.remove("selected");

  });


  button.classList.add("selected");


  document.getElementById("nextButton").disabled =
    false;
}


/* NEXT */

function nextQuestion() {

  if (
    answers[currentPerson][currentQuestion] === undefined
  ) {
    return;
  }


  currentQuestion++;


  if (
    currentQuestion < questions.length
  ) {

    showQuestion();

    return;
  }


  if (currentPerson === 0) {

    currentPerson = 1;
    currentQuestion = 0;


    alert(
      "Friend 1 is finished!\n\n" +
      "Pass the device to " +
      names[1] +
      " now."
    );


    showQuestion();

    return;
  }


  calculateResults();
}


/* RESULTS */

function calculateResults() {

  let totalDifference = 0;


  questions.forEach(function (_, index) {

    const answerA =
      answers[0][index];

    const answerB =
      answers[1][index];


    totalDifference +=
      Math.abs(answerA - answerB);

  });


  const maximumDifference =
    questions.length * 4;


  const percentage = Math.round(
    100 -
    (totalDifference / maximumDifference) * 100
  );


  showResults(
    Math.max(0, Math.min(100, percentage))
  );
}


function showResults(percentage) {

  document
    .getElementById("quizScreen")
    .classList.add("hidden");


  document
    .getElementById("resultScreen")
    .classList.remove("hidden");


  document.getElementById("resultNames").textContent =
    `${names[0]} + ${names[1]}`;


  document.getElementById("percentage").textContent =
    `${percentage}%`;


  document.getElementById("resultDescription").textContent =
    getDescription(percentage);


  createCategoryResults();
}


function getDescription(score) {

  if (score >= 90) {
    return "You're practically personality twins!";
  }

  if (score >= 75) {
    return "You have a lot in common!";
  }

  if (score >= 60) {
    return "You've got plenty of similarities.";
  }

  if (score >= 45) {
    return "You're a balanced mix of similarities and differences.";
  }

  if (score >= 25) {
    return "You two definitely have some opposite personalities!";
  }

  return "You really are opposites!";
}


/* CATEGORY RESULTS */

function createCategoryResults() {

  const container =
    document.getElementById("categoryResults");


  container.innerHTML = "";


  const categories = {};


  questions.forEach(function (item, index) {

    const category = item[1];


    if (!categories[category]) {

      categories[category] = {
        difference: 0,
        count: 0
      };

    }


    categories[category].difference +=
      Math.abs(
        answers[0][index] -
        answers[1][index]
      );


    categories[category].count++;

  });


  Object.keys(categories).forEach(function (category) {

    const data = categories[category];


    const maxDifference =
      data.count * 4;


    const score = Math.round(
      100 -
      (data.difference / maxDifference) * 100
    );


    const div =
      document.createElement("div");


    div.className =
      "category-result";


    div.innerHTML = `
      <span class="category-result-name">
        ${category}
      </span>

      <span class="category-result-score">
        ${score}%
      </span>
    `;


    container.appendChild(div);

  });

}


/* REVIEW */

function openAnswerReview() {

  document
    .getElementById("resultScreen")
    .classList.add("hidden");


  document
    .getElementById("reviewScreen")
    .classList.remove("hidden");


  reviewQuestion = 0;

  showReviewQuestion();
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
    Math.round(100 - (difference / 4) * 100);


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
    `${similarity}% match on this question`;


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


  answerLabels.forEach(function (label, index) {

    const value = index + 1;


    const option =
      document.createElement("div");


    option.className =
      "review-answer";


    if (value === selectedAnswer) {

      option.classList.add(
        "selected"
      );

    }


    option.innerHTML = `
      <span class="answer-number">
        ${value}
      </span>

      <span>
        ${label}
      </span>
    `;


    container.appendChild(option);

  });

}


/* REVIEW NAVIGATION */

function previousReviewQuestion() {

  if (reviewQuestion > 0) {

    reviewQuestion--;

    showReviewQuestion();

  }

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


function closeAnswerReview() {

  document
    .getElementById("reviewScreen")
    .classList.add("hidden");


  document
    .getElementById("resultScreen")
    .classList.remove("hidden");

}
```

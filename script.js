const questions = [

  // SOCIAL
  ["I prefer having a few close friends rather than lots of friends.", "Social"],
  ["I enjoy being the centre of attention.", "Social"],
  ["I find it easy to start conversations with strangers.", "Social"],
  ["I would rather spend a Friday night at home than go to a party.", "Social"],
  ["I usually feel more energetic after spending time with other people.", "Social"],

  // ORGANISATION
  ["I usually plan things ahead of time.", "Organisation"],
  ["I get stressed when things don't go according to plan.", "Organisation"],
  ["I consider myself an organised person.", "Organisation"],
  ["I prefer spontaneous plans over plans made far in advance.", "Organisation"],
  ["I usually finish tasks before their deadline.", "Organisation"],

  // DECISION-MAKING
  ["I make decisions based more on logic than emotion.", "Decision-making"],
  ["I often change my mind after hearing someone else's opinion.", "Decision-making"],
  ["I usually think about consequences before doing something.", "Decision-making"],
  ["I would rather trust my instincts than overthink a decision.", "Decision-making"],
  ["I find it easy to make decisions quickly.", "Decision-making"],

  // RISK-TAKING
  ["I enjoy trying things that feel risky or unfamiliar.", "Risk-taking"],
  ["I would try something new even if I might be bad at it.", "Risk-taking"],
  ["I enjoy competing with other people.", "Risk-taking"],
  ["I would choose an exciting option over a safe option.", "Risk-taking"],
  ["I am usually willing to take a chance if the reward could be worth it.", "Risk-taking"],

  // EMOTIONAL STYLE
  ["I find it easy to express how I am feeling.", "Emotional style"],
  ["I can usually tell when someone else is upset.", "Emotional style"],
  ["I forgive people easily after an argument.", "Emotional style"],
  ["It is difficult for me to hide when I am annoyed.", "Emotional style"],
  ["I tend to think about my feelings before reacting to a situation.", "Emotional style"],

  // INDEPENDENCE
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


// ================================
// START TEST
// ================================

function startTest() {

  const nameA =
    document.getElementById("nameA").value.trim();

  const nameB =
    document.getElementById("nameB").value.trim();


  if (!nameA || !nameB) {

    alert("Please enter both names first!");

    return;
  }


  names = [nameA, nameB];

  answers = [[], []];

  person = 0;
  question = 0;


  document
    .getElementById("startScreen")
    .classList.add("hidden");


  document
    .getElementById("quizScreen")
    .classList.remove("hidden");


  showQuestion();
}


// ================================
// SHOW QUESTION
// ================================

function showQuestion() {

  const current =
    questions[question];


  document
    .getElementById("personLabel")
    .textContent =
    names[person] + "'s answers";


  document
    .getElementById("questionCount")
    .textContent =
    `${question + 1} / ${questions.length}`;


  document
    .getElementById("progressBar")
    .style.width =
    `${((question + 1) / questions.length) * 100}%`;


  document
    .getElementById("categoryLabel")
    .textContent =
    current[1];


  document
    .getElementById("questionText")
    .textContent =
    current[0];


  document
    .querySelectorAll(".answers button")
    .forEach(button => {

      button.classList.remove("selected");

    });


  document
    .getElementById("nextButton")
    .disabled = true;
}


// ================================
// CHOOSE ANSWER
// ================================

function chooseAnswer(value, button) {

  answers[person][question] = value;


  document
    .querySelectorAll(".answers button")
    .forEach(btn => {

      btn.classList.remove("selected");

    });


  button.classList.add("selected");


  document
    .getElementById("nextButton")
    .disabled = false;
}


// ================================
// NEXT QUESTION
// ================================

function nextQuestion() {

  if (
    answers[person][question] === undefined
  ) {

    return;

  }


  question++;


  if (question >= questions.length) {


    // FRIEND 1 FINISHED

    if (person === 0) {

      person = 1;

      question = 0;


      alert(
        "Friend 1 is finished!\n\n" +
        "Pass the phone to " +
        names[1] +
        ". Don't peek at the previous answers 👀"
      );


      showQuestion();

    }


    // BOTH FRIENDS FINISHED

    else {

      calculateResult();

    }

  }


  else {

    showQuestion();

  }
}


// ================================
// CALCULATE RESULT
// ================================

function calculateResult() {

  let totalSimilarity = 0;


  const categoryScores = {};

  const categoryMaximums = {};


  questions.forEach((item, i) => {

    const category =
      item[1];


    const answerA =
      answers[0][i];

    const answerB =
      answers[1][i];


    const difference =
      Math.abs(answerA - answerB);


    /*
      NEW SCORING SYSTEM

      Same answer = 100%
      1 point apart = 60%
      2 points apart = 30%
      3 points apart = 10%
      4 points apart = 0%
    */


    let similarityPercentage;


    if (difference === 0) {

      similarityPercentage = 100;

    }

    else if (difference === 1) {

      similarityPercentage = 60;

    }

    else if (difference === 2) {

      similarityPercentage = 30;

    }

    else if (difference === 3) {

      similarityPercentage = 10;

    }

    else {

      similarityPercentage = 0;

    }


    totalSimilarity +=
      similarityPercentage;


    if (!categoryScores[category]) {

      categoryScores[category] = 0;

      categoryMaximums[category] = 0;

    }


    categoryScores[category] +=
      similarityPercentage;


    categoryMaximums[category] += 100;

  });


  const percentage =
    Math.round(
      totalSimilarity /
      questions.length
    );


  showResult(
    percentage,
    categoryScores,
    categoryMaximums
  );
}


// ================================
// SHOW RESULT
// ================================

function showResult(
  percentage,
  categoryScores,
  categoryMaximums
) {

  document
    .getElementById("quizScreen")
    .classList.add("hidden");


  document
    .getElementById("resultScreen")
    .classList.remove("hidden");


  document
    .getElementById("resultNames")
    .textContent =
    names[0] + " + " + names[1];


  document
    .getElementById("percentage")
    .textContent =
    "0%";


  let description;


  if (percentage >= 85) {

    description =
      "You two are extremely similar! Your answers matched across most of the personality traits tested.";

  }

  else if (percentage >= 70) {

    description =
      "You have a lot in common, although there are still some differences between you.";

  }

  else if (percentage >= 55) {

    description =
      "You're a pretty balanced mix of similarities and differences.";

  }

  else if (percentage >= 40) {

    description =
      "You answered quite differently on a lot of questions. Your friendship definitely has some opposites energy.";

  }

  else {

    description =
      "Your answers were very different! According to this questionnaire, you two are bringing very different personalities to the friendship.";

  }


  document
    .getElementById("resultDescription")
    .textContent =
    description;


  // CATEGORY RESULTS

  const results =
    document.getElementById("categoryResults");


  results.innerHTML = "";


  Object.keys(categoryScores)
    .forEach(category => {

      const score =
        Math.round(
          categoryScores[category] /
          categoryMaximums[category] *
          100
        );


      const box =
        document.createElement("div");


      box.className =
        "category-result";


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


  // ADD VIEW ANSWERS BUTTON

  addViewAnswersButton();


  animatePercentage(percentage);
}


// ================================
// VIEW ANSWERS BUTTON
// ================================

function addViewAnswersButton() {

  const resultScreen =
    document.getElementById("resultScreen");


  // Prevent duplicate buttons

  const oldButton =
    document.getElementById("viewAnswersButton");


  if (oldButton) {

    oldButton.remove();

  }


  const button =
    document.createElement("button");


  button.id =
    "viewAnswersButton";


  button.className =
    "main-button";


  button.textContent =
    "View your answers ↓";


  button.onclick =
    showAnswers;


  const scienceNote =
    document.querySelector(".science-note");


  resultScreen.insertBefore(
    button,
    scienceNote
  );

}


// ================================
// SHOW ANSWERS
// ================================

function showAnswers() {

  const resultScreen =
    document.getElementById("resultScreen");


  let oldAnswers =
    document.getElementById("answerReview");


  // If already open, close it

  if (oldAnswers) {

    oldAnswers.remove();

    document
      .getElementById("viewAnswersButton")
      .textContent =
      "View your answers ↓";

    return;

  }


  const review =
    document.createElement("div");


  review.id =
    "answerReview";


  review.className =
    "answer-review";


  const title =
    document.createElement("h3");


  title.textContent =
    "Your answers";


  review.appendChild(title);


  let currentCategory =
    "";


  questions.forEach((item, i) => {

    const questionText =
      item[0];

    const category =
      item[1];


    // Add category heading

    if (category !== currentCategory) {

      currentCategory =
        category;


      const categoryHeading =
        document.createElement("div");


      categoryHeading.className =
        "answer-category";


      categoryHeading.textContent =
        category;


      review.appendChild(
        categoryHeading
      );

    }


    const answerA =
      answers[0][i];

    const answerB =
      answers[1][i];


    const difference =
      Math.abs(answerA - answerB);


    let similarity;


    if (difference === 0) {

      similarity = 100;

    }

    else if (difference === 1) {

      similarity = 60;

    }

    else if (difference === 2) {

      similarity = 30;

    }

    else if (difference === 3) {

      similarity = 10;

    }

    else {

      similarity = 0;

    }


    const answerBox =
      document.createElement("div");


    answerBox.className =
      "answer-review-box";


    answerBox.innerHTML = `

      <p class="review-question">
        ${i + 1}. ${questionText}
      </p>

      <div class="review-answers">

        <div>
          <strong>${names[0]}</strong>
          <span>${answerA}/5</span>
        </div>

        <div>
          <strong>${names[1]}</strong>
          <span>${answerB}/5</span>
        </div>

      </div>

      <div class="review-similarity">
        ${similarity}% similarity
      </div>

    `;


    review.appendChild(
      answerBox
    );

  });


  const viewButton =
    document.getElementById(
      "viewAnswersButton"
    );


  resultScreen.insertBefore(
    review,
    viewButton.nextSibling
  );


  viewButton.textContent =
    "Hide your answers ↑";

}


// ================================
// ANIMATE PERCENTAGE
// ================================

function animatePercentage(
  finalNumber
) {

  const element =
    document.getElementById(
      "percentage"
    );


  let current = 0;


  const interval =
    setInterval(() => {

      current += 2;


      if (current >= finalNumber) {

        current =
          finalNumber;

        clearInterval(
          interval
        );

      }


      element.textContent =
        current + "%";


    }, 20);

}

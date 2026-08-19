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

  document
    .getElementById("startScreen")
    .classList.add("hidden");

  document
    .getElementById("quizScreen")
    .classList.remove("hidden");

  person = 0;
  question = 0;

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

  document
    .querySelectorAll(".answers button")
    .forEach(button => {

      button.style.background = "";
      button.style.color = "";

    });
}

function chooseAnswer(value, button) {

  answers[person][question] = value;

  document
    .querySelectorAll(".answers button")
    .forEach(btn => {

      btn.style.background = "";
      btn.style.color = "";

    });

  button.style.background = "#5b5bea";
  button.style.color = "white";

  setTimeout(() => {

    question++;

    if (question >= questions.length) {

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

      } else {

        calculateResult();

      }

    } else {

      showQuestion();

    }

  }, 250);
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

    /*
      Same answer = 100%
      1 point apart = 75%
      2 points apart = 50%
      3 points apart = 25%
      Completely opposite = 0%
    */

    const similarityPercentage =
      ((4 - difference) / 4) * 100;

    totalSimilarity += similarityPercentage;

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

  document
    .getElementById("quizScreen")
    .classList.add("hidden");

  document
    .getElementById("resultScreen")
    .classList.remove("hidden");

  document.getElementById("resultNames").textContent =
    names[0] + " + " + names[1];

  document.getElementById("percentage").textContent =
    "0%";

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
      "Your answers were very different! According to this questionnaire, you two are bringing very different personalities to the friendship.";

  }

  document
    .getElementById("resultDescription")
    .textContent = description;

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

  animatePercentage(percentage);
}

function animatePercentage(finalNumber) {

  const element =
    document.getElementById("percentage");

  let current = 0;

  const interval =
    setInterval(() => {

      current += 2;

      if (current >= finalNumber) {

        current = finalNumber;
        clearInterval(interval);

      }

      element.textContent =
        current + "%";

    }, 20);
}

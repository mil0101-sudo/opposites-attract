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

const labels = [
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

/* START BUTTON */

document.addEventListener("DOMContentLoaded", function () {

const startButton = document.querySelector(".primary-button");

if (!startButton) {
alert("ERROR: Start button not found");
return;
}

startButton.addEventListener("click", startTest);

});

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
(question + 1) + " / " + questions.length;

document.getElementById("categoryLabel").textContent =
current[1];

document.getElementById("questionText").textContent =
current[0];

document.getElementById("progressBar").style.width =
((question + 1) / questions.length * 100) + "%";

document.querySelectorAll(".answers button").forEach(function(button) {
button.classList.remove("selected");
});

document.getElementById("nextButton").disabled = true;
}

/* ANSWER BUTTONS */

document.addEventListener("click", function(event) {

const button = event.target.closest(".answers button");

if (!button) {
return;
}

const buttons = Array.from(
document.querySelectorAll(".answers button")
);

const number = buttons.indexOf(button) + 1;

if (number >= 1 && number <= 5) {
chooseAnswer(number, button);
}

});

function chooseAnswer(value, button) {

answers[person][question] = value;

document.querySelectorAll(".answers button").forEach(function(btn) {
btn.classList.remove("selected");
});

button.classList.add("selected");

document.getElementById("nextButton").disabled = false;
}

/* NEXT BUTTON */

document.addEventListener("click", function(event) {

if (event.target.closest("#nextButton")) {
nextQuestion();
}

});

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

```
person = 1;
question = 0;

alert(
  "Friend 1 is finished!\n\n" +
  "Pass the device to " +
  names[1] +
  " now."
);

showQuestion();

return;
```

}

calculateResult();
}

/* RESULTS */

function calculateResult() {

let differenceTotal = 0;

questions.forEach(function(item, index) {

```
differenceTotal += Math.abs(
  answers[0][index] - answers[1][index]
);
```

});

const maximumDifference =
questions.length * 4;

const percentage = Math.round(
100 - (differenceTotal / maximumDifference * 100)
);

showResult(percentage);
}

function showResult(percentage) {

document.getElementById("quizScreen").classList.add("hidden");

document.getElementById("resultScreen").classList.remove("hidden");

document.getElementById("resultNames").textContent =
names[0] + " + " + names[1];

document.getElementById("percentage").textContent =
percentage + "%";

document.getElementById("resultDescription").textContent =
getDescription(percentage);
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
return "You're a pretty balanced mix of similarities and differences.";
}

if (score >= 25) {
return "You two definitely have some opposite personalities!";
}

return "You really are opposites!";
}

/* KEYBOARD */

document.addEventListener("keydown", function(event) {

const quiz =
document.getElementById("quizScreen");

if (!quiz || quiz.classList.contains("hidden")) {
return;
}

if (event.key === "Enter") {

```
const next =
  document.getElementById("nextButton");

if (next && !next.disabled) {
  nextQuestion();
}

return;
```

}

if (["1", "2", "3", "4", "5"].includes(event.key)) {

```
const number = Number(event.key);

const buttons =
  document.querySelectorAll(".answers button");

if (buttons[number - 1]) {

  chooseAnswer(
    number,
    buttons[number - 1]
  );

}
```

}

});

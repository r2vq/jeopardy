let board = document.getElementById("board");
let clue = document.getElementById("clue");
let dailyDouble = document.getElementById("dailyDouble");

data.forEach((categoryItem) => {
  let column = document.createElement("div");
  column.classList.add("column");

  let category = document.createElement("div");
  category.classList.add("category");
  category.classList.add("tile");
  category.innerHTML = categoryItem.name;
  column.appendChild(category);

  categoryItem.answers.forEach((answerItem) => {
    let answer = document.createElement("div");
    answer.classList.add("tile");
    answer.classList.add("answer");
    answer.classList.add("dollar");
    answer.innerHTML = answerItem.value;

    answer.addEventListener("click", onAnswerClick(answer, answerItem));
    column.appendChild(answer);
  });
  board.appendChild(column);
});

function onAnswerClick(answer, answerItem) {
  let showClue = function(event) {
    answer.removeEventListener("click", showClue);
    answer.addEventListener("click", hideClue);

    clue.innerHTML = answerItem.answer;

    board.classList.add("hidden");

    if (answerItem.isDailyDouble) {
      dailyDouble.classList.remove("hidden");
      dailyDouble.classList.add("rotate");
    } else {
      clue.classList.remove("hidden");
      clue.classList.add("grow");
    }
    answer.classList.add("answered");
    answer.classList.remove("answer");
    answer.classList.remove("dollar");
  };
  let hideClue = function(event) {
    answer.removeEventListener("click", hideClue);
    answer.addEventListener("click", showClue);
    answer.classList.remove("answered");
    answer.classList.add("answer");
    answer.classList.add("dollar");
  }
  return showClue;
};

function removeAnimation(element, animation) {
  return function(event) {
    element.classList.remove(animation);
  }
}

clue.addEventListener("click", () => {
  board.classList.remove("hidden");
  clue.classList.add("hidden");
});

clue.addEventListener("webkitTransitionEnd", removeAnimation(clue, "grow"));
clue.addEventListener("transitionEnd", removeAnimation(clue, "grow"));
dailyDouble.addEventListener("webkitTransitionEnd", removeAnimation(dailyDouble, "rotate"));
dailyDouble.addEventListener("transitionEnd", removeAnimation(dailyDouble, "rotate"));

dailyDouble.addEventListener("click", () => {
  dailyDouble.classList.add("hidden");
  clue.classList.remove("hidden");
});

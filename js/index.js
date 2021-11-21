let board = document.getElementById("board");
let clue = document.getElementById("clue");
let dailyDouble = document.getElementById("dailyDouble");
let splash = document.getElementById("splash");
let createForm = document.getElementById("createForm");

splash.addEventListener("change", e => {
  let file = e.target.files[0];
  if (file && file.name) {
    file.text().then(result => {
      let data = JSON.parse(result);
      playGame(data);
    })
  }
})

document.getElementById("createGame").addEventListener("click", e => {
  hide(splash);
  show(createForm);
});

function playGame(data) {
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
  hide(splash);
  show(board);
}

function onAnswerClick(answer, answerItem) {
  let showClue = function(event) {
    answer.removeEventListener("click", showClue);
    answer.addEventListener("click", hideClue);

    clue.innerHTML = answerItem.answer;

    hide(board);

    if (answerItem.isDailyDouble) {
      show(dailyDouble);
      addAnimation(dailyDouble, "rotate");
    } else {
      show(clue);
      addAnimation(clue, "grow");
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

function addAnimation(element, animation) {
  element.classList.add(animation);
}

function onRemoveAnimation(element, animation) {
  return function(event) {
    element.classList.remove(animation);
  }
}

clue.addEventListener("click", () => {
  show(board);
  hide(clue);
});

clue.addEventListener("webkitTransitionEnd", onRemoveAnimation(clue, "grow"));
clue.addEventListener("transitionEnd", onRemoveAnimation(clue, "grow"));
dailyDouble.addEventListener("webkitTransitionEnd", onRemoveAnimation(dailyDouble, "rotate"));
dailyDouble.addEventListener("transitionEnd", onRemoveAnimation(dailyDouble, "rotate"));

dailyDouble.addEventListener("click", () => {
  hide(dailyDouble);
  show(clue);
});

function hide(element) {
  element.classList.add("hidden");
}

function show(element) {
  element.classList.remove("hidden");
}

let board = document.getElementById("board");
let clue = document.getElementById("clue");
let createForm = document.getElementById("createForm");
let createGameButton = document.getElementById("createGame");
let dailyDouble = document.getElementById("dailyDouble");
let question = document.getElementById("question");
let splash = document.getElementById("splash");
let form = document.getElementById("create");
let categoryCount = 6;
let clueCount = 5;

// Event Listeners
function onAnswerClick(answer, answerItem) {
  let showClue = event => {
    answer.removeEventListener("click", showClue);
    answer.addEventListener("click", hideClue);

    clue.innerHTML = answerItem.answer;
    question.innerHTML = answerItem.question;

    if (answerItem.isDailyDouble) {
      transition(board, dailyDouble)();
      addClass(dailyDouble, "rotate");
    } else {
      transition(board, clue)();
      addClass(clue, "grow");
    }
    addClass(answer, "answered");
    removeClass(answer, "answer");
    removeClass(answer, "dollar");
  };
  let hideClue = event => {
    answer.removeEventListener("click", hideClue);
    answer.addEventListener("click", showClue);
    removeClass(answer, "answered");
    addClass(answer, "answer");
    addClass(answer, "dollar");
  }
  return showClue;
}

function onRemoveAnimation(element, animation) {
  return event => removeClass(element, animation);
}

function transition(from, to) {
  return () => {
    hide(from);
    show(to);
  };
}

function onFileUploaded(e) {
  let file = e.target.files[0];
  if (file && file.name) {
    file.text().then(result => {
      let data = JSON.parse(result);
      playGame(data);
    })
  }
}

function onCreateGameButtonClick() {
  createFormQuestions();
  transition(splash, createForm)();
}

function onDownloadClick(e) {
  e.preventDefault();
  let name = document.getElementById("gameName").value;

  let data = [];
  for (let i = 0; i < categoryCount; i++) {
    let cat = "cat" + i;
    let answers = [];
    for (let j = 0; j < clueCount; j++) {
      answers.push({
        answer: document.getElementById(cat + "clue" + j).value,
        question: document.getElementById(cat + "question" + j).value,
        value: document.getElementById(cat + "price" + j).value,
        isDailyDouble: document.getElementById(cat + "daily" + j).checked,
      });
    }

    let category = {
      name: document.getElementById(cat).value,
      answers: answers
    };
    data.push(category);
  }

  if (name) {
    download(JSON.stringify(data), name + ".jsonpardy", "text/plain");
  } else {
    alert("Please enter a name!");
  }
}

// Element Helpers
function hide(element) {
  addClass(element, "hidden");
}

function show(element) {
  removeClass(element, "hidden");
}

function addAttribute(element, attribute) {
  element.setAttribute(attribute.name, attribute.value);
}

function addClass(element, className) {
  element.classList.add(className);
}

function removeClass(element, className) {
  element.classList.remove(className);
}

// Create Elements
function createElement(name, attributes, classes) {
  let element = document.createElement(name);
  if (attributes) {
    attributes.forEach(attribute => {
      addAttribute(element, attribute);
    });
  }
  if (classes) {
    classes.forEach(className => {
      addClass(element, className)
    });
  }
  return element;
}

function createInput(inputId, inputType, inputClass, labelText, labelClass, parent) {
  let inputLabel = createElement(
    "label",
    [attr("for", inputId)],
    [labelClass]
  );
  inputLabel.innerHTML = labelText;
  parent.appendChild(inputLabel);
  let input = createElement(
    "input",
    [attr("type", inputType)],
    inputClass ? [inputClass] : []
  );
  input.id = inputId;
  parent.appendChild(input);
}

function attr(name, value) {
  return {
    name: name,
    value: value
  };
}

function createFormQuestions() {
  let oldJeopardyButton = createElement("button", [], ["scoreButton"]);
  oldJeopardyButton.id = "oldJeopardyButton";
  oldJeopardyButton.innerHTML = "Populate Old Jeopardy Scores";
  form.appendChild(oldJeopardyButton);

  let jeopardyButton = createElement("button", [], ["scoreButton"]);
  jeopardyButton.id = "jeopardyButton";
  jeopardyButton.innerHTML = "Populate Regular Jeopardy Scores";
  form.appendChild(jeopardyButton);

  let doubleJeopardyButton = createElement("button", [], ["scoreButton"]);
  doubleJeopardyButton.id = "doubleJeopardyButton";
  doubleJeopardyButton.innerHTML = "Populate DOUBLE Jeopardy Scores"
  form.appendChild(doubleJeopardyButton);

  let formQuestions = createElement("div", [], ["formQuestions"]);
  form.appendChild(formQuestions);

  for (let i = 0; i < categoryCount; i++) {
    let cat = "cat" + i;

    let catDiv = createElement("div", [], ["formSection"]);
    formQuestions.appendChild(catDiv);

    createInput(cat, "text", null, "Category " + (i + 1), "categoryLabel", catDiv);
    for (let j = 0; j < clueCount; j++) {
      createInput(cat + "clue" + j, "text", "clueInput", "Clue " + (j + 1), "clueLabel", catDiv);
      createInput(cat + "question" + j, "text", "questionInput", "Expected Response", "questionLabel", catDiv);
      createInput(cat + "price" + j, "text", "priceInput", "Price", "priceLabel", catDiv);
      createInput(cat + "daily" + j, "checkbox", "dailyInput", "Daily Double?", "dailyDoubleLabel", catDiv);
    }
  }

  let gameNameSection = createElement("div", [], ["gameNameSection"]);
  form.appendChild(gameNameSection);
  createInput("gameName", "text", "gameNameInput", "File Name", "gameNameLabel", gameNameSection);

  createInput("download", "submit", null, "Download Game", "download", form);
}

// User Actions
function download(content, fileName, contentType) {
  let a = createElement("a");
  let file = new Blob([content], {
    type: contentType
  });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function playGame(data) {
  data.forEach((categoryItem) => {
    let column = createElement("div", [], ["column"]);

    let category = createElement("div", [], ["category", "tile"]);
    category.innerHTML = categoryItem.name;
    column.appendChild(category);

    categoryItem.answers.forEach((answerItem) => {
      let answer = createElement("div", [], ["tile", "answer", "dollar"]);
      answer.innerHTML = answerItem.value;

      answer.addEventListener("click", onAnswerClick(answer, answerItem));
      column.appendChild(answer);
    });
    board.appendChild(column);
  });
  transition(splash, board)();
}

function populateScores(base) {
  for (let i = 0; i < categoryCount; i++) {
    for (let j = 0; j < clueCount; j++) {
      let price = (j + 1) * base;
      document.getElementById("cat" + i + "price" + j).value = price;
    }
  }
}

// Event Listeners
clue.addEventListener("click", transition(clue, question));
clue.addEventListener("webkitTransitionEnd", onRemoveAnimation(clue, "grow"));
clue.addEventListener("transitionEnd", onRemoveAnimation(clue, "grow"));

question.addEventListener("click", transition(question, board));

dailyDouble.addEventListener("webkitTransitionEnd", onRemoveAnimation(dailyDouble, "rotate"));
dailyDouble.addEventListener("transitionEnd", onRemoveAnimation(dailyDouble, "rotate"));
dailyDouble.addEventListener("click", transition(dailyDouble, clue));

createGameButton.addEventListener("click", onCreateGameButtonClick);

splash.addEventListener("change", onFileUploaded);

document.addEventListener("click", e => {
  let element = e.target;
  switch (element.id) {
    case "download":
      onDownloadClick();
      break;
    case "oldJeopardyButton":
      e.preventDefault();
      populateScores(100);
      break;
    case "jeopardyButton":
      e.preventDefault();
      populateScores(200);
      break;
    case "doubleJeopardyButton":
      e.preventDefault();
      populateScores(400);
      break;
  }
  if (element.id == "download") {
    onDownloadClick();
  }
});

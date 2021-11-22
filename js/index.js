let board = document.getElementById("board");
let clue = document.getElementById("clue");
let createForm = document.getElementById("createForm");
let dailyDouble = document.getElementById("dailyDouble");
let question = document.getElementById("question");
let splash = document.getElementById("splash");
let form = document.getElementById("create");

createFormQuestions();

function createFormQuestions() {
  let formQuestions = document.createElement("div");
  addClass(formQuestions, "formQuestions");
  form.appendChild(formQuestions);

  for (let i = 0; i < 6; i++) {
    let cat = "cat" + i;

    let catDiv = document.createElement("div");
    addClass(catDiv, "formSection");
    formQuestions.appendChild(catDiv);

    createInput(cat, "text", null, "Category " + (i + 1), "categoryLabel", catDiv);
    for (let j = 0; j < 5; j++) {
      createInput(cat + "clue" + j, "text", "clueInput", "Clue " + (j + 1), "clueLabel", catDiv);
      createInput(cat + "question" + j, "text", "questionInput", "Expected Response", "questionLabel", catDiv);
      createInput(cat + "price" + j, "text", "priceInput", "Price", "priceLabel", catDiv);
      createInput(cat + "daily" + j, "checkbox", "dailyInput", "Daily Double?", "dailyDoubleLabel", catDiv);
    }
  }

  let gameNameSection = document.createElement("div");
  addClass(gameNameSection, "gameNameSection");
  form.appendChild(gameNameSection);
  createInput("gameName", "text", "gameNameInput", "File Name", "gameNameLabel", gameNameSection);

  createInput("download", "submit", null, "Download Game", "download", form);
  setDownloadClickListener();
}

function createInput(inputId, inputType, inputClass, labelText, labelClass, parent) {
  let inputLabel = document.createElement("label");
  addAttribute(inputLabel, "for", inputId);
  addClass(inputLabel, labelClass);
  inputLabel.innerHTML = labelText;
  parent.appendChild(inputLabel);
  let input = document.createElement("input");
  input.id = inputId;
  addAttribute(input, "type", inputType);
  if (inputClass) {
    addClass(input, inputClass);
  }
  parent.appendChild(input);
}

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

function setDownloadClickListener() {
  document.getElementById("download").addEventListener("click", e => {
    e.preventDefault();
    let name = document.getElementById("gameName").value;

    let data = [];
    for(let i = 0; i < 6; i++) {
      let cat = "cat" + i;
      let answers = [];
      for(let j = 0; j < 5; j++) {
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
  });
}

function download(content, fileName, contentType) {
  let a = document.createElement("a");
  let file = new Blob([content], {
    type: contentType
  });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

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
    question.innerHTML = answerItem.question;

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
  addClass(element, animation);
}

function addAttribute(element, attribute, value) {
  element.setAttribute(attribute, value);
}

function addClass(element, className) {
  element.classList.add(className);
}

function onRemoveAnimation(element, animation) {
  return function(event) {
    element.classList.remove(animation);
  }
}

clue.addEventListener("click", () => {
  show(question);
  hide(clue);
});

question.addEventListener("click", () => {
  show(board);
  hide(question);
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
  addClass(element, "hidden");
}

function show(element) {
  element.classList.remove("hidden");
}

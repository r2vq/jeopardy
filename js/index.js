let config = {
  categoryCount: 6,
  clueCount: 5,
  animationTime: 85,
  version: "v0.5.2"
};

let board = document.getElementById("board");
let clue = document.getElementById("clue");
let createForm = document.getElementById("createForm");
let dailyDouble = document.getElementById("dailyDouble");
let question = document.getElementById("question");
let splash = document.getElementById("splash");

/****************************
 * General Helper functions *
 ****************************/

Array.prototype.shuffle = function() {
  let output = [...this];
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = output[i];
    output[i] = output[j];
    output[j] = temp;
  }
  return output;
};

HTMLElement.prototype.addChild = function(name) {
  let element = document.createElement(name);
  this.appendChild(element);
  return element;
};

HTMLElement.prototype.addInputChild = function(inputId, inputType, inputClass, labelText, labelClass) {
  this.addChild("label")
    .setProperty("for", inputId)
    .addClass(labelClass)
    .setText(labelText);

  let input = this.addChild("input")
    .setProperty("type", inputType)
    .setId(inputId);
  if (inputClass) {
    input.addClass(inputClass);
  }

  return input;
}

HTMLElement.prototype.addClass = function(className) {
  this.classList.add(className);
  return this;
};

HTMLElement.prototype.removeClass = function(className) {
  this.classList.remove(className);
  return this;
};

HTMLDocument.prototype.on = function(eventName, callback) {
  this.addEventListener(eventName, callback);
  return this;
};

HTMLElement.prototype.on = function(eventName, callback) {
  this.addEventListener(eventName, callback);
  return this;
};

HTMLElement.prototype.off = function(eventName, callback) {
  this.removeEventListener(eventName, callback);
  return this;
};

HTMLElement.prototype.setId = function(id) {
  this.id = id;
  return this;
};

HTMLElement.prototype.setProperty = function(name, value) {
  this.setAttribute(name, value);
  return this;
};

HTMLElement.prototype.setStyle = function(jsName, value) {
  this.style[jsName] = value;
  return this;
};

HTMLElement.prototype.setText = function(text) {
  this.innerText = text;
  return this;
};

/******************************
 * General Callback Functions *
 ******************************/

splash.on("change", (e) => {
  let file = e.target.files[0];
  if (file && file.name) {
    file.text().then(result => {
      let data = JSON.parse(result);
      playGame(data);
    })
  }
});

document.on("click", e => {
  let element = e.target;
  switch (element.id) {
    case "clue":
      transition(clue, question);
      break;
    case "createGame":
      createFormQuestions();
      break;
    case "dailyDouble":
      transition(dailyDouble, clue);
      break;
    case "download":
      e.preventDefault();
      download();
      break;
    case "question":
      transition(question, board);
      break;
    case "doubleJeopardyButton":
      e.preventDefault();
      populateScores(400);
      break;
    case "jeopardyButton":
      e.preventDefault();
      populateScores(200);
      break;
    case "oldJeopardyButton":
      e.preventDefault();
      populateScores(100);
      break;
  }
});

/*******************
 * General Actions *
 *******************/

function createSplash() {
  splash.addChild("div")
    .addClass("header")
    .setText("Let's play Jeopardy!");

  splash.addChild("div")
    .addClass("subheader")
    .setText(config.version);

  let splashForm = splash.addChild("form")
    .setId("splashForm");
  splashForm.addInputChild("uploadFile", "file", null, "Upload Existing Game", "uploadFile")
    .setProperty("name", "uploadFile")
    .setProperty("accept", ".jsonpardy");
  splashForm.addInputChild("createGame", "button", null, "Create New Game", "createGame")
    .setProperty("name", "createGame");
}

function transition(from, to) {
  from.addClass("hidden");
  to.removeClass("hidden");
}

/*************************
 * Game Helper Functions *
 *************************/

HTMLElement.prototype.setOnAnswerClick = function(answerItem) {
  // Hide the dollar, show the clue screen, swap callback to hideClue
  let showClue = event => {
    this.off("click", showClue)
      .on("click", hideClue);
    clue.setText(answerItem.answer);
    question.setText(answerItem.question);
    if (answerItem.isDailyDouble) {
      playAudio("snd/daily-double.mp3", 0.25);
      transition(board, dailyDouble);
      dailyDouble.addClass("rotate");
    } else {
      transition(board, clue);
      clue.addClass("grow");
    }
    this.addClass("answered")
      .removeClass("answer")
      .removeClass("dollar");
  };

  // Show the dollar, swap callback to showClue
  let hideClue = event => {
    this.off("click", hideClue)
      .on("click", showClue)
      .removeClass("answered")
      .addClass("answer")
      .addClass("dollar");
  }

  return this.on("click", showClue);
};

HTMLElement.prototype.setOnRemoveAnimation = function(animation) {
  let onRemoveAnimation = () => {
    this.removeClass(animation);
  };
  return this.on("animationend", onRemoveAnimation)
    .on("webkitAnimationEnd", onRemoveAnimation);
};

/****************
 * Game Actions *
 ****************/

function playGame(data) {
  clue.setOnRemoveAnimation("grow");

  dailyDouble.setText("DAILY DOUBLE");
  dailyDouble.setOnRemoveAnimation("rotate");

  let categories = [];
  let clues = [];
  let maxRows = 0;
  data.forEach((categoryItem, column) => {
    let category = board.addChild("div")
      .addClass("tile")
      .addClass("category")
      .addClass("loadingCategory")
      .setText(categoryItem.name)
      .setStyle("gridColumn", column + 1)
      .setStyle("gridRow", 1);

    let categoryCover = category.addChild("div")
      .addClass("cover")
      .on("animationend", () => category.removeClass("loadingCategory"))
      .on("webkitAnimationEnd", () => category.removeClass("loadingCategory"));

    categories.push(category);
    categoryItem.answers.forEach((answerItem, row) => {
      let answer = board.addChild("div")
        .addClass("tile")
        .addClass("loadingTile")
        .setText(answerItem.value)
        .setOnAnswerClick(answerItem)
        .setStyle("gridColumn", column + 1)
        .setStyle("gridRow", row + 2);
      clues.push(answer);
    });
    maxRows = Math.max(maxRows, categoryItem.answers.length);
  });

  board.setStyle("gridTemplateColumns", `repeat(${data.length}, 1fr)`)
    .setStyle("gridTemplateRows", `repeat(${maxRows + 1}, 1fr)`);

  setTimeout(() => {
    clues.flatMap(e => e)
      .shuffle()
      .forEach((tile, i) => {
        setTimeout(() => {
          tile.removeClass("loadingTile")
            .addClass("answer")
            .addClass("dollar");
        }, config.animationTime * i);
      });

    playAudio("snd/board-fill.mp3");
    categories.forEach((tile, i) => {
      setTimeout(() => {
        tile.querySelector(".cover")
          .addClass("fadeOut");
      }, config.animationTime * clues.length + config.animationTime * 10 * (i + 1));
    });
  }, config.animationTime * 5);
  transition(splash, board);
}

function playAudio(url, volume) {
  let sound = new Audio(url);
  if (volume) {
    sound.volume = volume;
  }
  sound.play();
}

/****************
 * Form Actions *
 ****************/

function createFormQuestions() {
  createForm.addChild("h1")
    .setText("Create A New Game From Scratch");

  let form = createForm.addChild("form")
    .setId("create")
    .addClass("createForm");

  form.addChild("button")
    .addClass("scoreButton")
    .setId("oldJeopardyButton")
    .setText("Populate Old Jeopardy Scores");

  form.addChild("button")
    .addClass("scoreButton")
    .setId("jeopardyButton")
    .setText("Populate Regular Jeopardy Scores");

  form.addChild("button")
    .addClass("scoreButton")
    .setId("doubleJeopardyButton")
    .setText("Populate DOUBLE Jeopardy Scores");

  let formQuestions = form.addChild("div")
    .addClass("formQuestions");

  for (let i = 0; i < config.categoryCount; i++) {
    let cat = "cat" + i;

    let catDiv = formQuestions.addChild("div")
      .addClass("formSection");

    catDiv.addInputChild(cat, "text", null, "Category " + (i + 1), "categoryLabel");
    for (let j = 0; j < config.clueCount; j++) {
      catDiv.addInputChild(cat + "clue" + j, "text", "clueInput", "Clue " + (j + 1), "clueLabel");
      catDiv.addInputChild(cat + "question" + j, "text", "questionInput", "Expected Response", "questionLabel");
      catDiv.addInputChild(cat + "price" + j, "text", "priceInput", "Price", "priceLabel");
      catDiv.addInputChild(cat + "daily" + j, "checkbox", "dailyInput", "Daily Double?", "dailyDoubleLabel");
    }
  }

  form.addChild("div")
    .addClass("gameNameSection")
    .addInputChild("gameName", "text", "gameNameInput", "File Name", "gameNameLabel");

  form.addInputChild("download", "submit", null, "Download Game", "download");

  transition(splash, createForm);
}

function populateScores(base) {
  for (let i = 0; i < config.categoryCount; i++) {
    for (let j = 0; j < config.clueCount; j++) {
      let price = (j + 1) * base;
      document.getElementById("cat" + i + "price" + j).value = price;
    }
  }
}

function download() {
  let name = document.getElementById("gameName").value;

  let data = [];
  for (let i = 0; i < config.categoryCount; i++) {
    let cat = "cat" + i;
    let answers = [];
    for (let j = 0; j < config.clueCount; j++) {
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
    let a = document.createElement("a");
    let file = new Blob([JSON.stringify(data)], {
      type: "text/plain"
    });
    a.href = URL.createObjectURL(file);
    a.download = name + ".jsonpardy";
    a.click();
  } else {
    alert("Please enter a name!");
  }
}

/***************
 * Main Method *
 ***************/
(() => {
  createSplash();
})();

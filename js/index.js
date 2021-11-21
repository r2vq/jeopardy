let board = document.getElementById("board");
let clue = document.getElementById("clue");
let createForm = document.getElementById("createForm");
let dailyDouble = document.getElementById("dailyDouble");
let question = document.getElementById("question");
let splash = document.getElementById("splash");

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

document.getElementById("download").addEventListener("click", e => {
  e.preventDefault();
  let name = document.getElementById("gameName").value;

  let data = [{
      name: document.getElementById("cat1").value,
      answers: [
        {
          answer: document.getElementById("cat1clue1").value,
          question: document.getElementById("cat1question1").value,
          value: document.getElementById("cat1price1").value,
          isDailyDouble: document.getElementById("cat1daily1").checked
        },
        {
          answer: document.getElementById("cat1clue2").value,
          question: document.getElementById("cat1question2").value,
          value: document.getElementById("cat1price2").value,
          isDailyDouble: document.getElementById("cat1daily2").checked
        },
        {
          answer: document.getElementById("cat1clue3").value,
          question: document.getElementById("cat1question3").value,
          value: document.getElementById("cat1price3").value,
          isDailyDouble: document.getElementById("cat1daily3").checked
        },
        {
          answer: document.getElementById("cat1clue4").value,
          question: document.getElementById("cat1question4").value,
          value: document.getElementById("cat1price4").value,
          isDailyDouble: document.getElementById("cat1daily4").checked
        },
        {
          answer: document.getElementById("cat1clue5").value,
          question: document.getElementById("cat1question5").value,
          value: document.getElementById("cat1price5").value,
          isDailyDouble: document.getElementById("cat1daily5").checked
        },
      ]
    },
    {
      name: document.getElementById("cat2").value,
      answers: [
        {
          answer: document.getElementById("cat2clue1").value,
          question: document.getElementById("cat2question1").value,
          value: document.getElementById("cat2price1").value,
          isDailyDouble: document.getElementById("cat2daily1").checked
        },
        {
          answer: document.getElementById("cat2clue2").value,
          question: document.getElementById("cat2question2").value,
          value: document.getElementById("cat2price2").value,
          isDailyDouble: document.getElementById("cat2daily2").checked
        },
        {
          answer: document.getElementById("cat2clue3").value,
          question: document.getElementById("cat2question3").value,
          value: document.getElementById("cat2price3").value,
          isDailyDouble: document.getElementById("cat2daily3").checked
        },
        {
          answer: document.getElementById("cat2clue4").value,
          question: document.getElementById("cat2question4").value,
          value: document.getElementById("cat2price4").value,
          isDailyDouble: document.getElementById("cat2daily4").checked
        },
        {
          answer: document.getElementById("cat2clue5").value,
          question: document.getElementById("cat2question5").value,
          value: document.getElementById("cat2price5").value,
          isDailyDouble: document.getElementById("cat2daily5").checked
        },
      ]
    },
    {
      name: document.getElementById("cat3").value,
      answers: [
        {
          answer: document.getElementById("cat3clue1").value,
          question: document.getElementById("cat3question1").value,
          value: document.getElementById("cat3price1").value,
          isDailyDouble: document.getElementById("cat3daily1").checked
        },
        {
          answer: document.getElementById("cat3clue2").value,
          question: document.getElementById("cat3question2").value,
          value: document.getElementById("cat3price2").value,
          isDailyDouble: document.getElementById("cat3daily2").checked
        },
        {
          answer: document.getElementById("cat3clue3").value,
          question: document.getElementById("cat3question3").value,
          value: document.getElementById("cat3price3").value,
          isDailyDouble: document.getElementById("cat3daily3").checked
        },
        {
          answer: document.getElementById("cat3clue4").value,
          question: document.getElementById("cat3question4").value,
          value: document.getElementById("cat3price4").value,
          isDailyDouble: document.getElementById("cat3daily4").checked
        },
        {
          answer: document.getElementById("cat3clue5").value,
          question: document.getElementById("cat3question5").value,
          value: document.getElementById("cat3price5").value,
          isDailyDouble: document.getElementById("cat3daily5").checked
        },
      ]
    },
    {
      name: document.getElementById("cat4").value,
      answers: [
        {
          answer: document.getElementById("cat4clue1").value,
          question: document.getElementById("cat4question1").value,
          value: document.getElementById("cat4price1").value,
          isDailyDouble: document.getElementById("cat4daily1").checked
        },
        {
          answer: document.getElementById("cat4clue2").value,
          question: document.getElementById("cat4question2").value,
          value: document.getElementById("cat4price2").value,
          isDailyDouble: document.getElementById("cat4daily2").checked
        },
        {
          answer: document.getElementById("cat4clue3").value,
          question: document.getElementById("cat4question3").value,
          value: document.getElementById("cat4price3").value,
          isDailyDouble: document.getElementById("cat4daily3").checked
        },
        {
          answer: document.getElementById("cat4clue4").value,
          question: document.getElementById("cat4question4").value,
          value: document.getElementById("cat4price4").value,
          isDailyDouble: document.getElementById("cat4daily4").checked
        },
        {
          answer: document.getElementById("cat4clue5").value,
          question: document.getElementById("cat4question5").value,
          value: document.getElementById("cat4price5").value,
          isDailyDouble: document.getElementById("cat4daily5").checked
        },
      ]
    },
    {
      name: document.getElementById("cat5").value,
      answers: [
        {
          answer: document.getElementById("cat5clue1").value,
          question: document.getElementById("cat5question1").value,
          value: document.getElementById("cat5price1").value,
          isDailyDouble: document.getElementById("cat5daily1").checked
        },
        {
          answer: document.getElementById("cat5clue2").value,
          question: document.getElementById("cat5question2").value,
          value: document.getElementById("cat5price2").value,
          isDailyDouble: document.getElementById("cat5daily2").checked
        },
        {
          answer: document.getElementById("cat5clue3").value,
          question: document.getElementById("cat5question3").value,
          value: document.getElementById("cat5price3").value,
          isDailyDouble: document.getElementById("cat5daily3").checked
        },
        {
          answer: document.getElementById("cat5clue4").value,
          question: document.getElementById("cat5question4").value,
          value: document.getElementById("cat5price4").value,
          isDailyDouble: document.getElementById("cat5daily4").checked
        },
        {
          answer: document.getElementById("cat5clue5").value,
          question: document.getElementById("cat5question5").value,
          value: document.getElementById("cat5price5").value,
          isDailyDouble: document.getElementById("cat5daily5").checked
        },
      ]
    },
    {
      name: document.getElementById("cat6").value,
      answers: [
        {
          answer: document.getElementById("cat6clue1").value,
          question: document.getElementById("cat6question1").value,
          value: document.getElementById("cat6price1").value,
          isDailyDouble: document.getElementById("cat6daily1").checked
        },
        {
          answer: document.getElementById("cat6clue2").value,
          question: document.getElementById("cat6question2").value,
          value: document.getElementById("cat6price2").value,
          isDailyDouble: document.getElementById("cat6daily2").checked
        },
        {
          answer: document.getElementById("cat6clue3").value,
          question: document.getElementById("cat6question3").value,
          value: document.getElementById("cat6price3").value,
          isDailyDouble: document.getElementById("cat6daily3").checked
        },
        {
          answer: document.getElementById("cat6clue4").value,
          question: document.getElementById("cat6question4").value,
          value: document.getElementById("cat6price4").value,
          isDailyDouble: document.getElementById("cat6daily4").checked
        },
        {
          answer: document.getElementById("cat6clue5").value,
          question: document.getElementById("cat6question5").value,
          value: document.getElementById("cat6price5").value,
          isDailyDouble: document.getElementById("cat6daily5").checked
        },
      ]
    },
  ];

  if (name) {
    download(JSON.stringify(data), name + ".jsonpardy", "text/plain");
  } else {
    alert("Please enter a name!");
  }
});

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
  element.classList.add(animation);
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
  element.classList.add("hidden");
}

function show(element) {
  element.classList.remove("hidden");
}

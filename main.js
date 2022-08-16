let countSpan = document.querySelector('.quiz-info .count span');
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let submitButton = document.querySelector('.submit-button');
let resultDiv = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
//Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;


function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(myRequest.responseText);
      let qCount = questionObject.length;

      //create Bullets + Set Questions Count
      createBullets(qCount);

      //Add Question Data
      addQuestionData(questionObject[currentIndex], qCount);

      // Start CountDown
      countdown(60 , qCount);

      //Click On Submit
      submitButton.addEventListener('click', () => {
        //Get the Right answer
        let theRightAnswer;
        if (currentIndex < qCount) {
           theRightAnswer = questionObject[currentIndex].right_answer;
        }
        //Increase Index
        currentIndex++;

        checkAnswer(theRightAnswer, qCount);

        //Remove Previous Question
        if (qCount > currentIndex) {
          quizArea.innerHTML = ``;
          answersArea.innerHTML = ``;
          addQuestionData(questionObject[currentIndex], qCount);
        }
        //Handle Bullets Classes
        handleBullets();

        //Start CountDown
        clearInterval(countdownInterval);
        countdown(60 , qCount);

        //Show Results
        showResults(qCount);
      });
    }
  };
  myRequest.open('GET', 'html_questions.json');
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  //create Spans
  for (let i = 0; i < num; i++) {
    //Create Bullet
    let theBullet = document.createElement('span');

    //Check if its First Span
    if (i === 0) {
      theBullet.className = 'on';
    }
    //Append Bullet to main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    //Create h2 Question Title
    let questionTitle = document.createElement('h2');

    //Create Question Text
    let questionText = document.createTextNode(obj['title']);
    //Append Text To h2
    questionTitle.appendChild(questionText);
    //Append h2 to quiz-area
    quizArea.appendChild(questionTitle);

    //Create the answers
    for (let i = 1; i <= 4; i++) {
      //Create Main Div
      let mainDiv = document.createElement('div');
      //Add class name to Main Div
      mainDiv.className = 'answer';

      //Create Radio Input
      let radioInput = document.createElement('input');

      //Add type + Name + Id + Data-Attribute
      radioInput.name = 'question';
      radioInput.type = `radio`;
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      //Make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }

      //Create Label
      let theLabel = document.createElement('label');

      //Add For Attribute
      theLabel.htmlFor = `answer_${i}`;

      //Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      //Add the Text to the Label
      theLabel.appendChild(theLabelText);

      //Add Input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      //Append All Divs To Answers Area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, qCount) {
  let answers = document.getElementsByName('question');
  let theChoosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll('.bullets .spans span');
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = 'on';
    }
  });
}

function showResults(count) {
    let theResults;
    if(currentIndex === count){
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        if(rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count} Is Good`;
        }else if (rightAnswers === count){
            theResults = `<span class="perfect">Perfect</span>, ${rightAnswers} From ${count} Is perfect`;
        }else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count} Is bad`;
        }
        resultDiv.innerHTML = theResults;
        resultDiv.style.padding = '5rem';
        resultDiv.style.textAlign = 'center';
    }
}

function countdown(duration , count){
    if(currentIndex < count){
        let minutes , seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}`: minutes; 
            seconds = seconds < 10 ? `0${seconds}`: seconds;
            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if(--duration < 0){
                clearInterval(countdownInterval);
                submitButton.click();
                console.log("Finished");
            }
        }, 1000)
    }
}
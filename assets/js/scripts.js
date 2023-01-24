let questNum = 0;

// question data
let trivia = [];
let question = "";
let correctQ = "";
let incorrectQ = [];
let choiceOne = document.querySelector("#choice-0");
let choiceTwo = document.querySelector("#choice-1");
let choiceThree = document.querySelector("#choice-2");
let choiceFour = document.querySelector("#choice-3");
let timeResult = document.querySelector("#time-score");
let scoreResult = document.querySelector("#question-score");

// scoreboard
let choice = "";
let wins = '';
let losses = '';

// timer data
let timeClock = document.getElementById('timer');
let timeLeft = 60;
let timeScore = '';

let enterScore = document.querySelector(".result-box");
let startButton = document.querySelector("#start-button");

function init() {
    localStorage.setItem("wins", '');
    localStorage.setItem("losses", '');
    localStorage.setItem("questions", '');
    scoresFetch();
    questFetch();
};

// when you hit the Start Game button.
function getGoing() {
    questNum = 0;
    localStorage.setItem("wins", 0);
    localStorage.setItem("losses", 0);
    getScores();
    document.querySelector(".playgame").setAttribute("style", "visibility: visible");
    // document.querySelector(".topscores").setAttribute("style", "visibility: visible");
    // document.querySelector(".scoreboard").setAttribute("style", "visibility: visible");
    renderQuestion();
    countdownClock();
};

// This gets the JSON of quetsions from the open Trivia DB
function questFetch() {
    fetch('https://opentdb.com/api.php?amount=10&type=multiple')
    .then((response) => response.json())
    .then((list) => localStorage.setItem("questions", JSON.stringify(list.results)));
};

function scoresFetch() {

};

// Timer increment
function countdownClock() {
    let timeInterval = setInterval(function () {
        if (timeLeft > 0 && questNum < 10) {
            timeClock.textContent = timeLeft;
            timeLeft--;
        } else if (timeLeft === 0) {
            clearInterval(timeInterval);
            highScore();
        }
    }, 1000);
};



// Turn question JSON in to Question objects
function renderQuestion() {
    // if (questNum < 10) {
    trivia = JSON.parse(localStorage.getItem("questions"));
        let triviaArray = trivia[questNum];
        let question = triviaArray.question;
        let correctQ = triviaArray.correct_answer;
        let incorrectQ = triviaArray.incorrect_answers;
        let choiceArray = [[correctQ, true], [incorrectQ[0],false],[incorrectQ[1],false],[incorrectQ[2],false]];

        document.querySelector("#question").textContent = questNum+1 + "/10 " + question;
        
        // Randomize choice array
        // for the randomization, I used a variation of the Durstenfeld shuffle and modified for my own needs.

        for (let i = choiceArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choiceArray[i], choiceArray[j]] = [choiceArray[j], choiceArray[i]];
        };

        localStorage.setItem("choiceList", JSON.stringify(choiceArray));
        choiceOne.textContent = choiceArray[0][0];
        choiceTwo.textContent = choiceArray[1][0];
        choiceThree.textContent = choiceArray[2][0];
        choiceFour.textContent = choiceArray[3][0];
        // choiceOne.setAttribute("class", "select");
        // choiceTwo.setAttribute("class", "select");
        // choiceThree.setAttribute("class", "select");
        // choiceFour.setAttribute("class", "select");
    // } else {
    //     // go to High Score.
    //     highScore();
    // };

};


// Calculate the Score Board
function getScores() {
    wins = localStorage.getItem("wins");
    losses = localStorage.getItem("losses");
    document.querySelector("#wins").textContent = "Wins: " + wins;
    document.querySelector("#losses").textContent = "Losses: " + losses;
};

// Determine Win or Loss

function scoreChoice() {
    scores = JSON.parse(localStorage.getItem("choiceList"));
    if(scores[choiceMade][1]) {
        console.log("Victory!");
        wins++;
        localStorage.setItem("wins", wins);
        questNum++;
        getScores();
        scoreCheck();
    } else {
        console.log("Failure!");
        losses++
        localStorage.setItem("losses", losses);
        // choiceTarget.setAttribute("class", "unselect");
        questNum++;
        getScores();
        scoreCheck();
        // Reduce Time
    };
};

function scoreCheck() {
    console.log(questNum);
    if (questNum < 10) {
        console.log("Keep going!");
        renderQuestion();
    } else if(questNum >= 10) {
        console.log("Yer done!");
        highScore();
    };
}


function highScore() {
    timeScore = 60 - timeLeft;
    console.log(timeScore);
    document.querySelector(".playgame").setAttribute("style","visibility: hidden;");
    // document.querySelector(".questionbox").setAttribute("style", "visibility: hidden");
    // document.querySelector(".choicebox").setAttribute("style", "visibility: hidden");
    enterScore.setAttribute("style","visibility: visible;");
    console.log("You finished in " + timeScore + " seconds!");
    timeResult.textContent = "You finished in " + timeScore + " seconds!";
    scoreResult.textContent = "Your score is " + wins + " correct and " + losses + " wrong!";

    
};

startButton.addEventListener("click",getGoing);
// Event listener to monitor which choice the user makes - found at https://davidwalsh.name/event-delegate;
document.getElementById("choices").addEventListener("click", function(choice) {
    if(choice.target && choice.target.nodeName == "LI") {
        console.log("List item ", choice.target.id.replace("choice-", ""), " was clicked!");
        choiceTarget = document.getElementById(choice.target.id);
        choiceMade = +choice.target.id.replace("choice-","");
        scoreChoice();
    }
})
;
//event listeners
init();
let questNum = 0;

// question data
let trivia = [];
let question = "";
let correctQ = "";
let incorrectQ = [];

// scoreboard
let choice = "";
let wins = '';
let losses = '';

// timer data
let timeClock = document.getElementById('timer');
let timeLeft = 10;

let startButton = document.querySelector("#start-button");

function init() {
    localStorage.clear();
    questFetch();
}

// when you hit the Start Game button.
function getGoing() {
    questNum = 0;
    localStorage.setItem("wins", 0);
    localStorage.setItem("losses", 0);
    getScores();
    renderQuestion();
    countdownClock();
}

// This gets the JSON of quetsions from the open Trivia DB
function questFetch() {
    fetch('https://opentdb.com/api.php?amount=10&type=multiple')
    .then((response) => response.json())
    .then((list) => localStorage.setItem("questions", JSON.stringify(list.results)));
};

// Timer increment
function countdownClock() {
    let timeInterval = setInterval(function () {
        if (timeLeft >= 1) {
            timeClock.textContent = timeLeft;
            timeLeft--;
        } else {
            timeClock.textContent = '';
            clearInterval(timeInterval);
            highScore();
        }
    }, 1000);
}



// Turn question JSON in to Question objects
function renderQuestion() {
    if (questNum < 10) {
    trivia = JSON.parse(localStorage.getItem("questions"));
        let triviaArray = trivia[questNum];
        let question = triviaArray.question;

        let correctQ = triviaArray.correct_answer;
        let incorrectQ = triviaArray.incorrect_answers;
        let choiceArray = [[correctQ, true], [incorrectQ[0],false],[incorrectQ[1],false],[incorrectQ[2],false]];

        document.querySelector("#question").textContent = question;
        
        // Randomize choice array
        // for the randomization, I used a variation of the Durstenfeld shuffle and modified for my own needs.

        for (let i = choiceArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choiceArray[i], choiceArray[j]] = [choiceArray[j], choiceArray[i]];
        };
        localStorage.setItem("choiceList", JSON.stringify(choiceArray));
        document.querySelector("#choice-0").textContent = choiceArray[0][0];
        document.querySelector("#choice-1").textContent = choiceArray[1][0];
        document.querySelector("#choice-2").textContent = choiceArray[2][0];
        document.querySelector("#choice-3").textContent = choiceArray[3][0];
    } else {
        // go to High Score.
        highScore();
    }

};

// Calculate the Score Board
function getScores() {
    wins = localStorage.getItem("wins");
    losses = localStorage.getItem("losses");

    document.querySelector("#wins").textContent = "Wins: " + wins;
    document.querySelector("#losses").textContent = "Losses: " + losses;
}

//event listeners

startButton.addEventListener("click",getGoing);


// Determine Win or Loss

function scoreChoice() {
    scores = JSON.parse(localStorage.getItem("choiceList"));
    console.log(scores);
    if(scores[choiceMade][1]) {
        console.log("Victory!");
        wins++;
        localStorage.setItem("wins", wins);
        questNum++;
        getScores();
        renderQuestion();
    } else {
        console.log("Failure!");
        losses++
        localStorage.setItem("losses", losses);
        questNum++;
        getScores();
        //Set chosen answer to disappear, and reduce time
    };
}

function wrongChoice() {


}


document.getElementById("choices").addEventListener("click", function(choice) {
    if(choice.target && choice.target.nodeName == "LI") {
        console.log("List item ", choice.target.id.replace("choice-", ""), " was clicked!");
        choiceMade = +choice.target.id.replace("choice-","");
        scoreChoice();
    }
});

// Event listener to monitor which choice the user makes - found at https://davidwalsh.name/event-delegate;

init();
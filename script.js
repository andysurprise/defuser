let questions = [];
let currentQuestionIndex = 0;
let dangerLevel = 0;
const maxDangerLevel = 6;

async function startGame() {
    const startButton = document.getElementById('start-btn');
    startButton.style.display = 'none';
    currentQuestionIndex = 0;
    dangerLevel = 0;
    document.getElementById('result').innerText = '';
    updateDangerMeter();
    await fetchQuestions();
    showQuestion();
}

async function fetchQuestions() {
    const response = await fetch('questions.json');
    questions = await response.json();
}

function showQuestion() {
    resetState();
    const questionElement = document.getElementById('question');
    questionElement.innerText = questions[currentQuestionIndex].question;
    const answers = questions[currentQuestionIndex].answers;
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(answer.correct, button));
        document.getElementById('answer-buttons').appendChild(button);
    });
}

function resetState() {
    const answerButtonsElement = document.getElementById('answer-buttons');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(correct, selectedButton) {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => button.disabled = true);
    if (correct) {
        selectedButton.classList.add('correct');
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                showQuestion();
            } else {
                endGame(true);
            }
        }, 1000);
    } else {
        selectedButton.classList.add('wrong');
        dangerLevel++;
        updateDangerMeter();
        if (dangerLevel >= maxDangerLevel) {
            endGame(false);
        } else {
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    showQuestion();
                } else {
                    endGame(true);
                }
            }, 1000);
        }
    }
}

function updateDangerMeter() {
    const meterFill = document.getElementById('meter-fill');
    const dangerText = document.getElementById('danger-text');
    const percentage = (dangerLevel / maxDangerLevel) * 100;
    meterFill.style.width = `${percentage}%`;

    if (percentage < 50) {
        meterFill.style.backgroundColor = 'green';
    } else if (percentage < 80) {
        meterFill.style.backgroundColor = 'orange';
    } else {
        meterFill.style.backgroundColor = 'red';
    }

    dangerText.innerText = `Danger Level: ${dangerLevel}/${maxDangerLevel}`;
}

function endGame(won) {
    resetState();
    document.getElementById('question').innerText = '';
    const resultElement = document.getElementById('result');
    if (won) {
        resultElement.innerText = 'Congratulations! You have mastered the challenges!';
    } else {
        resultElement.innerText = 'Game Over. Better luck next time!';
    }
    document.getElementById('start-btn').innerText = 'Play Again';
    document.getElementById('start-btn').style.display = 'inline-block';
}

document.getElementById('start-btn').addEventListener('click', startGame);

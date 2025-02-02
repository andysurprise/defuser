let questions = [];
let currentQuestionIndex = 0;
let dangerLevel = 0;

async function fetchQuestions() {
    const response = await fetch('questions.json');
    questions = await response.json();
    showQuestion();
}

function showQuestion() {
    const questionContainer = document.getElementById('question-container');
    const answerButtons = document.getElementById('answer-buttons');
    questionContainer.innerText = questions[currentQuestionIndex].question;
    answerButtons.innerHTML = '';
    questions[currentQuestionIndex].answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.onclick = () => selectAnswer(answer.correct);
        answerButtons.appendChild(button);
    });
}

function selectAnswer(correct) {
    if (!correct) {
        dangerLevel++;
        document.getElementById('dial').style.width = `${dangerLevel * (100 / 6)}%`;
        if (dangerLevel === 6) {
            document.getElementById('result').innerText = 'Boom! You lose!';
            return;
        }
    } else {
        currentQuestionIndex++;
        if (currentQuestionIndex === questions.length) {
            document.getElementById('result').innerText = 'Congratulations! You win!';
            return;
        }
    }
    showQuestion();
}

fetchQuestions();

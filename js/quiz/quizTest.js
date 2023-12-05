const questionsArray = [];
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let answersContainer;
let questionContainer;
let resultsContainer;

// Функция для загрузки вопросов
function loadQuestions() {
    fetch("js/quiz/questions.json")
        .then(response => response.json())
        .then(data => {
            questionsArray.push(...data);
            initializeContainers();
            displayCurrentQuestion();
        })
        .catch(error => console.error("Error fetching questions:", error));
}

// Инициализация контейнеров
function initializeContainers() {
    questionContainer = document.getElementById("question-container");
    answersContainer = document.getElementById("answers-container");
    resultsContainer = document.getElementById("results-container");
}

// Функция для отображения текущего вопроса
function displayCurrentQuestion() {
    const currentQuestion = questionsArray[currentQuestionIndex];

    // Отобразить вопрос (с изображением, если есть)
    questionContainer.innerHTML = `<div id="text-container">
                                      <p>${currentQuestion.question.text}</p>
                                  </div>`;

    if (currentQuestion.question.image) {
        // Если есть изображение, отобразить его
        const imageContainer = document.createElement("div");
        imageContainer.id = "image-container";
        const imageElement = document.createElement("img");
        imageElement.src = currentQuestion.question.image;
        imageElement.alt = "Question Image";
        imageContainer.appendChild(imageElement);
        questionContainer.insertBefore(imageContainer, questionContainer.firstChild);
    }

    // Отобразить текстовые варианты ответов
    answersContainer.innerHTML = "";

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.classList.add('button')
        button.textContent = answer;
        button.addEventListener("click", () => selectAnswer(index));
        answersContainer.appendChild(button);
    });

    // Деактивировать кнопку "Следующий вопрос" при отображении нового вопроса
    hideNextQuestionButton();
}

// Функция для обработки выбора ответа
// ...

// Функция для обработки выбора ответа
function selectAnswer(selectedIndex) {
    const currentQuestion = questionsArray[currentQuestionIndex];

    // Заблокировать кнопки после выбора ответа
    disableAnswerButtons();

    // Подсветить только выбранный ответ
    const selectedButton = answersContainer.getElementsByTagName("button")[selectedIndex];
    const isCorrect = currentQuestion.correctAnswer.includes(currentQuestion.answers[selectedIndex]);

    if (isCorrect) {
        // Правильный ответ - зеленый
        selectedButton.style.backgroundColor = "green";
    } else {
        // Неправильный ответ - красный
        selectedButton.style.backgroundColor = "red";
    }

    // Проверить правильность ответа и увеличить счетчик
    const selectedAnswer = currentQuestion.answers[selectedIndex];
    if (isCorrect) {
        correctAnswersCount++;
    }

    // Проверить, все ли вопросы были выбраны
    const allQuestionsSelected = questionsArray.every(question => question.answers.every(answer => answer.disabled));

    // Активировать кнопку "Следующий вопрос", если все вопросы выбраны
    if (allQuestionsSelected) {
        showNextQuestionButton();
    }
}

function displayCurrentQuestion() {
    const currentQuestion = questionsArray[currentQuestionIndex];

    // Отобразить вопрос (с изображением, если есть)
    questionContainer.innerHTML = `<div id="text-container">
                                      <p class="quiz__question-value">${currentQuestion.question.text}</p>
                                  </div>`;

    if (currentQuestion.question.image) {
        // Если есть изображение, отобразить его
        const imageContainer = document.createElement("div");
        imageContainer.id = "image-container";
        const imageElement = document.createElement("img");
        imageElement.src = currentQuestion.question.image;
        imageElement.classList.add('image-box')
        imageElement.alt = "Question Image";
        imageContainer.appendChild(imageElement);
        questionContainer.insertBefore(imageContainer, questionContainer.firstChild);
    }

    // Отобразить текстовые варианты ответов
    answersContainer.innerHTML = "";

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.classList.add('quiz__option')
        button.textContent = answer;
        button.addEventListener("click", () => selectAnswer(index));
        answersContainer.appendChild(button);
    });

    // Активировать кнопку "Следующий вопрос" при отображении нового вопроса
    showNextQuestionButton();
}

// ...

// Обработчик для кнопки "Следующий вопрос"
function nextQuestion() {
    resetAnswerButtons();
    showQuestion();

    currentQuestionIndex++;
    if (currentQuestionIndex < questionsArray.length) {
        displayCurrentQuestion();
        hideNextQuestionButton(); // Скрыть кнопку "Следующий вопрос" после отображения нового вопроса
    } else {
        showResults();
    }
}


// ...


// Функция для блокировки кнопок после выбора ответа
function disableAnswerButtons() {
    const buttons = answersContainer.getElementsByTagName("button");
    Array.from(buttons).forEach(button => {
        button.disabled = true;
    });
}

// Функция для сброса стилей кнопок перед следующим вопросом
function resetAnswerButtons() {
    const buttons = answersContainer.getElementsByTagName("button");
    Array.from(buttons).forEach(button => {
        button.disabled = false;
        button.style.backgroundColor = "";
    });
}

// Функция для отображения результатов теста
function showResults() {
    const totalQuestions = questionsArray.length;
    const percentage = (correctAnswersCount / totalQuestions) * 100;

    // Скрываем вопросы и кнопку "Следующий вопрос"
    hideQuestion();
    hideNextQuestionButton();

    // Отображаем результаты и кнопку "Пройти тест еще раз"
    resultsContainer.innerHTML = `<p class="quiz__final-text">Тест завершен. Процент правильных ответов: ${percentage.toFixed(2)}%</p>
                                  <button class="quiz__button" onclick="restartQuiz()">Пройти тест еще раз</button>`;

    // Сброс счетчика правильных ответов для возможности повторного прохождения теста
    correctAnswersCount = 0;

    // Сброс индекса текущего вопроса
    currentQuestionIndex = 0;
}

// Функция для скрытия вопросов
function hideQuestion() {
    questionContainer.style.display = "none";
    answersContainer.style.display = "none";
}

// Функция для отображения вопросов
function showQuestion() {
    questionContainer.style.display = "block";
    answersContainer.style.display = "flex";
}

// Функция для скрытия кнопки "Следующий вопрос"
function hideNextQuestionButton() {
    const nextQuestionButton = document.getElementById("next-question-button");
    nextQuestionButton.style.display = "none";
}

// Функция для отображения кнопки "Следующий вопрос"
function showNextQuestionButton() {
    const nextQuestionButton = document.getElementById("next-question-button");
    nextQuestionButton.style.display = "block";
}

// Функция для перехода к следующему вопросу
function nextQuestion() {
    resetAnswerButtons();
    showQuestion();

    currentQuestionIndex++;
    if (currentQuestionIndex < questionsArray.length) {
        displayCurrentQuestion();
        showNextQuestionButton();
    } else {
        showResults();
    }
}

// Функция для перезапуска теста
function restartQuiz() {
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    showQuestion();
    displayCurrentQuestion();
    showNextQuestionButton();
    resultsContainer.innerHTML = ""; // Очищаем результаты
}

// Запуск загрузки вопросов
loadQuestions();

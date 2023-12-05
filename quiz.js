var currentQuestion = 0;
var score = 0;
var questions = [];
var isInputQuestion = false;
var isMultiInputQuestion = false;
var timeToWaitForInput = 1000;

async function loadQuiz() {
    try {
        const response = await fetch('quiz_data.xlsx');
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet_name_list = workbook.SheetNames;
        questions = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        showQuestion();
    } catch (error) {
        console.error('Ошибка при загрузке вопросов из Excel:', error);
    }
}

function showQuestion() {
    var question = questions[currentQuestion];
    $('#question-text').text(question.Question);

    var optionsContainer = $('#options-container');
    optionsContainer.empty();

    isInputQuestion = question.Type.toLowerCase() === 'input';
    isMultiInputQuestion = question.Type.toLowerCase() === 'multiinput';

    if (isInputQuestion || isMultiInputQuestion) {
        var optionsCount = 1;

        while (question['Option' + optionsCount]) {
            var optionText = question['Option' + optionsCount];

            if (isMultiInputQuestion) {
                var label = $('<label>').text(optionText);
                var input = $('<input>').attr('type', 'text').attr('class', 'input-answer').attr('data-index', optionsCount);
                optionsContainer.append(label, input);
            } else {
                var input = $('<input>').attr('type', 'text').attr('class', 'input-answer').attr('data-index', optionsCount);
                optionsContainer.append(input);
            }

            optionsCount++;
        }

        // При вопросах типа input и multiinput кнопка следующего вопроса активна сразу
        $('#next-button').text('Следующий вопрос').prop('disabled', false);
    } else {
        var optionsCount = 1;

        while (question['Option' + optionsCount]) {
            var optionText = question['Option' + optionsCount];
            var optionButton = $('<button>').text(optionText).attr('data-index', optionsCount).click(selectOption);
            optionsContainer.append(optionButton);
            optionsCount++;
        }

        if (question.Type.toLowerCase() === 'single') {
            $('#next-button').text('Следующий вопрос').prop('disabled', true);
        } else {
            $('#next-button').text('Следующий вопрос').prop('disabled', true);
        }
    }

    optionsContainer.find('.input-answer, button').removeClass('correct incorrect');

    var imgPath = question.Img !== '0' ? 'img/quiz/' + question.Img : '';
    $('#question-img').attr('src', imgPath).toggle(imgPath !== '');

    if (question.Type.toLowerCase() === 'multi' || question.Type.toLowerCase() === 'multiinput') {
        correctAnswers = question.CorrectAnswer.split(',').map(Number);
        optionsContainer.addClass('multi');
    } else {
        optionsContainer.removeClass('multi');
    }
}

async function nextQuestion() {
    if (isInputQuestion) {
        await checkInputAnswer();
    } else if (isMultiInputQuestion) {
        await checkMultiInputAnswer();
    } else {
        var question = questions[currentQuestion];
        if (question.Type.toLowerCase() === 'multi' || question.Type.toLowerCase() === 'multiinput') {
            var selectedOptions = $('#options-container button.selected').map(function () {
                return $(this).data('index');
            }).get().sort();

            correctAnswers.sort();

            var isCorrect = JSON.stringify(selectedOptions) === JSON.stringify(correctAnswers);

            $('#options-container button').each(function () {
                var index = $(this).data('index');
                if (correctAnswers.includes(index)) {
                    $(this).addClass('correct');
                } else if (selectedOptions.includes(index)) {
                    $(this).addClass('incorrect');
                }
            });

            if (isCorrect) {
                score++;
            }

            await sleep(timeToWaitForInput);

            $('#options-container button').removeClass('correct incorrect');

            $('#next-button').prop('disabled', false);
        }
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

// Добавим функцию для проверки ответа для вопроса типа input
async function checkInputAnswer() {
    var userAnswer = $('#options-container .input-answer').val();
    // var userAnswer = $('#options-container .input-answer').val().toLowerCase();
    var question = questions[currentQuestion];
    $('#next-button').prop('disabled', true);

    if (userAnswer === question.CorrectAnswer) {
        $('#options-container .input-answer').addClass('correct').css('background-color', 'lightgreen');
        score++;
    } else {
        $('#options-container .input-answer').addClass('incorrect').css('background-color', 'lightcoral');
    }

    await sleep(timeToWaitForInput);

    $('#options-container .input-answer').removeClass('correct incorrect').css('background-color', '');

    $('#next-button').prop('disabled', false);
}

// Добавим новую функцию для проверки ответов для multiinput
async function checkMultiInputAnswer() {
    var userAnswers = $('#options-container .input-answer').map(function () {
        return $(this).val().toLowerCase();
    }).get();

    var correctAnswers = questions[currentQuestion].CorrectAnswer.toLowerCase().split(',');

    var isCorrect = JSON.stringify(userAnswers) === JSON.stringify(correctAnswers);

    $('#options-container .input-answer').each(function (index) {
        if (correctAnswers.includes(userAnswers[index])) {
            $(this).addClass('correct').css('background-color', 'lightgreen');
        } else {
            $(this).addClass('incorrect').css('background-color', 'lightcoral');
        }
    });

    if (isCorrect) {
        score++;
    }

    await sleep(timeToWaitForInput);

    $('#options-container .input-answer').removeClass('correct incorrect').css('background-color', '');

    $('#next-button').prop('disabled', false);
}

function selectOption() {
    var selectedOption = $(this).data('index');
    var question = questions[currentQuestion];

    if (question.Type.toLowerCase() === 'multi' || question.Type.toLowerCase() === 'multiinput') {
        $(this).toggleClass('selected');
        var selectedOptions = $('#options-container button.selected').map(function () {
            return $(this).data('index');
        }).get().sort();

        $('#next-button').prop('disabled', selectedOptions.length === 0);
    } else {
        $('#options-container button').prop('disabled', true);

        if (selectedOption == question.CorrectAnswer) {
            $(this).addClass('correct');
            score++;
        } else {
            $(this).addClass('incorrect');
            $('#options-container button[data-index="' + question.CorrectAnswer + '"]').addClass('correct');
        }

        $('#next-button').prop('disabled', false);
    }
}

function showResult() {
    var resultText = 'Правильных ответов: ' + score + ' из ' + questions.length;
    resultText += ' (' + ((score / questions.length) * 100).toFixed(2) + '%)';
    $('#result-text').text(resultText);

    $('#question-container').hide();
    $('#result-container').show();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$(document).ready(function () {
    loadQuiz();
});

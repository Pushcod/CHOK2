$(document).ready(async function () {
    // Показываем loader перед загрузкой файла
    $("#loader").show();

    try {
        // Загрузка файла Excel
        var filePath = "Fields.xlsx"; // Указать правильный путь
        var data = await loadFileAsync(filePath);

        var workbook = XLSX.read(new Uint8Array(data), { type: "array" });

        // Получение данных из нужного листа
        var sheetName = "Fields";
        var sheet = workbook.Sheets[sheetName];

        // Пример чтения данных из определенных ячеек
        var modalText1 = sheet["A2"] ? sheet["A2"].v : ""; // Информация о контенте
        var modalText2 = sheet["B2"] ? sheet["B2"].v : ""; // Ключевые слова
        var modalText3 = sheet["J2"] ? sheet["J2"].v : ""; // Методические рекомендации ЭОМ 1
        var modalText4 = sheet["K2"] ? sheet["K2"].v : ""; // Методические рекомендации ЭОМ 2
        var modalText5 = sheet["L2"] ? sheet["L2"].v : ""; // Методические рекомендации ЭОМ 3
        var codeSpecialty = sheet["C2"] ? sheet["C2"].v : ""; // Код специальности
        var specialtyName = sheet["D2"] ? sheet["D2"].v : ""; // Название специальности
        var courseCode = sheet["E2"] ? sheet["E2"].v : ""; // Код дисциплины
        var courseTitle = sheet["F2"] ? sheet["F2"].v : ""; // Название дисциплины
        var theme = sheet["G2"] ? sheet["G2"].v : ""; // Тема
        var methodicalRecommendations = sheet["H2"] ? sheet["H2"].v : ""; // Методические рекомендации
        var cocName = sheet["I2"] ? sheet["I2"].v : ""; // Название ЦОК

        // Вставка данных в соответствующие теги
        $("#modal-text-1").html(modalText1);
        $("#modal-text-2").html(modalText2);
        $("#modal-text-3").html(modalText3);
        $("#modal-text-4").html(modalText4);
        $("#modal-text-5").html(modalText5);
        $(".group-info__title").html("ФГОС СПО " + codeSpecialty);
        $(".group-info__subtitle").html(specialtyName);
        $("#courseCode").html(courseCode);
        $("#courseTitle").html(courseTitle);
        $(".headline__theme").html(theme);

        // Проверяем существование элемента перед установкой текста
        var bookContentElement = $("#book-text");
        if (bookContentElement.length) {
            bookContentElement.html(methodicalRecommendations);
        } else {
            console.error("Элемент с id 'book-text' не найден.");
        }

        // Вставка данных в тег title
        $("title").text(cocName);

    } catch (error) {
        console.error("Произошла ошибка при обработке файла:", error);
    } finally {
        // Скрываем loader после загрузки файла
        $("#loader").hide();
    }
});

async function loadFileAsync(filePath) {
    try {
        // Загружаем файл с использованием fetch и возвращаем его в виде ArrayBuffer
        var response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки файла: ${response.statusText}`);
        }
        var data = await response.arrayBuffer();
        return data;
    } catch (error) {
        throw error;
    }
}
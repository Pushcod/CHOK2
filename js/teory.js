$(document).ready(async function () {
    // Показываем loader перед загрузкой файла
    $("#loader").show();

    try {
        // Загрузка файла Excel
        var filePath = "../teory.xlsx"; // Указать правильный путь
        var data = await loadFileAsync(filePath);

        var workbook = XLSX.read(new Uint8Array(data), { type: "array" });

        // Получение данных из нужного листа
        var sheetName = "teory";
        var sheet = workbook.Sheets[sheetName];

        // Пример чтения данных из определенных ячеек
        var imageColumn = "A"; // Столбец с названиями картинок
        var imageNames = [];
        var imageIndex = 2; // Начинаем с индекса 2, пропуская первую строку
        while (sheet[imageColumn + imageIndex]) {
            imageNames.push(sheet[imageColumn + imageIndex].v);
            imageIndex++;
        }

        // Вставка данных в теги с изображениями
        var sliderContainer = $(".quiz__window-swiper");
        var slideTemplate = $(".quiz__window-swiper-slide").first().clone(); // Клонируем первый слайд

        imageNames.forEach(function (imageName) {
            // Создаем копию слайда
            var slideCopy = slideTemplate.clone();

            // Строим путь к изображению
            var imagePath = "img/teory/" + imageName;

            // Устанавливаем путь изображения
            slideCopy.find("img").attr("src", imagePath);

            // Добавляем слайд в слайдер
            sliderContainer.append(slideCopy);
        });

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
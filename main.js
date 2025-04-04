/**
 * Dias Website - Main Loader
 * Загрузчик модулей для сайта Dias
 */

document.addEventListener('DOMContentLoaded', () => {
    // Медиазапросы для разных размеров экрана
    let mm = gsap.matchMedia();

    // Десктопные функции (от 480px и выше)
    mm.add("(min-width: 480px)", () => {
        // Загружаем модули для десктопа
        loadModule('slider-background.js');
        loadModule('services.js');
        loadModule('projects-slider.js');
        loadModule('popups.js');
    });

    // Мобильные функции (до 479px)
    mm.add("(max-width: 479px)", () => {
        // Загружаем модули для мобильных устройств
        loadModule('mobile.js');
    });

    // Функция для загрузки модулей
    function loadModule(moduleName) {
        const script = document.createElement('script');
        script.src = `https://cdn.jsdelivr.net/gh/ВАШ-ЮЗЕРНЕЙМ-GITHUB/dias-website-modules/${moduleName}`;
        script.async = true;
        document.head.appendChild(script);
    }
}); 
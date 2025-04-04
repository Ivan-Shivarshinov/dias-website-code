/**
 * Projects Slider module
 * Модуль для управления слайдером проектов
 */

// Логика инициализации десктопного слайдера
const itemsPerSlide = 3;
const cmsItemSelector = '.projects_slider_elem';
const swiperWrapperSelector = '#my-swiper-container .swiper-wrapper';
const sourceListSelector = '#cms-item-source';
let desktopSwiper = null;
let mobileSwiper = null;

// Инициализация слайдера проектов
initProjectsSlider();

// Создание попапа для просмотра проектов
createProjectPopup();

// Анимация проектов при наведении
initProjectsHoverEffects();

// Обработчик изменения размера окна
window.addEventListener('resize', handleWindowResize);

function initProjectsSlider() {
    // Если это мобильное устройство (менее 480px), инициализируем мобильный слайдер
    if (window.innerWidth < 480) {
        initMobileProjectsSlider();
        return;
    }

    // Иначе инициализируем десктопный слайдер
    initDesktopSlider();
}

function initDesktopSlider() {
    const swiperWrapper = document.querySelector(swiperWrapperSelector);
    const sourceList = document.querySelector(sourceListSelector);

    if (!swiperWrapper || !sourceList) return;

    // Уничтожаем существующий слайдер, если он есть
    if (desktopSwiper) {
        desktopSwiper.destroy(true, true);
        desktopSwiper = null;
    }

    // Очищаем контейнер слайдера
    swiperWrapper.innerHTML = '';

    const allCmsItems = sourceList.querySelectorAll(cmsItemSelector);
    if (allCmsItems.length === 0) return;

    // Создаем слайды для десктопа (по 3 элемента в слайде)
    for (let i = 0; i < allCmsItems.length; i += itemsPerSlide) {
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');

        const itemsForSlide = Array.from(allCmsItems).slice(i, i + itemsPerSlide);

        itemsForSlide.forEach(item => {
            slide.appendChild(item.cloneNode(true));
        });

        swiperWrapper.appendChild(slide);
    }

    // Инициализация слайдера
    desktopSwiper = new Swiper('#my-swiper-container', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        slidesPerGroup: 1,
        centeredSlides: false,
        roundLengths: true,
        watchSlidesProgress: true,

        autoplay: {
            delay: 3000,
            disableOnInteraction: true,
        },

        pagination: {
            el: '#my-swiper-container .swiper-pagination',
            clickable: true,
        },

        navigation: {
            nextEl: '#my-swiper-container .swiper-button-next',
            prevEl: '#my-swiper-container .swiper-button-prev',
        },
    });

    const swiperContainer = document.querySelector('#my-swiper-container');
    let autoplayTimer = null;

    const resumeAutoplay = () => {
        clearTimeout(autoplayTimer);
        autoplayTimer = setTimeout(() => {
            if (desktopSwiper && desktopSwiper.autoplay) {
                desktopSwiper.autoplay.start();
            }
        }, 1000);
    };

    const pauseAutoplay = () => {
        if (desktopSwiper && desktopSwiper.autoplay) {
            desktopSwiper.autoplay.stop();
        }
    };

    if (swiperContainer) {
        swiperContainer.addEventListener('mouseenter', pauseAutoplay);
        swiperContainer.addEventListener('mouseleave', resumeAutoplay);
        swiperContainer.addEventListener('touchend', resumeAutoplay);

        const navigationButtons = swiperContainer.querySelectorAll('.swiper-button-next, .swiper-button-prev, .swiper-pagination-bullet');
        navigationButtons.forEach(button => {
            button.addEventListener('click', resumeAutoplay);
        });
    }
}

function initMobileProjectsSlider() {
    const swiperWrapper = document.querySelector(swiperWrapperSelector);
    const sourceList = document.querySelector(sourceListSelector);

    if (!swiperWrapper || !sourceList) return;

    // Уничтожаем существующий десктопный слайдер, если он есть
    if (desktopSwiper) {
        desktopSwiper.destroy(true, true);
        desktopSwiper = null;
    }

    // Уничтожаем существующий мобильный слайдер, если он есть
    if (mobileSwiper) {
        mobileSwiper.destroy(true, true);
        mobileSwiper = null;
    }

    // Очищаем существующие слайды перед созданием новых
    swiperWrapper.innerHTML = '';

    const allCmsItems = sourceList.querySelectorAll(cmsItemSelector);
    if (allCmsItems.length === 0) return;

    // Создаем слайды для мобильной версии (1 элемент в слайде)
    allCmsItems.forEach(item => {
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');
        slide.appendChild(item.cloneNode(true));
        swiperWrapper.appendChild(slide);
    });

    const swiperContainer = document.querySelector('#my-swiper-container');

    // Проверяем наличие и создаем элементы навигации, если их нет
    let prevButton = swiperContainer.querySelector('.swiper-button-prev');
    let nextButton = swiperContainer.querySelector('.swiper-button-next');

    if (!prevButton) {
        prevButton = document.createElement('div');
        prevButton.className = 'swiper-button-prev';
        swiperContainer.appendChild(prevButton);
    }

    if (!nextButton) {
        nextButton = document.createElement('div');
        nextButton.className = 'swiper-button-next';
        swiperContainer.appendChild(nextButton);
    }

    // Инициализируем мобильный слайдер
    mobileSwiper = new Swiper('#my-swiper-container', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 20,
        centeredSlides: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: true,
        },
        navigation: {
            nextEl: '#my-swiper-container .swiper-button-next',
            prevEl: '#my-swiper-container .swiper-button-prev',
        }
    });

    // Добавляем обработчики для эффекта при тапе на проект в мобильной версии
    const projectItems = document.querySelectorAll('#my-swiper-container .projects_slider_elem');
    projectItems.forEach(item => {
        const blackout = item.querySelector('.projects_blackout');
        const loupe = item.querySelector('.projects_loupe');
        const img = item.querySelector('.projects_img');

        if (!blackout || !loupe || !img) return;

        gsap.set(blackout, { autoAlpha: 0 });
        gsap.set(loupe, { scale: 0.5 });

        const touchAnimation = gsap.timeline({ paused: true });
        touchAnimation
            .to(blackout, {
                autoAlpha: 1,
                duration: 0.3,
                ease: 'power2.inOut'
            })
            .to(loupe, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.inOut'
            }, "-=0.2");

        item.addEventListener('touchstart', () => {
            touchAnimation.play();
        });

        item.addEventListener('touchend', () => {
            touchAnimation.reverse();
        });

        blackout.addEventListener('click', function () {
            const imgSrc = img.getAttribute('src');
            if (imgSrc) {
                openPopup(imgSrc);
            }
        });
    });
}

function handleWindowResize() {
    if (window.innerWidth >= 480) {
        // Переключаемся на десктопный слайдер, если ширина экрана >= 480px
        // и если мобильный слайдер был активен
        if (mobileSwiper && !desktopSwiper) {
            mobileSwiper.destroy(true, true);
            mobileSwiper = null;
            initDesktopSlider();
        }
    } else {
        // Переключаемся на мобильный слайдер, если ширина экрана < 480px
        // и если десктопный слайдер был активен
        if (desktopSwiper && !mobileSwiper) {
            desktopSwiper.destroy(true, true);
            desktopSwiper = null;
            initMobileProjectsSlider();
        }
    }
}

function createProjectPopup() {
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'project-popup-overlay';

    const popupContent = document.createElement('div');
    popupContent.className = 'project-popup-content';

    const popupImage = document.createElement('img');
    popupImage.className = 'project-popup-image';

    const closeButton = document.createElement('button');
    closeButton.className = 'project-popup-close';
    closeButton.innerHTML = `
    <svg width="1.25rem" height="1.25rem" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.5 0.5L13.5 13.5M0.5 13.5L13.5 0.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`;

    popupContent.appendChild(popupImage);
    popupContent.appendChild(closeButton);
    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);

    closeButton.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', function (e) {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && popupOverlay.style.visibility === 'visible') {
            closePopup();
        }
    });

    // Сделаем функции открытия и закрытия попапа глобальными
    window.openPopup = function (imgSrc) {
        popupImage.src = imgSrc;

        popupImage.onload = function () {
            popupOverlay.style.visibility = 'visible';
            popupOverlay.style.opacity = '1';
            popupContent.style.transform = 'scale(1)';
        };

        if (popupImage.complete) {
            popupOverlay.style.visibility = 'visible';
            popupOverlay.style.opacity = '1';
            popupContent.style.transform = 'scale(1)';
        }

        document.body.style.overflow = 'hidden';
    };

    window.closePopup = function () {
        popupOverlay.style.opacity = '0';
        popupContent.style.transform = 'scale(0.95)';

        setTimeout(() => {
            popupOverlay.style.visibility = 'hidden';
            popupImage.src = '';
            document.body.style.overflow = '';
        }, 300);
    };
}

function initProjectsHoverEffects() {
    const projectItems = document.querySelectorAll('.projects_slider_elem');

    projectItems.forEach((item) => {
        const blackout = item.querySelector('.projects_blackout');
        const loupe = item.querySelector('.projects_loupe');
        const img = item.querySelector('.projects_img');

        if (!blackout || !loupe || !img) return;

        gsap.set(blackout, { autoAlpha: 0 });
        gsap.set(loupe, { scale: 0.5 });

        const hoverAnimation = gsap.timeline({ paused: true });

        hoverAnimation
            .to(blackout, {
                autoAlpha: 1,
                duration: 0.5,
                ease: 'power3.inOut'
            })
            .to(loupe, {
                scale: 1,
                duration: 0.5,
                ease: 'power3.inOut'
            }, "-=0.4");

        item.addEventListener('mouseenter', () => {
            hoverAnimation.play();
        });

        item.addEventListener('mouseleave', () => {
            hoverAnimation.reverse();
        });

        blackout.addEventListener('click', function () {
            const imgSrc = img.getAttribute('src');
            if (imgSrc) {
                openPopup(imgSrc);
            }
        });

        blackout.style.cursor = 'pointer';
    });
} 
/**
 * Services module
 * Модуль для управления разделом услуг
 */

// Инициализация эффектов при наведении на элементы услуг
initServicesHoverEffects();

// Инициализация выпадающего списка услуг
initServicesDropdown();

// Инициализация счетчика цифр (с задержкой для гарантии загрузки ScrollTrigger)
setTimeout(() => {
    initNumberCounters();
}, 1000);

function initServicesHoverEffects() {
    const serviceItems = document.querySelectorAll('.services_wrapper');

    serviceItems.forEach(item => {
        const btn = item.querySelector('.services_btn');
        const textElements = item.querySelectorAll('.u-txt-style-h3');

        const btnVisible = btn && window.getComputedStyle(btn).display !== 'none';

        if (!btnVisible) {
            item.style.cursor = 'default';
            item.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
            }, true);
            return;
        }

        let originalBgColor = getComputedStyle(item).backgroundColor;
        let originalTextColors = Array.from(textElements).map(el => getComputedStyle(el).color);
        let originalBtnBg = getComputedStyle(btn).backgroundColor;
        let originalBtnColor = getComputedStyle(btn).color;

        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                backgroundColor: '#dbe3ed',
                duration: .5,
                ease: 'power3.inOut'
            });

            textElements.forEach(el => {
                gsap.to(el, {
                    color: '#101317',
                    duration: .5,
                    ease: 'power3.inOut'
                });
            });

            gsap.to(btn, {
                backgroundColor: '#0a6dff',
                color: '#ffffff',
                duration: .5,
                ease: 'power3.inOut'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                backgroundColor: originalBgColor,
                duration: .5,
                ease: 'power3.inOut'
            });

            textElements.forEach((el, index) => {
                gsap.to(el, {
                    color: originalTextColors[index],
                    duration: .5,
                    ease: 'power3.inOut'
                });
            });

            gsap.to(btn, {
                backgroundColor: originalBtnBg,
                color: originalBtnColor,
                duration: .5,
                ease: 'power3.inOut'
            });
        });
    });
}

function initServicesDropdown() {
    const servicesGrid = document.querySelector('.services_cms-list');
    const showMoreBtn = document.querySelector('.services_show-more');
    const showMoreText = document.querySelector('.services_show-more_txt');
    const showMoreArrow = document.querySelector('.services_show-more_arrow');

    if (!servicesGrid || !showMoreBtn) return;

    const serviceItems = servicesGrid.querySelectorAll('.services_wrapper');

    const originalText = showMoreText ? showMoreText.textContent || 'Ещё' : 'Ещё';

    let isExpanded = false;

    const toggleItems = () => {
        serviceItems.forEach((item, index) => {
            if (index >= 6) {
                const animDuration = 1;
                const animEase = 'power3.inOut';

                if (isExpanded) {
                    item.classList.remove('services_wrapper-hidden');
                    item.style.visibility = 'visible';

                    const estimatedMaxHeight = '50rem';

                    gsap.fromTo(item,
                        { maxHeight: 0, autoAlpha: 0, y: '-1rem', marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, borderTopWidth: 0, borderBottomWidth: 0 },
                        {
                            maxHeight: estimatedMaxHeight,
                            autoAlpha: 1,
                            y: 0,
                            marginTop: '',
                            marginBottom: '',
                            paddingTop: '',
                            paddingBottom: '',
                            borderTopWidth: '',
                            borderBottomWidth: '',
                            duration: animDuration,
                            ease: animEase,
                            clearProps: 'y,marginTop,marginBottom,paddingTop,paddingBottom,borderTopWidth,borderBottomWidth,visibility,opacity'
                        }
                    );

                    gsap.to(showMoreBtn, {
                        marginTop: 0,
                        duration: animDuration,
                        ease: animEase
                    });
                } else {
                    gsap.to(item, {
                        maxHeight: 0,
                        autoAlpha: 0,
                        y: '-1rem',
                        marginTop: 0,
                        marginBottom: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                        duration: animDuration,
                        ease: animEase,
                        onComplete: () => {
                            item.classList.add('services_wrapper-hidden');
                            item.style.visibility = 'hidden';
                        }
                    });

                    gsap.to(showMoreBtn, {
                        marginTop: '-2rem',
                        duration: animDuration,
                        ease: animEase
                    });
                }
            }
        });
    };

    serviceItems.forEach((item, index) => {
        if (index >= 6) {
            gsap.set(item, { maxHeight: 0, autoAlpha: 0, overflow: 'hidden', marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, borderTopWidth: 0, borderBottomWidth: 0, visibility: 'hidden' });
            item.classList.add('services_wrapper-hidden');
        }
    });

    gsap.set(showMoreBtn, { marginTop: '-2rem' });

    showMoreBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;

        const animDuration = 0.3;
        const animEase = 'power2.inOut';

        if (showMoreText) {
            gsap.to(showMoreText, {
                autoAlpha: 0,
                duration: animDuration,
                ease: animEase,
                onComplete: () => {
                    showMoreText.textContent = isExpanded ? 'Скрыть' : originalText;
                    gsap.to(showMoreText, {
                        autoAlpha: 1,
                        duration: animDuration,
                        ease: animEase
                    });
                }
            });
        }

        if (showMoreArrow) {
            gsap.to(showMoreArrow, {
                rotation: isExpanded ? 180 : 0,
                duration: animDuration,
                ease: animEase
            });
        }

        toggleItems();
    });
}

// Инициализация счетчика цифр
function initNumberCounters() {
    const numberElements = document.querySelectorAll('.about_number');
    const aboutSection = document.querySelector('.section_about');

    if (!numberElements.length || !aboutSection) {
        console.log('Элементы счетчика не найдены');
        return;
    }

    // Проверяем доступен ли ScrollTrigger
    if (typeof gsap === 'undefined' || typeof gsap.ScrollTrigger === 'undefined') {
        console.log('ScrollTrigger не доступен, используем простой счетчик');

        // Простая анимация без ScrollTrigger
        numberElements.forEach(element => {
            const originalText = element.textContent;
            const endValue = parseInt(originalText.replace(/\D/g, ''), 10);

            element.textContent = '0';

            let startValue = 0;
            const duration = 2000; // 2 секунды
            const stepTime = 20; // 20 миллисекунд между шагами
            const totalSteps = duration / stepTime;
            const stepValue = endValue / totalSteps;

            const countInterval = setInterval(() => {
                startValue += stepValue;
                if (startValue >= endValue) {
                    element.textContent = originalText;
                    clearInterval(countInterval);
                } else {
                    element.textContent = Math.round(startValue);
                }
            }, stepTime);
        });

        return;
    }

    // Используем ScrollTrigger, если он доступен
    numberElements.forEach(element => {
        const originalText = element.textContent;
        const endValue = parseInt(originalText.replace(/\D/g, ''), 10);

        gsap.set(element, { textContent: '0' });

        const valueObj = { value: 0 };

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: aboutSection,
                start: 'top 80%',
                toggleActions: 'play none none none',
                once: true,
                onEnter: () => console.log('Счетчик запущен')
            }
        });

        tl.to(valueObj, {
            value: endValue,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function () {
                element.textContent = Math.round(valueObj.value);
            },
            onComplete: function () {
                element.textContent = originalText;
                console.log('Анимация счетчика завершена', originalText);
            }
        });
    });
} 
/**
 * Slider Background module
 * Модуль для управления фоновым слайдером
 */

setTimeout(() => {
    initSliderBackground();
}, 500);

function initSliderBackground() {
    const slider = document.querySelector('.hero_slider');
    const section = document.querySelector('.section_hero');

    if (!slider || !section) return;

    section.style.transition = 'background-image 0.3s ease-in-out';

    const backgrounds = [
        'url(https://cdn.prod.website-files.com/67c9bff70f05ccae8ccf42af/67eeb4b9913d798a2b9dadd1_bg-1.avif)',
        'url(https://cdn.prod.website-files.com/67c9bff70f05ccae8ccf42af/67eeb4b96cf42ac582c87cc0_bg-2.avif)',
        'url(https://cdn.prod.website-files.com/67c9bff70f05ccae8ccf42af/67eeb4b90daf0f48e6a70898_bg-3.avif)',
        'url(https://cdn.prod.website-files.com/67c9bff70f05ccae8ccf42af/67eeb4b9913d798a2b9dae25_bg-4.avif)',
        'url(https://cdn.prod.website-files.com/67c9bff70f05ccae8ccf42af/67eeb4b9045f1b0d360f9c31_bg-5.avif)',
        'url(https://cdn.prod.website-files.com/67c9bff70f05ccae8ccf42af/67eeb4b9b4b028da01a0a382_bg-6.avif)',
        'url(https://cdn.prod.website-files.com/67c9bff70f05ccae8ccf42af/67eeb4b97f77fb1c9a206077_bg-7.avif)',
    ];

    const nextArrow = slider.querySelector('.w-slider-arrow-right');
    const prevArrow = slider.querySelector('.w-slider-arrow-left');
    const sliderDots = slider.querySelectorAll('.w-slider-dot');

    let currentSlideIndex = 0;
    let lockAutoDetection = false;
    let autoAdvanceTimer = null;
    const autoAdvanceDelay = 3000;
    let autoAdvanceEnabled = true;

    function setBackgroundByIndex(index, isManualChange = false) {
        if (index >= 0 && index < backgrounds.length && (currentSlideIndex !== index || isManualChange)) {
            currentSlideIndex = index;
            section.style.backgroundImage = backgrounds[index];

            if (isManualChange) {
                lockAutoDetection = true;
                setTimeout(() => lockAutoDetection = false, 1000);
                resetAutoAdvanceTimer();
            }
        }
    }

    function advanceToNextSlide() {
        const nextIndex = (currentSlideIndex + 1) % backgrounds.length;

        if (sliderDots && sliderDots[nextIndex]) {
            sliderDots[nextIndex].click();
        } else if (nextArrow) {
            nextArrow.click();
        } else {
            setBackgroundByIndex(nextIndex, true);
        }
    }

    function resetAutoAdvanceTimer() {
        if (autoAdvanceTimer) {
            clearTimeout(autoAdvanceTimer);
            autoAdvanceTimer = null;
        }

        if (autoAdvanceEnabled) {
            autoAdvanceTimer = setTimeout(advanceToNextSlide, autoAdvanceDelay);
        }
    }

    setBackgroundByIndex(0, true);
    resetAutoAdvanceTimer();

    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            setBackgroundByIndex((currentSlideIndex + 1) % backgrounds.length, true);
        });
    }

    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            setBackgroundByIndex((currentSlideIndex - 1 + backgrounds.length) % backgrounds.length, true);
        });
    }

    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            setBackgroundByIndex(index, true);
        });
    });

    slider.addEventListener('mouseenter', () => {
        autoAdvanceEnabled = false;
        resetAutoAdvanceTimer();
    });

    slider.addEventListener('mouseleave', () => {
        autoAdvanceEnabled = true;
        resetAutoAdvanceTimer();
    });

    slider.addEventListener('touchstart', () => {
        autoAdvanceEnabled = false;
        resetAutoAdvanceTimer();
    });

    slider.addEventListener('touchend', () => {
        setTimeout(() => {
            autoAdvanceEnabled = true;
            resetAutoAdvanceTimer();
        }, 1000);
    });

    const sliderObserver = new MutationObserver(() => {
        if (!lockAutoDetection) {
            checkActiveSlide();
        }
    });

    sliderObserver.observe(slider, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });

    function checkActiveSlide() {
        const slides = slider.querySelectorAll('.w-slide');
        if (slides.length === 0) return;

        const activeSlideByClass = Array.from(slides).findIndex(
            slide => slide.classList.contains('w-active')
        );

        if (activeSlideByClass !== -1 && activeSlideByClass !== currentSlideIndex) {
            setBackgroundByIndex(activeSlideByClass);
            return;
        }

        const activeDotIndex = Array.from(sliderDots).findIndex(
            dot => window.getComputedStyle(dot).backgroundColor === 'rgb(10, 109, 255)'
        );

        if (activeDotIndex !== -1 && activeDotIndex !== currentSlideIndex) {
            setBackgroundByIndex(activeDotIndex);
            resetAutoAdvanceTimer();
        }
    }

    const checkInterval = setInterval(() => {
        if (!lockAutoDetection) {
            checkActiveSlide();
        }
    }, 2000);

    window.addEventListener('beforeunload', () => {
        clearInterval(checkInterval);
        clearTimeout(autoAdvanceTimer);
        sliderObserver.disconnect();
    });

    try {
        if (window.Webflow && window.Webflow.require) {
            const SliderComponent = window.Webflow.require('slider');
            if (SliderComponent && SliderComponent.instances) {
                const sliderInstance = SliderComponent.instances.find(inst =>
                    inst.el && inst.el.contains && inst.el.contains(slider));

                if (sliderInstance) {
                    sliderInstance.onChange = (index) => {
                        setBackgroundByIndex(index, true);
                        resetAutoAdvanceTimer();
                    };
                }
            }
        }
    } catch (err) { }
} 
/**
 * Mobile module
 * Модуль для мобильных функций сайта
 */

// Инициализация мобильного выпадающего меню
initMobileNavDropdown();

// Отключение ссылки на услуги в мобильном меню
disableServicesMenuLink();

// Закрытие меню при клике на ссылку
closeMenuOnNavClick();

// Фиксы для мобильного меню Webflow
initWebflowMobileMenuFixes();

function initMobileNavDropdown() {
    const navServicesWrap = document.querySelector('.nav_services-wrap');
    const navArrow = document.querySelector('.nav_arrow');
    const navCmsWrap = document.querySelector('.nav_cms-wrap');
    const navServicesElements = document.querySelectorAll('.nav_services-elem');

    if (!navServicesWrap || !navArrow || !navCmsWrap) return;

    const originalWrapColor = gsap.getProperty(navServicesWrap, "color");

    gsap.set(navCmsWrap, {
        display: 'none',
        height: 0,
        overflow: 'hidden'
    });

    gsap.set(navServicesElements, {
        autoAlpha: 0,
        y: '-1rem',
        textAlign: 'left',
        justifyContent: 'flex-start',
        marginLeft: 0
    });

    let isOpen = false;

    const toggleDropdown = () => {
        isOpen = !isOpen;

        const targetWrapColor = isOpen ? '#0a6dff' : originalWrapColor;
        const animDuration = 0.3;
        const animEase = 'power2.inOut';

        gsap.to(navArrow, {
            rotation: isOpen ? 90 : 0,
            duration: animDuration,
            ease: animEase
        });

        gsap.to(navServicesWrap, {
            color: targetWrapColor,
            duration: animDuration,
            ease: animEase
        });

        if (isOpen) {
            gsap.set(navCmsWrap, {
                display: 'block'
            });

            gsap.to(navCmsWrap, {
                height: 'auto',
                duration: 0.4,
                ease: 'power2.inOut'
            });

            gsap.to(navServicesElements, {
                autoAlpha: 1,
                y: 0,
                stagger: 0.05,
                duration: 0.3,
                delay: 0.1,
                ease: 'power2.out'
            });

        } else {
            gsap.to(navServicesElements, {
                autoAlpha: 0,
                y: '-1rem',
                stagger: 0.03,
                duration: 0.2,
                ease: 'power2.in'
            });

            gsap.to(navCmsWrap, {
                height: 0,
                duration: 0.3,
                delay: 0.1,
                ease: 'power2.inOut',
                onComplete: () => {
                    gsap.set(navCmsWrap, { display: 'none' });
                }
            });
        }
    };

    navServicesWrap.addEventListener('click', toggleDropdown);

    const mobileDisabledTrigger = document.querySelector('[data-mobile-disabled="true"]');
    if (mobileDisabledTrigger) {
        mobileDisabledTrigger.addEventListener('click', toggleDropdown);
    }
}

function disableServicesMenuLink() {
    const disabledLink = document.querySelector('[data-mobile-disabled="true"]');

    if (disabledLink) {
        disabledLink.addEventListener('click', function (e) {
            if (window.innerWidth <= 479) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }
}

function closeMenuOnNavClick() {
    const menuLinks = document.querySelectorAll('.w-nav-link, .nav_menu_link');
    const menuButton = document.querySelector('.w-nav-button');

    if (!menuLinks.length || !menuButton) return;

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuButton.classList.contains('w--open')) {
                menuButton.click();
            }
        });
    });
}

function initWebflowMobileMenuFixes() {
    const navElement = document.querySelector('.w-nav');
    const menuButton = document.querySelector('.w-nav-button');
    const menuOverlay = document.querySelector('.w-nav-overlay');

    if (!navElement || !menuButton || !menuOverlay) return;

    menuOverlay.addEventListener('click', (event) => {
        const link = event.target.closest('.w-nav-link');
        if (link) {
            const isNavOpen = navElement.classList.contains('w--open');
            const isButtonOpen = menuButton.classList.contains('w--open');

            if (isNavOpen || isButtonOpen) {
                menuButton.click();
            }
        }
    });

    const handleScrollLock = (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const isOpen = navElement.classList.contains('w--open');

                if (isOpen) {
                    document.body.classList.add('body-scroll-locked');
                } else {
                    document.body.classList.remove('body-scroll-locked');
                }
                break;
            }
        }
    };

    const observer = new MutationObserver(handleScrollLock);
    observer.observe(navElement, { attributes: true, attributeFilter: ['class'] });

    if (navElement.classList.contains('w--open')) {
        document.body.classList.add('body-scroll-locked');
    }
} 
/**
 * Popups module
 * Модуль для управления попапами форм
 */

// Инициализация попапа формы
initFormPopup();

// Добавление обработчиков для ссылок пользовательского соглашения
initAgreementLinks();

function initFormPopup() {
    const popup = document.querySelector('.popup_form');
    const closeBtn = document.querySelector('.popup_close');
    const formBlock = document.querySelector('.popup_form-block');

    if (!popup || !closeBtn) return;

    closeBtn.innerHTML = `
    <svg width="1.25rem" height="1.25rem" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.5 0.5L13.5 13.5M0.5 13.5L13.5 0.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`;

    gsap.set(popup, {
        autoAlpha: 0,
        display: 'none'
    });

    gsap.set(formBlock, {
        scale: 1,
        y: 20
    });

    function openPopup() {
        gsap.set(popup, { display: 'flex' });

        const timeline = gsap.timeline();

        timeline
            .to(popup, {
                autoAlpha: 1,
                duration: 0.3,
                ease: 'power3.inOut'
            })
            .to(formBlock, {
                scale: .75,
                y: 0,
                duration: 0.3,
                ease: 'power3.out'
            }, '-=0.2');

        document.body.style.overflow = 'hidden';
    }

    function closePopup() {
        const timeline = gsap.timeline({
            onComplete: () => {
                gsap.set(popup, { display: 'none' });
                document.body.style.overflow = '';
            }
        });

        timeline
            .to(formBlock, {
                scale: 0.9,
                y: 20,
                duration: 0.2,
                ease: 'power3.in'
            })
            .to(popup, {
                autoAlpha: 0,
                duration: 0.2,
                ease: 'power3.inOut'
            }, '-=0.1');
    }

    document.querySelectorAll('[data-popup="form"]').forEach(button => {
        button.addEventListener('click', openPopup);
    });

    closeBtn.addEventListener('click', closePopup);

    popup.addEventListener('click', function (e) {
        if (e.target === popup) {
            closePopup();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && gsap.getProperty(popup, 'opacity') > 0) {
            closePopup();
        }
    });
}

function initAgreementLinks() {
    document.querySelectorAll('.form_link').forEach(span => {
        span.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('/user-agreement', '_blank');
        });
    });
} 
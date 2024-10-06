document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelector('.image');
    const slideElements = document.querySelectorAll('.bags');
    const totalSlides = slideElements.length;
    let currentIndex = 0;
    const slideInterval = 5000;

    function updateSlider() {
        const offset = -currentIndex * 100;
        slides.style.transform = `translateX(${offset}%)`;
    }

    function goToNextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }

    function goToPreviousSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    let autoSlide = setInterval(goToNextSlide, slideInterval);

    document.querySelector('.ctl_left').addEventListener('click', () => {
        clearInterval(autoSlide);
        goToPreviousSlide();
        autoSlide = setInterval(goToNextSlide, slideInterval);
    });

    document.querySelector('.ctl_right').addEventListener('click', () => {
        clearInterval(autoSlide);
        goToNextSlide();
        autoSlide = setInterval(goToNextSlide, slideInterval);
    });

    document.querySelector('.slider').addEventListener('mouseover', () => {
        clearInterval(autoSlide);
    });

    document.querySelector('.slider').addEventListener('mouseout', () => {
        autoSlide = setInterval(goToNextSlide, slideInterval);
    });
});

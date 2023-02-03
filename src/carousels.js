const track = document.querySelector('.carousel__track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel__button--right');
const prevButton = document.querySelector('.carousel__button--left');
const dotsNav = document.querySelector('.carousel__nav');
const dots = Array.from(dotsNav.children);

const slideWidth = slides[0].getBoundingClientRect().width;

// Arrange the slides next to one another

const setSlidePosition = (slide, index) => {
  slide.style.left = slideWidth * index + 'px';
};
slides.forEach(setSlidePosition);

const moveToSlide = (track, currentSlide, targetSlide) => {
  track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
  currentSlide.classList.remove('current-slide');
  targetSlide.classList.add('current-slide');
};

const updateDots = (currentDot, targetDot) => {
  currentDot.classList.remove('current-slide');
  targetDot.classList.add('current-slide');
};

const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
  if (targetIndex === 0) {
    prevButton.classList.add('visually-hidden');
    nextButton.classList.remove('visually-hidden');
  } else if (targetIndex === slides.length - 1) {
    prevButton.classList.remove('visually-hidden');
    nextButton.classList.add('visually-hidden');
  } else {
    prevButton.classList.remove('visually-hidden');
    nextButton.classList.remove('visually-hidden');
  }
};

// Move slides to the left, when clicking left button
prevButton.addEventListener('click', (e) => {
  const currentSlide = track.querySelector('.current-slide');
  const prevSlide = currentSlide.previousElementSibling;
  const currentDot = dotsNav.querySelector('.current-slide');
  const prevDot = currentDot.previousElementSibling;
  const prevIndex = slides.findIndex((slide) => slide === prevSlide);

  moveToSlide(track, currentSlide, prevSlide);
  updateDots(currentDot, prevDot);
  hideShowArrows(slides, prevButton, nextButton, prevIndex);
});

// Move slides to the right, when clicking right button
nextButton.addEventListener('click', (e) => {
  const currentSlide = track.querySelector('.current-slide');
  const nextSlide = currentSlide.nextElementSibling;
  const currentDot = dotsNav.querySelector('.current-slide');
  const nextDot = currentDot.nextElementSibling;
  const nextIndex = slides.findIndex((slide) => slide === nextSlide);

  moveToSlide(track, currentSlide, nextSlide);
  updateDots(currentDot, nextDot);
  hideShowArrows(slides, prevButton, nextButton, nextIndex);
});

// When clicking on nav indicators, move to that slide

dotsNav.addEventListener('click', (e) => {
  // What indicator was clicked on?
  const targetDot = e.target.closest('button');

  if (!targetDot) return;

  const currentSlide = track.querySelector('.current-slide');
  const currentDot = dotsNav.querySelector('.current-slide');
  const targetIndex = dots.findIndex((dot) => dot === targetDot);
  const targetSlide = slides[targetIndex];

  moveToSlide(track, currentSlide, targetSlide);
  updateDots(currentDot, targetDot);
  hideShowArrows(slides, prevButton, nextButton, targetIndex);
});

// ? Product carousel

document.addEventListener('mouseout', disableCardAnimate);
document.addEventListener('DOMContentLoaded', animateStatus);
const wrapper = document.querySelector('.swiper-wrapper');

const swiper = new Swiper('.hero-slider', {
  slidesPerView: 1,
  breakpoints: {
    768: {
      slidesPerView: 2,
    },
  },
  slideToClickedSlide: true,
  centeredSlides: true,
  observer: true,
  observeParents: true,
});

function cardAnimate(e) {
  this.querySelectorAll('.swiper-slide-active .product').forEach(function (boxMove) {
    const x = -(wrapper.offsetWidth / 3 - e.pageX) / 90;
    const y = (wrapper.offsetHeight / 3 - e.pageY) / 120;

    boxMove.style.transform = 'rotateY(' + x + 'deg) rotateX(' + y + 'deg)';
  });
  this.querySelectorAll('.animate-item').forEach(function (itemMove) {
    const movingValue = itemMove.getAttribute('data-value');
    console.log(movingValue);
    const x = (wrapper.offsetWidth - e.pageX * movingValue) / 230;
    const y = (wrapper.offsetHeight - e.pageY * movingValue) / 230;
    itemMove.style.transform = 'translate(' + y + 'px,' + x + 'px)';
  });
}

function disableCardAnimate() {
  this.querySelectorAll('.swiper-slide-active .product').forEach(function (boxMove) {
    boxMove.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

function animateStatus() {
  if (window.innerWidth > 768) {
    wrapper.addEventListener('mousemove', cardAnimate);
  }
}

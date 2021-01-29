const accordeonList = document.querySelectorAll('.accordeon__item');

accordeonList.forEach((item) => {
  item.addEventListener('click', function () {
    this.classList.toggle('accordeon-content--active');
  });
});

const header = document.querySelector('.header');
const navMain = header.querySelector('.main-nav');
const navToggle = navMain.querySelector('.main-nav__toggle');

navToggle.addEventListener('click', () => {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
    header.style = `margin-bottom: 100px`;
  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
    header.removeAttribute('style');
  }
});

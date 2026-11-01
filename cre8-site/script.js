const filterButtons = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.contest-card')];
const searchInput = document.querySelector('#search');
const emptyState = document.querySelector('#emptyState');
let activeFilter = 'Все';

function updateContests() {
  const query = searchInput.value.trim().toLocaleLowerCase('ru');
  let visible = 0;
  cards.forEach(card => {
    const categoryMatches = activeFilter === 'Все' || card.dataset.category === activeFilter;
    const searchMatches = card.dataset.title.toLocaleLowerCase('ru').includes(query);
    card.hidden = !(categoryMatches && searchMatches);
    if (!card.hidden) visible++;
  });
  emptyState.hidden = visible > 0;
}

filterButtons.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach(item => item.classList.toggle('active', item === button));
  updateContests();
}));
searchInput.addEventListener('input', updateContests);

document.querySelectorAll('.category-card').forEach(card => card.addEventListener('click', () => {
  activeFilter = card.dataset.filter;
  filterButtons.forEach(button => button.classList.toggle('active', button.dataset.filter === activeFilter));
  updateContests();
  document.querySelector('#contests').scrollIntoView({ behavior: 'smooth' });
}));

const menuToggle = document.querySelector('#menuToggle');
const nav = document.querySelector('#nav');
menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

document.querySelector('#subscribeForm').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.querySelector('#email');
  document.querySelector('#formMessage').textContent = `Спасибо! Адрес ${email.value} добавлен.`;
  email.value = '';
});

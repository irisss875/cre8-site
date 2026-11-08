const filterButtons = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.contest-card')];
const searchInput = document.querySelector('#search');
const emptyState = document.querySelector('#emptyState');
const dialog = document.querySelector('#siteDialog');
const dialogBody = document.querySelector('#dialogBody');
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

function openDialog(markup) {
  dialogBody.innerHTML = markup;
  dialog.showModal();
}

function openContest(card) {
  const title = card.dataset.title;
  openDialog(`<p class="eyebrow">${card.dataset.category.toLocaleUpperCase('ru')} · CRE8</p>
    <h2 id="dialogTitle">${title}</h2>
    <p class="dialog-description">${card.dataset.description}</p>
    <div class="dialog-facts"><span>Срок подачи<b>до ${card.dataset.deadline}</b></span><span>Призовой фонд<b>${card.dataset.prize}</b></span></div>
    <p class="demo-note">Условия и сроки в карточке — демонстрационные.</p>
    <p class="photo-credit">Фото: <a href="${card.dataset.creditUrl}" target="_blank" rel="noreferrer">${card.dataset.credit}</a></p>
    <button class="button button-dark dialog-action" type="button" data-apply="${card.dataset.title}">Подать заявку <span>↗</span></button>`);
}

function openApplication(title) {
  openDialog(`<p class="eyebrow">ЗАЯВКА НА КОНКУРС</p><h2 id="dialogTitle">${title}</h2>
    <p class="dialog-description">Заполните демонстрационную форму, чтобы посмотреть, как будет выглядеть подача заявки.</p>
    <form class="application-form" id="applicationForm">
      <label>Ваше имя<input name="name" autocomplete="name" required placeholder="Как к вам обращаться"></label>
      <label>Email<input name="email" type="email" autocomplete="email" required placeholder="name@example.com"></label>
      <label>Ссылка на работу<input name="portfolio" type="url" placeholder="https://"></label>
      <button class="button button-dark" type="submit">Проверить заявку <span>↗</span></button>
    </form>
    <p class="demo-note">Демо-форма ничего не отправляет и не сохраняет.</p>`);
  document.querySelector('#applicationForm').addEventListener('submit', event => {
    event.preventDefault();
    openDialog(`<p class="eyebrow">ДЕМО-РЕЖИМ</p><h2 id="dialogTitle">Форма заполнена</h2><p class="dialog-description">Интерфейс заявки работает. Чтобы организаторы получали настоящие заявки, нужно подключить сервер или сервис форм.</p><button class="button button-dark dialog-action" type="button" data-close-dialog>Понятно</button>`);
  });
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

document.querySelector('#contestGrid').addEventListener('click', event => {
  const button = event.target.closest('[data-action="details"]');
  const card = event.target.closest('.contest-card');
  if (button && card) openContest(card);
});

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

document.querySelector('[data-open-login]').addEventListener('click', () => {
  openDialog(`<p class="eyebrow">ЛИЧНЫЙ КАБИНЕТ</p><h2 id="dialogTitle">Скоро увидимся!</h2><p class="dialog-description">Вход и регистрация пока не подключены. Для реальных аккаунтов нужна серверная часть сайта.</p><a class="button button-dark dialog-action" href="#contests" data-close-link>Посмотреть конкурсы <span>↗</span></a>`);
});

document.querySelector('#subscribeForm').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.querySelector('#email');
  document.querySelector('#formMessage').textContent = 'Демо: адрес не отправлен. Для настоящей подписки подключается рассылка.';
  email.value = '';
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
  const applyButton = event.target.closest('[data-apply]');
  if (applyButton) openApplication(applyButton.dataset.apply);
  if (event.target.closest('[data-close-dialog]')) dialog.close();
  if (event.target.closest('[data-close-link]')) dialog.close();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

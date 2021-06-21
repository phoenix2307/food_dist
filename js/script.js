window.addEventListener('DOMContentLoaded', () => {

  // Tabs

  const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items');

  function hideTabContent() { // скрываем содержимое tabs
    tabsContent.forEach(item => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    tabs.forEach(item => {
      item.classList.remove('tabheader__item_active');
      // удаляем класс active у всех
    });
  }

  function showTabContent(i = 0) { // i = 0 - таким образом можно выставлять параметры по умолчанию
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent(); // показывает первый в псевдомассиве таб

  // вешаем собитые на родителя:
  tabsParent.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.classList.contains('tabheader__item')) {
      /* необходимо перебрать псевдомассив tabs и сравнить item с нашим target
      если все сходится, то взять порядковый номер item в псевдомассиве и передать его в функцию showTabContent() */
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent(); // сначала скрываем все, чтобы на экране освободилось место
          showTabContent(i); // показываем на странице выбранный элемент
        }
      });
    }
  });

  // Timer

  /*
  Работа с таймером:
    1. нужна функция, по которой работает таймер и отображает время
    2. нужна функция работы со временем (текущее время, конец отсчета и разница между ними)
    3. нужна функция, котория будет обовлять состояние таймера.
 
  */

  let deadline = '2021-06-23'; // строка. Сюда могут приходить данные с инпута админки
  // функция работы со временем (текущаее время, конец отсчета и разница между ними)
  function getTimeRemaining(endtime) {
    //необх перевести строчный формат в датовый
    let t = Date.parse(endtime) - Date.parse(new Date()); // разница времени в милисекундах
    const days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60) % 24)),
      minutes = Math.floor((t / (1000 * 60) % 60)),
      seconds = Math.floor((t / 1000) % 60);

    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  // вывод работы таймера на страницу

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      let time = getTimeRemaining(endtime); // сколько времени осталось до конца

      days.innerHTML = getZero(time.days);
      hours.innerHTML = getZero(time.hours);
      minutes.innerHTML = getZero(time.minutes);
      seconds.innerHTML = getZero(time.seconds);

      if (time.total <= 0) { // time.total - разница между текущим и заданным временем
        clearInterval(timeInterval);
      }
    }
  }

  setClock('.timer', deadline);


});
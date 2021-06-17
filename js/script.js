window.addEventListener('DOMContentLoaded', () => {

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

});
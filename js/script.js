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

    let deadline = '2022-06-23'; // строка. Сюда могут приходить данные с инпута админки
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

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'), // все тригеры
        modal = document.querySelector('.modal'), // само окно
        modalCloseBtn = document.querySelector('[data-close]'); //крестик на модальном окне

    // закрытие и открытие модалок выносим в отдельную функции, 
    // так как этот код вызывается несколько раз в разных событиях

    function openModal() {
        modal.classList.add('show'); // данные класы включают и выключают видимость нашего элемента
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'; // блокировка прокрутки страницы во время открытого модального окна;
        clearInterval(modalTimerId);
    }

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = ''; // возобновление прокрутки страницы

    }

    modalCloseBtn.addEventListener('click', closeModal);

    // выключение модалки по клику на подложку

    modal.addEventListener('click', (event) => {
        if (event.target === modal) { // modal - наш элемент с модальным окном
            closeModal();
        }
    });

    // выключение модалки при нажатии ESC

    document.addEventListener('keydown', (event) => { // keydown - событие - "клавиша нажата"
        if (event.code === 'Escape' && modal.classList.contains('show')) { // .code - свойство event
            closeModal();
        }
    });

    // всплытие модалки по времени

    const modalTimerId = setInterval(openModal, 3000);

    // всплытие модалки по скролингу

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            // document.documentElement.scrollHeight - максимальная высота содержимого элемента
            // clientHeight - высота клиента (высота видимого диапазона страницы)
            // window.pageYOffset - позиция по оси Y
            openModal();
            window.removeEventListener('scroll', showModalByScroll); // убираем событие
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Используем классы для карточек товара

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes; // добавляем оставшиеся параметры (...rest)
            //при этом нам в любом случае возвращается массив (даже если он пустой)
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27; // курс валюты
            this.changeToUAH(); // при запуске этого метода у новообразованного объекта
            // происходит присвоение аргументу price, уже видоизмененной отконвертированой цены
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() { // генерация html для div, который разместим потом в родительском контейнере
            const element = document.createElement('div');
            this.classes.forEach(className => element.classList.add(className));
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    /*
    создаем ноывый обьект и вызываем метод render()
    возможный вариант действий:

    const div = new MenuCard(); //нужные аргументы
    div.render();

    это стандартный способ, но можно и покороче: не ложить новый объект в переменную а вызвать его. 
    Это при случае когда он вызывается один раз и дальше не учавствует в коде

    new MenuCard().render();
    */

    const div = new MenuCard( //нужные аргументы
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container',
        'menu__item',
        'big'
    );
    div.render();
    const div2 = new MenuCard( //нужные аргументы
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        10,
        '.menu .container',
        'menu__item'
    );
    div2.render();
    const div3 = new MenuCard( //нужные аргументы
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        20,
        '.menu .container',
        'menu__item'
    );
    div3.render();

});
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
        modal = document.querySelector('.modal'); // само окно
    //крестик на модальном окне
    // modalCloseBtn = document.querySelector('[data-close]'); эту строку убрали в связи невозможностью обрабатывать событие крестик при динамическом html

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

    // modalCloseBtn.addEventListener('click', closeModal); эту строку убрали в связи невозможностью обрабатывать событие крестик при динамическом html

    // выключение модалки по клику на подложку

    modal.addEventListener('click', (event) => {
        // modal - наш элемент с модальным окном
        if (event.target === modal || event.target.getAttribute('data-close') == '') { //ИЛИ целевой элемент имеет атрибут data-close, в нашем случае это крестик
            closeModal();
            //то есть событие сработает при клике на подложке модалки или крестика
        }
    });

    // выключение модалки при нажатии ESC

    document.addEventListener('keydown', (event) => { // keydown - событие - "клавиша нажата"
        if (event.code === 'Escape' && modal.classList.contains('show')) { // .code - свойство event
            closeModal();
        }
    });

    // всплытие модалки по времени

    const modalTimerId = setTimeout(openModal, 50000);

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

    class MenuCard {// unit 48
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
            <div class="menu__item">
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
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

    const getResource = async (url) => { //функция-шаблон для геттинга данных от сервера
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json(); // return дожидается выполнения промиса res.json() и только тогда возвращает егов виде js-объекта
    };
     // Вариант 1 получения данных с сервера и генерации карточек товара с помощью класса MenuCard
    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => {//используем деструктуризацию объекта
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     });

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {//используем деструктуризацию объекта
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    // Вариант 2 получения данных с сервера и генерации карточки товара с помощью функции, без класса

    // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));

    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         const element = document.createElement('div');

    //         element.classList.add('menu__item');

    //         element.innerHTML = `
    //         <img src=${img} alt=${altimg}>
    //         <h3 class="menu__item-subtitle">${title}</h3>
    //         <div class="menu__item-descr">${descr}</div>
    //         <div class="menu__item-divider"></div>
    //         <div class="menu__item-price">
    //             <div class="menu__item-cost">Цена:</div>
    //             <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //         </div>
    //         `;

    //         document.querySelector('.menu .container').append(element);
    //     });
    // }

    // Forms

    const forms = document.querySelectorAll('form');

    const message = { //заготовки сообщений о статусе запроса для пользователя
        loading: 'img/form/spinner.svg',
        succes: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => { //функция-шаблон для постинга данных на сервер
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        }); 

        return await res.json(); // return дожидается выполнения промиса res.json() и только тогда возвращает егов виде js-объекта
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); //отключение параметров по умолчанию для события (e), то есть перезагрузка страницы
            // это обязательная первая строка в AJAX-запросах

            const statusMessage = document.createElement('img'); //тут будет спинер
            statusMessage.src = message.loading;
            //добавить стили, для вывода спинера в центр экрана
            //вообще-то правильнее будет добавить эти стили в css-файл, и оттуда подтягивать соответствующий класс
            statusMessage.style.cssText = `
                display: block;
                margin:0 auto;
            `;

            // дальше нужно это вывести на страницу
            // form.append(statusMessage); более гибкий вариант - insertAdjacentElement 
            form.insertAdjacentElement('afterend', statusMessage);

            //метод POST и путь куда отправляются данные server.php

            // request.setRequestHeader('Content-type', 'miltipart/form-data');
            //!!! ВАЖНО. при использовании XMLHttpRequest в связке с FormDate заголовки указываются автоматически. Если его указать, то при получении ответа от сервера мы получаем пустой объект от вместо объекта с теми данными, которые мы отправили через форму.
            // При такой связке нет необходимости прописывать заголовки setRequestHeader()
            // но можно создать стандартный обьект и потом перевести его в json и  дальше работать с ним:

            //Отправка данных в формате JSON
            //1. Обязательно прописываем заголовки
            // request.setRequestHeader('Content-type', 'application/json');

            const formData = new FormData(form); // форма, с которой мы берем данные

            // 2. Для работы с FormData (а это специфичный объект) придется сначала перевести его в стандартный объект
            //Распрлстраненный метод:
            // const object = {};
            // formData.forEach(function (value, key) {
            //     object[key] = value;
            // });
            // Продвинутый метод:
            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.succes);
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                });
        });
    }

    function showThanksModal(message) {
        //берем существующее модальное окно
        const prevModalDialog = document.querySelector('.modal__dialog');
        // скрываем его содержимое
        prevModalDialog.classList.add('hide');
        //запускаем модальное окно
        openModal();
        //создаем div-обертку нового модального окна
        const thanksModal = document.createElement('div');
        //добавляем емустили от старого модального
        thanksModal.classList.add('modal__dialog');
        //формирование верстки нового модального окна
        //не забываем, что крестик (<div class="modal__close" data-close>&times;</div>)
        //который создается динамически не сможет обрабатывать событие закрытия окна
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        //добавить сгенерированный html на страницу
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove(); //удаление динамического блока
            prevModalDialog.classList.add('show'); //отображение старого окна
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    // Слайдер - unit 61

    const slides = document.querySelectorAll('.offer__slide'),
          slider = document.querySelector('.offer__slider'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width; // получение параметра ширины через ComputedStyle для окошка, через которое будем смотреть на нашу карусель слайдов
    let slideIndex = 1; //индекс слайда в нашем каталоге слайдов
    let offset = 0; // отступ

    if (slides.length < 10) {//отображение общего количества слайдов
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    if (slides.length < 10) {//отображение общего количества слайдов
        total.textContent = `0${slides.length}`;
    } else {
        total.textContent = slides.length;
    }    if (slides.length < 10) {//отображение общего количества слайдов
        total.textContent = `0${slides.length}`;
    } else {
        total.textContent = slides.length;
    }

    slidesField.style.width = 100 * slides.length + '%';//задаем ширину
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';


    slides.forEach(slide => {
        slide.style.width = width; // подгоняем все слайды под один размер
    });

    // выделяем слайдер в отдельный блок + точки перелистывания картинок
    // для них тоже нужна своя оболочка, чтобы работать с ними отдельно
    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
          dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1); // присваивание каждой точке-индикатору атрибута, чтобы понимать какая точка к какому слайдеру будет привязана
        //выглядит атрибут так: data-slide-to="3"
        // не до конца понял, почему он это использует, и как оно работает. урок 63 (5:52).
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if (i == 0) {
            dot.style.opacity = 1; //100% непрозрачности
        }
        indicators.append(dot);
        //в процессе прохождения цикла for создается еще и массив точек dots
        dots.push(dot);

    }


    // используем регул. выражение (replace/\D/g, ''), которое убирает из строки не числа, в нашем случае это 'px'
    // регулярку ставиим вместо метода slice: +width.slice(0, width.length - 2)
    //помещаем этот метод в техническую функцию

    function deleteNotDigit(str) {
        return +str.replace(/\D/g, '');
    }

    next.addEventListener('click', () => {
        //задаем условие если это последний слайд...
        if (offset == deleteNotDigit(width) * (slides.length - 1)) {
            //поскольку width это строка с значением '500px', то сначала преобразовать в число и убрать 'px', то есть последние два символа
            offset = 0; // сдвигаем окно в начало цикла показов
        } else {
            offset += deleteNotDigit(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;//сдвиг элемента по горизонтали в пикселях

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = deleteNotDigit(width) * (slides.length - 1);
        } else {
            offset -= deleteNotDigit(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;//сдвиг элемента по горизонтали в пикселях

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = offset = deleteNotDigit(width) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            if (slides.length < 10) {
                current.textContent = `0${slideIndex}`;
            } else {
                current.textContent = slideIndex;
            }

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[slideIndex - 1].style.opacity = 1;

        });
    });

    // Calc

    //результат работы калькулятора
    const result = document.querySelector('.calculating__result span');
    let sex= 'female',
    height, weight, age,
    ratio = 1.375; // данные, которые будут использоваться в работе калькулятора по умолчанию. ratio - уровень активности

    //общая формула для подсчета
    function calcTotal() {
        // необходимо делать проверку данных для работы калькулятора
        // потому что кальк будет работать только тогда, когда будут заполнены все данные
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = 'Введите все данные';
            return; // для того, чтобы прервать нашу ф-цию в случае остутсвия каких-то данных
        }

        if (sex === 'female') {
            //используем формулу вычисления каллорий из статьи
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            // формула для мужчин
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }

    }

    calcTotal();

    // получение данных для калькулятора со статических элементов (div)
    // эта ф-ция будет реагировать на клики, которые делаются либо по выбору активности (через data-ratio)
    // либо по выбору пола (через id)
    function getStaticInformation(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);
        // `${parentSelector} div` - получение всех дивов внутри родительского элемента. В нашем случае это уровень активности. Они идентифицируются по data-atribut
        // а activeClass - класс активности, который присваивается выбранному статичесому элементу (меняется цвет кнопки и т.д.)

        document.querySelector(parentSelector).addEventListener('click', (e) => {
            // используем элемент события
            if (e.target.getAttribute('data-ratio')) { // если мы кликаем по элементам активности
                ratio = +e.target.getAttribute('data-ratio');
                // если у объекта события есть атрибут data-ratio, то переменной ratio присваиваем значение элемента события, то есть значение data-ratio (здесб это хначения коэфициента активности, прописано прямо в html)
            } else {// если мы не кликнули по выбору активности, то работаем с данными пола (sex)
                sex = e.target.getAttribute('id'); // либо женщина, либо мужчина
            }

            console.log(ratio, sex);

            // перебираем элементы. Сначала убираем класс активности у всех, а потом присваиваем элементу на котором зафиксировано событие - клик
            elements.forEach(elem => {
                elem.classList.remove(activeClass);
            });

            e.target.classList.add(activeClass);

            calcTotal();
        });
    }

    // запуск ф-ции getStaticInformation для выбора пола
    // в качестве родителя указываем id, который йесть у div с выбором пола
    getStaticInformation('#gender', 'calculating__choose-item_active');

    // запуск ф-ции getStaticInformation для типа активности
    // в качестве родителя указываем class, который йесть у div с выбором активности
    getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');
    //дважды запускаем ф-цию для того, чтобы обработчик события прошел оба родительских дива



    // получение данных с input
    function getDynamicInformation(selectorInput) {
        const input = document.querySelector(selectorInput);

        input.addEventListener('input', () => {
            // проверяем статус input с помощью switch case
            // и при получении данных в какой-то input, эти данные поступают в определенную переменную
            switch(input.getAttribute('id')) {// id, которые есть у каждого input
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }

            calcTotal();
            //функцию calcTotal() вызываем сразу после input. Это позволяет получить результат обработки сразу после введения данных input

        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age ');

    // урок калькулятор 25:38
});
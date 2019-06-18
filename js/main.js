'use strict';
// основная форма для создания объявления
var adForm = document.querySelector('.ad-form');
var adFormHeader = adForm.querySelector('.ad-form-header');
var adFormFieldsets = adForm.querySelectorAll('.ad-form__element');
var adFormAddress = adForm.querySelector('#address');
// форма с фильтрами
var filtersForm = document.querySelector('.map__filters');
var filters = filtersForm.querySelectorAll('.map__filter');
var features = filtersForm.querySelector('.map__features');
// Карта и параметры меток
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;
var mapBlock = document.querySelector('.map');
var pinMain = mapBlock.querySelector('.map__pin--main');
var pinMainLocationX;
var pinMainLocationY;
// шаблон .map__pin
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

// Возвращает случайное целое число между min (включительно) и max (не включая max)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// создаёт объект с данными для элемента map__pin
function getPin(n) {
  var offerTypes = ['palace', 'flat', 'house', 'bungalo'];
  var pin = {};
  pin.author = {
    avatar: 'img/avatars/user0' + n + '.png'
  };
  pin.offer = {
    type: offerTypes[getRandomInt(0, offerTypes.length)]
  };
  pin.location = {
    x: getRandomInt(MAP_PIN_WIDTH, mapBlock.offsetWidth - MAP_PIN_WIDTH),
    y: getRandomInt(130 + MAP_PIN_HEIGHT, 630)
  };
  return pin;
}

// создаёт моки
function getPinsMock(n) {
  var mockArr = [];
  for (var i = 1; i <= n; i++) {
    mockArr.push(getPin(i));
  }

  return mockArr;
}

// создаём массив входных данных(Моки)
var PinsMock = getPinsMock(8);

// создаёт DOM-элемент map__pin из шаблона
function renderPin(pin) {
  var pinElement = mapPinTemplate.cloneNode(true);
  pinElement.style = 'left: ' + (pin.location.x - Math.floor(MAP_PIN_WIDTH / 2)) + 'px; top: ' + (pin.location.y - MAP_PIN_HEIGHT) + 'px;';
  pinElement.firstElementChild.src = pin.author.avatar;
  pinElement.firstElementChild.alt = pin.offer.type;

  return pinElement;
}

// Создаёт фрагмента с элементами
function getPinsFragment() {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < PinsMock.length; i++) {
    fragment.appendChild(renderPin(PinsMock[i]));
  }

  return fragment;
}

// записывает координаты главной метки в input с адресом
function writePinMainLocation() {
  adFormAddress.value = pinMainLocationX + ',' + pinMainLocationY;
}

// переход в исходное (неактивное состояние страницы)
function switchPageToInitialState() {
  adFormHeader.disabled = true;
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].disabled = true;
  }
  //
  features.disabled = true;
  for (i = 0; i < filters.length; i++) {
    filters[i].disabled = true;
  }
  //
  mapBlock.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  // вычислеие координат главной метки
  pinMainLocationX = Math.floor(pinMain.offsetLeft + pinMain.offsetWidth / 2);
  pinMainLocationY = Math.floor(pinMain.offsetTop + pinMain.offsetHeight / 2);
  // запись координат метки в input
  writePinMainLocation();
}

// переход в акивное состояние страницы
function swithPageToActiveState() {
  adFormHeader.disabled = false;
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].disabled = false;
  }
  //
  features.disabled = false;
  for (i = 0; i < filters.length; i++) {
    filters[i].disabled = false;
  }
  //
  mapBlock.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  // вычислеие координат главной метки
  pinMainLocationX = Math.floor(pinMain.offsetLeft + pinMain.offsetWidth / 2);
  // TODO: я не учитывал свойство transform для псевдоэлемента, если его учесть, то нужно ещё на 6px уменьшить координату по Y:
  pinMainLocationY = Math.floor(pinMain.offsetTop + pinMain.offsetHeight + parseInt(getComputedStyle(pinMain, '::after').height, 10));
  // запись координат метки в input
  writePinMainLocation();
  // Вставка в DOM фрагмента с метками:
  document.querySelector(' .map__pins').appendChild(getPinsFragment());
}

// ВАЛИДАЦИЯ полей формы
var houseTypeInput = adForm.querySelector('#type');
var hosePriceInput = adForm.querySelector('#price');
var timeIn = adForm.querySelector('#timein');
var timeOut = adForm.querySelector('#timeout');
// TODO: не знаю, можно ли использовать getElementsByTagName, вроде рекомендовали только querySelector,а как им по тэгу искать я не понял
var timeInOptions = timeIn.getElementsByTagName('option');
var timeOutOptions = timeOut.getElementsByTagName('option');

var houseTypes = [
  {
    type: 'bungalo',
    minPrice: '0'
  },
  {
    type: 'flat',
    minPrice: '1000'
  },
  {
    type: 'house',
    minPrice: '5000'
  },
  {
    type: 'palace',
    minPrice: '10000'
  }
];

// в зависимости от типа жилья меняет цену
function checkPriceInput() {
  for (var i = 0; i < houseTypes.length; i++) {
    if (houseTypes[i].type === houseTypeInput.value) {
      hosePriceInput.placeholder = houseTypes[i].minPrice;
      houseTypeInput.min = houseTypes[i].minPrice;
    }
  }
}

// синхронизирует время заезда и выезда
// TODO: может стоит в одну функцию следующие две объеденить
function setTimeOutAsTimeIn() {
  for (var i = 0; i < timeInOptions.length; i++) {
    if (timeInOptions[i].selected) {
      timeOutOptions[i].selected = true;
    }
  }
}

function setTimeInAsTimeOut() {
  for (var i = 0; i < timeOutOptions.length; i++) {
    if (timeOutOptions[i].selected) {
      timeInOptions[i].selected = true;
    }
  }
}

// Запускаем обработчики
switchPageToInitialState();
pinMain.addEventListener('click', swithPageToActiveState); // TODO: здесь вроде надо обрабатывать не клик, а mouseup
houseTypeInput.addEventListener('change', checkPriceInput);
timeIn.addEventListener('change', setTimeOutAsTimeIn);
timeOut.addEventListener('change', setTimeInAsTimeOut);

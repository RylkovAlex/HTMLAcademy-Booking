'use strict';
// основная форма для создания объявления
var adForm = document.querySelector('.ad-form');
var adFormHeader = adForm.querySelector('.ad-form-header');
var adFormFieldsets = adForm.querySelectorAll('.ad-form__pinMain');
var adFormAddress = adForm.querySelector('#address');
var isFormActive = false;
// форма с фильтрами
var filtersForm = document.querySelector('.map__filters');
var filters = filtersForm.querySelectorAll('.map__filter');
var features = filtersForm.querySelector('.map__features');
// Карта и параметры меток
var TOP_BORDER = 130;
var LOWER_BORDER = 630;
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;
var mapBlock = document.querySelector('.map');
var pinMain = mapBlock.querySelector('.map__pin--main');
var PIN_MAIN_MARKER_TRANSLATE_Y = -6; // transform у псевдоэлемента, для вычисления точных размеров метки
var pinMainHeight = pinMain.offsetHeight + parseInt(getComputedStyle(pinMain, '::after').height, 10) + PIN_MAIN_MARKER_TRANSLATE_Y;
var pinMainLocationX;
var pinMainLocationY;
var wasPinMoved = false;
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
    y: getRandomInt(TOP_BORDER + MAP_PIN_HEIGHT, LOWER_BORDER)
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
function writePinMainLocationToInput() {
  // вычислеие координат главной метки
  if (isFormActive) {
    pinMainLocationX = Math.floor(pinMain.offsetLeft + pinMain.offsetWidth / 2);
    pinMainLocationY = Math.floor(pinMain.offsetTop + pinMain.offsetHeight + pinMainHeight);
  }
  pinMainLocationX = Math.floor(pinMain.offsetLeft + pinMain.offsetWidth / 2);
  pinMainLocationY = Math.floor(pinMain.offsetTop + pinMain.offsetHeight / 2);
  // запись в инпут
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
}
switchPageToInitialState();

// переход в акивное состояние страницы
function startPageToActiveState() {
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
  // Вставка в DOM фрагмента с метками:
  document.querySelector(' .map__pins').appendChild(getPinsFragment());
  // Обработчики на поля формы:
  houseTypeInput.addEventListener('change', checkPriceInput);
  timeIn.addEventListener('change', setTimeOutAsTimeIn);
  timeOut.addEventListener('change', setTimeInAsTimeOut);
}

function startPage() {
  writePinMainLocationToInput();
  if (wasPinMoved) {
    startPageToActiveState();
  }
}

startPage();

// ВАЛИДАЦИЯ полей формы
var houseTypeInput = adForm.querySelector('#type');
var hosePriceInput = adForm.querySelector('#price');
var timeIn = adForm.querySelector('#timein');
var timeOut = adForm.querySelector('#timeout');
var timeInOptions = timeIn.querySelectorAll('option');
var timeOutOptions = timeOut.querySelectorAll('option');

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
      hosePriceInput.min = houseTypes[i].minPrice;
    }
  }
}

// синхронизирует время заезда и выезда
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

// вычисляет координаты элемента относительно страницы
function getCoords(elem) {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset,
    right: box.left + pageXOffset + elem.offsetWidth,
    bottom: box.top + pageYOffset + elem.offsetHeight
  };
}

var pinMainMoveContainer = document.querySelector('.map__pins');
var pinMainMoveZone = getCoords(pinMainMoveContainer);

pinMain.addEventListener('mousedown', function (mousedownEvt) {
  // текущие координаты метки:
  var pinMainCoords = getCoords(pinMain);
  // текущие координаты курсора
  var Coords = {
    x: mousedownEvt.clientX,
    y: mousedownEvt.clientY
  };
  // смещение курсора относительно левого-верхнего угла элемента
  var shiftX = mousedownEvt.clientX - pinMainCoords.left;
  var shiftY = mousedownEvt.clientY - pinMainCoords.top;
  // подготовка к перемещению
  pinMain.style.position = 'absolute';
  pinMain.style.zIndex = 10;
  // реализует перемещение
  function buttonMoveHandler(moveEvt) {
    wasPinMoved = true;
    moveEvt.preventDefault();
    // расчёт смещения
    var shift = {
      x: Coords.x - moveEvt.clientX,
      y: Coords.y - moveEvt.clientY
    };
    // границы области для перемещения
    if ((moveEvt.clientX > pinMainMoveZone.left + shiftX) &&
        (moveEvt.clientX < pinMainMoveZone.right - pinMain.offsetWidth + shiftX) &&
        (moveEvt.clientY < pinMainMoveZone.bottom - pinMainHeight + shiftY) &&
        (moveEvt.clientY > pinMainMoveZone.top + shiftY + TOP_BORDER)
    ) {
      // перезапись координат курсора
      Coords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      // перемещение элемента на вычисленное смещение
      pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';
      pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';
      // запись координат метки в инпут
      writePinMainLocationToInput();
    }
  }

  // первое перемещение метки переводит страницу в активное состояние:
  function buttonStartMoveHandler() {
    startPageToActiveState();
    document.removeEventListener('mousemove', buttonStartMoveHandler);
  }

  function buttonMouseUpHandler() {
    document.removeEventListener('mousemove', buttonMoveHandler);
    document.removeEventListener('mouseup', buttonMouseUpHandler);
    document.removeEventListener('mousemove', buttonStartMoveHandler);
  }

  document.addEventListener('mousemove', buttonMoveHandler);
  document.addEventListener('mousemove', buttonStartMoveHandler);
  document.addEventListener('mouseup', buttonMouseUpHandler);

});

pinMain.ondragstart = function () {
  return false;
};


// pinMain.addEventListener('click', swithPageToActiveState);

'use strict';

var MAP_PIN_WIDTH = 50;
var MAP_PIN_HIGHT = 70;
var mapBlock = document.querySelector('.map');
mapBlock.classList.remove('map--faded');

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
    y: getRandomInt(130 + MAP_PIN_HIGHT, 630)
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
  pinElement.style = 'left: ' + (pin.location.x - Math.floor(MAP_PIN_WIDTH / 2)) + 'px; top: ' + (pin.location.y - MAP_PIN_HIGHT) + 'px;';
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

// Вставка в DOM:
document.querySelector(' .map__pins').appendChild(getPinsFragment());

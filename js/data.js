'use strict';
(function () {
  // Карта и параметры меток
  var TOP_BORDER = 130;
  var LOWER_BORDER = 630;
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var mapBlock = document.querySelector('.map');
  // шаблон .map__pin
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // создаёт объект с данными для элемента map__pin
  function getPin(n) {
    var offerTypes = ['palace', 'flat', 'house', 'bungalo'];
    var pin = {};
    pin.author = {
      avatar: 'img/avatars/user0' + n + '.png'
    };
    pin.offer = {
      type: offerTypes[window.util.getRandomInt(0, offerTypes.length)]
    };
    pin.location = {
      x: window.util.getRandomInt(MAP_PIN_WIDTH, mapBlock.offsetWidth - MAP_PIN_WIDTH),
      y: window.util.getRandomInt(TOP_BORDER + MAP_PIN_HEIGHT, LOWER_BORDER)
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

  window.PinsFragment = getPinsFragment();

  function delatePins() {
    var mapPins = document.querySelectorAll('.map__pin');
    for (var i = 1; i < mapPins.length; i++) {
      mapPins[i].remove();
    }
  }
  // TODO: здесь исправить баг, чтоб ловить mouseup только у метки, которую двигаем, а не везде и всегда по документу.
  document.addEventListener('mouseup', function () {
    // document.querySelector(' .map__pins').appendChild(window.PinsFragment);
    delatePins();
    PinsMock = getPinsMock(8);
    window.PinsFragment = getPinsFragment();
    // document.querySelector(' .map__pins').appendChild(window.PinsFragment);
  });
})();

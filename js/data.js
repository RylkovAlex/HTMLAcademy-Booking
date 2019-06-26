'use strict';
(function () {
  // Карта и параметры меток
  var TOP_BORDER = 130;
  var LOWER_BORDER = 630;
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var mapBlock = document.querySelector('.map');
  var pinMain = mapBlock.querySelector('.map__pin--main');
  var PinsMock;
  var pinsFragment;

  // шаблон .map__pin
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  pinMain.addEventListener('mousedown', pinMainMousedownHandler);

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

  // удаление меток с карты
  function deletePins() {
    var mapPins = document.querySelectorAll('.map__pin');
    for (var i = 1; i < mapPins.length; i++) {
      mapPins[i].remove();
    }
  }

  // обработчик создаст и вставит новый фрагмент на карту при перемещении метки
  function pinMainMousedownHandler() {
    var wasPinMoved = false;
    // создаём массив входных данных(Моки)
    PinsMock = getPinsMock(8);
    // делаем из них фрагмент для вставки в DOM
    pinsFragment = getPinsFragment();
    // добавляем обработчик движения
    document.addEventListener('mousemove', pinMainMousemoveHandler);
    document.addEventListener('mouseup', pinMainMouseupHandler);

    function pinMainMousemoveHandler() {
      // если движение произошло, то удаляем всё с карты:
      deletePins();
      wasPinMoved = true;
      document.removeEventListener('mousemove', pinMainMousemoveHandler);
    }

    function pinMainMouseupHandler() {
      // движение закончилось: вставляем новые метки на карту
      if (wasPinMoved) {
        document.querySelector(' .map__pins').appendChild(pinsFragment);
      }
      document.removeEventListener('mouseup', pinMainMouseupHandler);
      document.removeEventListener('mousemove', pinMainMousemoveHandler);
    }
  }

})();

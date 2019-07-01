'use strict';
(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var mapBlock = document.querySelector('.map');
  var pinMain = mapBlock.querySelector('.map__pin--main');

  // шаблон .map__pin
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  pinMain.addEventListener('mousedown', pinMainMousedownHandler);

  // ----------------------------------

  // обработчик запросит с сервера данные по похожим объявлениям, создаст и вставит новый фрагмент c метками на карту, при перемещении pinMain
  function pinMainMousedownHandler() {
    var wasPinMoved = false;
    // добавляем обработчик движения
    document.addEventListener('mousemove', pinMainMousemoveHandler);
    document.addEventListener('mouseup', pinMainMouseupHandler);

    function pinMainMousemoveHandler(e) {
      // TODO: странно, но при обычном клике всё-равно срабатывает pinMainMousemoveHandler именно поэтому мне приходится проверять e.movementX и e.movementY
      if (e.movementX !== 0 | e.movementY !== 0) {
        wasPinMoved = true;
        // если движение произошло, то удаляем всё с карты:
        // deletePins();
        document.removeEventListener('mousemove', pinMainMousemoveHandler);
      }
    }

    function pinMainMouseupHandler() {
      // движение закончилось: делаем запрос на сервер и вставляем новые метки на карту
      if (wasPinMoved) {
        window.backend.load(insertPinsFragment, createErrorMessage);
      }
      document.removeEventListener('mouseup', pinMainMouseupHandler);
      document.removeEventListener('mousemove', pinMainMousemoveHandler);
    }
  }

  // создаёт DOM-элемент map__pin из шаблона
  function renderPin(pin) {
    var pinElement = mapPinTemplate.cloneNode(true);
    pinElement.style = 'left: ' + (pin.location.x - Math.floor(MAP_PIN_WIDTH / 2)) + 'px; top: ' + (pin.location.y - MAP_PIN_HEIGHT) + 'px;';
    pinElement.firstElementChild.src = pin.author.avatar;
    pinElement.firstElementChild.alt = pin.offer.type;
    return pinElement;
  }

  // создаёт сообщение об ошибке
  function createErrorMessage(errorMessage) {
    // шаблон сообщения об ошибке
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorBlock = errorTemplate.cloneNode(true);
    var tryagainButton = errorBlock.querySelector('.error__button');
    errorBlock.style.zIndex = 3;
    errorBlock.querySelector('.error__message').textContent = errorMessage;
    // вставка сообщения в DOM в main:
    document.body.insertAdjacentElement('afterBegin', errorBlock);
    tryagainButton.addEventListener('click', function (e) {
      e.preventDefault();
      errorBlock.remove();
    });
    document.addEventListener('click', function documentClickHandler() {
      errorBlock.remove();
      document.removeEventListener('click', documentClickHandler);
    });
    document.addEventListener('keydown', function documentKeydownHandler(evt) {
      window.util.isEscEvent(evt, function () {
        errorBlock.remove();
        document.removeEventListener('keydown', documentKeydownHandler);
      });
    });
  }

  window.createErrorMessage = createErrorMessage;

  // Создаёт фрагмента с элементами
  function insertPinsFragment(data) {
    window.pinData = data;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      fragment.appendChild(renderPin(data[i]));
    }
    document.querySelector(' .map__pins').appendChild(fragment);
  }

  // удаление меток с карты, n - кол-во меток, которое нужно оставить в DOM'е
  function deletePins(n) {
    var mapPins = document.querySelectorAll('.map__pin');
    for (var i = 1 + n; i < mapPins.length; i++) {
      mapPins[i].remove();
    }
  }

  window.deletePins = deletePins;

})();

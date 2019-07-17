'use strict';
(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var QUANTITY = 5; // максимальное кол-во отображаемых пинов

  var mapBlock = document.querySelector('.map');
  var pinMain = mapBlock.querySelector('.map__pin--main');

  // шаблон .map__pin
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  pinMain.addEventListener('mousedown', pinMainMousedownHandler);

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
      if (wasPinMoved && window.adsDefaultData === null) {
        window.backend.load(successHandler, createErrorMessage);
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
    pinElement.locX = pin.location.x;
    pinElement.locY = pin.location.y;
    return pinElement;
  }

  // создаёт сообщение об ошибке
  function createErrorMessage(errorMessage) {
    // шаблон сообщения об ошибке
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorBlock = errorTemplate.cloneNode(true);
    var tryagainButton = errorBlock.querySelector('.error__button');
    tryagainButton.focus();
    errorBlock.style.zIndex = 100;
    errorBlock.querySelector('.error__message').textContent = errorMessage;
    // вставка сообщения в DOM в main:
    document.body.insertAdjacentElement('afterBegin', errorBlock);
    tryagainButton.addEventListener('click', function (e) {
      e.preventDefault();
      errorBlock.remove();
    });

    document.addEventListener('click', removeErrorMessage);
    document.addEventListener('keydown', documentKeydownHandler);

    function documentKeydownHandler(evt) {
      window.util.isEscEvent(evt, function () {
        removeErrorMessage();
      });
    }

    function removeErrorMessage() {
      errorBlock.remove();
      document.removeEventListener('keydown', documentKeydownHandler);
      document.removeEventListener('click', removeErrorMessage);
    }
  }

  window.createErrorMessage = createErrorMessage;

  // обрабатывает успешный ответ с сервера
  function successHandler(data) {
    getAdsData(data);
    insertPinsFragment(window.adsDefaultData, QUANTITY);
  }

  // Запоминает данные с сервера
  function getAdsData(data) {
    // Если в объекте с описанием объявления отсутствует поле offer, то метка объявления не должна отображаться на карте, поэтому такие объявления сразу откидываю:
    window.adsDefaultData = data.filter(function (it) {
      return (it.offer !== undefined);
    });
    window.adsFilteredData = window.adsDefaultData;
  }

  // Создаёт фрагмента с элементами
  function insertPinsFragment(data, n) {
    var quantity = data.length > n ? n : data.length;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < quantity; i++) {
      fragment.appendChild(renderPin(data[i]));
    }
    document.querySelector(' .map__pins').appendChild(fragment);
  }

  window.insertPinsFragment = insertPinsFragment;

  // удаление меток с карты, n - кол-во меток, которое нужно оставить в DOM'е
  function deletePins(n) {
    var mapPins = document.querySelectorAll('.map__pin');
    for (var i = 1 + n || 1; i < mapPins.length; i++) {
      mapPins[i].remove();
    }
  }

  window.deletePins = deletePins;

})();
